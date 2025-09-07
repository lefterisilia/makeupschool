const nodemailer = require("nodemailer");

const TO_EMAIL       = process.env.TO_EMAIL;
const GMAIL_USER     = process.env.GMAIL_USER;   // Gmail/Workspace address you own
const GMAIL_PASS     = process.env.GMAIL_PASS;   // Google App Password (not your real pwd)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://www.makeupschoolbyelenaenglezou.com";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,           // TLS
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 10000,
    socketTimeout: 20000,
});

exports.handler = async (event) => {
    // Preflight
    if (event.httpMethod === "OPTIONS") {
        return resp(200, "");
    }

    if (event.httpMethod !== "POST") {
        return resp(405, { error: "Method not allowed" });
    }

    // Require JSON
    const ct = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
        return resp(415, { error: "Content-Type must be application/json" });
    }

    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return resp(400, { error: "Invalid JSON" });
    }

    // Extract + normalize
    const hp      = (payload.company || "").trim(); // honeypot; must be empty
    const name    = (payload.name || "").trim();
    const email   = (payload.email || "").trim().toLowerCase();
    const phone   = (payload.phone || "").trim();
    const subject = (payload.subject || "").trim();
    const message = (payload.message || "").trim();

    // Honeypot trip
    if (hp) return resp(400, { error: "Bad request" });

    // Required fields
    if (!name || !email || !phone || !subject || !message) {
        return resp(400, { error: "Missing required form fields" });
    }

    // Length limits
    if (name.length > 80 || subject.length > 120 || message.length > 2000 || phone.length > 40) {
        return resp(400, { error: "Field too long" });
    }

    // Light validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return resp(400, { error: "Invalid email" });
    const phoneOk = /^[\d+(). \-]{6,40}$/.test(phone);
    if (!phoneOk) return resp(400, { error: "Invalid phone" });

    // Compose plain-text email
    const mailText = [
        "New contact form submission:",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message
    ].join("\n");

    try {
        await transporter.sendMail({
            from: `"${sanitizeHeader(name)}" <${GMAIL_USER}>`, // send FROM your Gmail (DMARC-safe)
            replyTo: email,                                    // replies go to the visitor
            to: TO_EMAIL,
            subject: `Contact Form: ${subject}`.slice(0, 240),
            text: mailText,
        });

        return resp(200, { message: "Email sent successfully!" });
    } catch (err) {
        console.error("Email Error:", err);
        return resp(500, { error: "Failed to send email" });
    }
};

// Basic header sanitization to avoid CRLF injection in display name
function sanitizeHeader(s) {
    return String(s).replace(/[\r\n]+/g, " ").replace(/["<>]/g, "");
}

function resp(statusCode, bodyObj) {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Content-Type": "application/json",
        },
        body: typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj),
    };
}
