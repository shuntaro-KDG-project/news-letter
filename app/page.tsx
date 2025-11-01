"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);

    try {
      const res = await fetch("api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("ok");
        setMsg(data.message);
        setEmail("");
      } else {
        setStatus("err");
        setMsg(data.message);
      }
    } catch {
      setStatus("err");
      setMsg("通信エラー");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border rounded px-3 py-2 required:border-pink-500"
            />
            <button
              className={`bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 hover:cursor-pointer`}
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "送信中" : "登録"}
            </button>
          </form>
          {msg && (
            <p
              className={`mt-4 text-sm ${
                status === "ok" ? "text-green-600" : "text-red-600"
              }`}
            >
              {msg}
            </p>
          )}
          <div className="mt-6 text-sm">
            <Link href="/subscribers" className="text-purple-600 underline">
              登壇者一覧
            </Link>
          </div>
        </h1>
      </div>
    </main>
  );
}
