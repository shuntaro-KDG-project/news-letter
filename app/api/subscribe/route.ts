import { transporter } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const { email: raw } = await req.json();
    const email = String(raw || "")
      .trim()
      .toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "無効なメールアドレス" },
        { status: 400 }
      );
    }

    // supabaseに保存
    const { error } = await supabaseAdmin
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { message: "既に登録済みです" },
          { status: 409 }
        );
      }
      console.error("DB error:", error);
      return NextResponse.json(
        { message: "サーバーエラー (DB)" },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "メールマガジンへようこそ",
      html: `<p>こんにちは! ${email}、登録ありがとうございます</p>`,
    });

    return NextResponse.json({ message: "登録完了しました" }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("API error:", err.message);
    } else {
      // Errorインスタンスではない、予期せぬエラーの場合
      console.error("Unknown API error:", err);
      return NextResponse.json({ message: "" }, { status: 500 });
    }
  }
}
