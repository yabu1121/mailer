import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_GMAILUSER,
        pass: process.env.NEXT_PUBLIC_GMAILPASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: "hayabusa115346@gmail.com",
      subject: `[お問い合わせ] ${name} 様より`,
      text: `${message} (from ${email})`,
      html: `
        <p>名前: ${name}</p>
        <p>メール: ${email}</p>
        <p>メッセージ:</p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


