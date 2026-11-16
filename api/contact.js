const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

const text = (value) => (typeof value === "string" ? value.trim() : "");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
  if (website) return res.status(202).json({ success: true, emailSent: false });

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }
  if (!isEmail(email) || email.length > 160) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ error: "Please enter a message between 10 and 4000 characters." });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!turnstileToken) {
      return res.status(400).json({ error: "Please complete the bot check and try again." });
    }
    try {
      const forwarded = text(req.headers["x-forwarded-for"]).split(",")[0].trim();
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: forwarded,
        }),
      });
      const result = await verification.json();
      if (!verification.ok || !result.success) {
        return res.status(400).json({ error: "The bot check expired. Please try again." });
      }
    } catch (err) {
      console.error("Turnstile verification failed:", err);
      return res.status(503).json({ error: "The bot check is temporarily unavailable. Please try again." });
    }
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Contact form is missing RESEND_API_KEY");
    return res.status(503).json({ error: "The contact form is not configured yet." });
  }

  const to = process.env.CONTACT_TO || "umar24nov@gmail.com";
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  const html = `
    <div style="font-family: 'JetBrains Mono', monospace; background: #0a0a0f; color: #e6e6f0; padding: 24px; border-radius: 8px;">
      <div style="font-size: 12px; letter-spacing: 3px; color: #00ff88; margin-bottom: 16px;">NEW PORTFOLIO CONTACT</div>
      <p style="margin: 4px 0;"><strong style="color: #ff6b35;">NAME:</strong> ${esc(name)}</p>
      <p style="margin: 4px 0;"><strong style="color: #ff6b35;">EMAIL:</strong> ${esc(email)}</p>
      <p style="margin: 4px 0;"><strong style="color: #ff6b35;">TOPIC:</strong> ${esc(topic || "(none)")}</p>
      <div style="margin-top: 16px; border-top: 1px solid #33334d; padding-top: 16px; white-space: pre-wrap;">${esc(message)}</div>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: `Mohd Umar <${from}>`,
        to,
        reply_to: email,
        subject: `New contact from ${name}${topic ? ` - ${topic}` : ""}`,
        html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend error:", response.status, errText);
      return res.status(502).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true, emailSent: true });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
