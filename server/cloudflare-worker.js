import express from "express";
import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";

const app = express();
app.use(express.json({ limit: "12kb" }));
app.disable("x-powered-by");

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "portfolio-api" }));

app.post("/api/contact", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "";
  const website = typeof req.body?.website === "string" ? req.body.website.trim() : "";

  // The optional honeypot catches basic form bots without burdening real visitors.
  if (website) return res.status(202).json({ ok: true });
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: "Please enter a valid name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return res.status(400).json({ error: "Please enter a valid email address." });
  if (message.length < 10 || message.length > 4000) return res.status(400).json({ error: "Please enter a message between 10 and 4000 characters." });
  if (!env.DB) return res.status(503).json({ error: "Contact storage is not configured yet." });

  const ip = req.headers["cf-connecting-ip"] || "unknown";
  try {
    const rate = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM contact_messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
    ).bind(await hashIp(ip, env.IP_HASH_SALT || "portfolio")).first();
    if (rate?.total >= 5) return res.status(429).json({ error: "Please wait a while before sending another message." });

    await env.DB.prepare(
      "INSERT INTO contact_messages (name, email, topic, message, ip_hash) VALUES (?, ?, ?, ?, ?)",
    ).bind(name, email, topic.slice(0, 80), message, await hashIp(ip, env.IP_HASH_SALT || "portfolio")).run();
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Contact submission failed", error);
    return res.status(500).json({ error: "Your message could not be saved. Please try again later." });
  }
});

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

app.listen(3000);
export default httpServerHandler({ port: 3000 });
