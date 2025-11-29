"use client";

import Link from "next/link";

export function Auth() {
  return (
    <div className="flex gap-4 text-sm">
      <Link href="auth/login">ログイン</Link>
      <Link href="auth/logout">ログアウト</Link>
    </div>
  );
}
