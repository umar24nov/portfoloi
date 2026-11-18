const text = (value) => (typeof value === "string" ? value.trim() : "");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const PRIMARY_CONTACT_URL = "https://mohammadumar.site/api/contact";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);
  const topic = text(body.topic) || text(body.subject);
  const website = text(body.website);
  const turnstileToken = text(body.turnstileToken);

  // Honeypot: pretend success so bots do not learn the field is checked.
  if (website) return res.status(202).json({ ok: true });

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }
  if (!isEmail(email) || email.length > 160) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: "Please enter a message between 10 and 4000 characters." });
  }

  // The primary Worker owns storage and Turnstile verification. This legacy
  // function forwards the token without consuming it locally, and sends no email.
  try {
    const response = await fetch(PRIMARY_CONTACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, topic, turnstileToken }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: payload.error || "The contact service is unavailable right now." });
    }
    return res.status(response.status).json({ ok: true });
  } catch (err) {
    console.error("Contact forwarding failed:", err);
    return res.status(502).json({ error: "The contact service is temporarily unavailable. Please try again later." });
  }
}
