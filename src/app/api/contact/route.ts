import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend instance will gracefully fail if no API key is provided
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real scenario with a valid key, this would send an email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
      await resend.emails.send({
        from: "DIONOVA Contact <onboarding@resend.dev>",
        to: ["support@dionova.com"], // Replace with your actual support email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h3>New Message from ${name} (${email})</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } else {
      console.log("Mocking email send because RESEND_API_KEY is not configured.");
      console.log({ name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
