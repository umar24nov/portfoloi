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
  const turnstileToken = typeof req.body?.turnstileToken === "string" ? req.body.turnstileToken : "";

  // The optional honeypot catches basic form bots without burdening real visitors.
  if (website) return res.status(202).json({ ok: true });
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: "Please enter a valid name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return res.status(400).json({ error: "Please enter a valid email address." });
  if (message.length < 10 || message.length > 4000) return res.status(400).json({ error: "Please enter a message between 10 and 4000 characters." });
  if (env.TURNSTILE_SECRET) {
    if (!turnstileToken) return res.status(400).json({ error: "Please complete the bot check and try again." });
    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: turnstileToken, remoteip: req.headers["cf-connecting-ip"] || "" }),
      });
      const result = await verification.json();
      if (!verification.ok || !result.success) return res.status(400).json({ error: "The bot check expired. Please try again." });
    } catch (error) {
      console.error("Turnstile verification failed", error);
      return res.status(503).json({ error: "The bot check is temporarily unavailable. Please try again." });
    }
  }
  if (!env.DB || !env.IP_HASH_SALT) return res.status(503).json({ error: "Contact storage is not configured yet." });

  const ip = req.headers["cf-connecting-ip"] || "unknown";
  try {
    const ipHash = await hashIp(ip, env.IP_HASH_SALT);
    const saved = await env.DB.prepare(
      "INSERT INTO contact_messages (name, email, topic, message, ip_hash) SELECT ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM contact_messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')) < 5",
    ).bind(name, email, topic.slice(0, 80), message, ipHash, ipHash).run();
    if (saved.meta.changes === 0) return res.status(429).json({ error: "Please wait a while before sending another message." });
    let emailSent = false;
    if (env.EMAIL && env.CONTACT_TO && env.CONTACT_FROM) {
      try {
        await env.EMAIL.send({
          to: env.CONTACT_TO,
          from: env.CONTACT_FROM,
          replyTo: email,
          subject: `Portfolio message: ${topic.slice(0, 80) || "Hello"}`,
          text: `From: ${name} <${email}>\nTopic: ${topic || "Not specified"}\n\n${message}`,
        });
        emailSent = true;
      } catch (mailError) {
        console.error("Contact notification email failed", mailError);
      }
    }
    return res.status(201).json({ ok: true, emailSent });
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
