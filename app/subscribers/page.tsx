import { auth0 } from "@/lib/auth0";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Subscribers() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("auth/login?returnTo=/subscribers");
  }

  const user = session.user as { email?: string };

  if (!user.email || user.email !== process.env.ADMIN_EMAIL) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold mb-6">アクセス拒否</h1>
        <p className="text-2xl text-red-600">
          このページは管理者専用ページです。
        </p>
      </main>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error)
    return <main className="p-8 text-red-500">エラー: {error.message}</main>;

  return (
    <main className="p-10">
      <div className="flex justify-end mb-6">
        <a
          href="auth/logout"
          className="text-purple-600 underline float-right mb1"
        >
          ログアウト
        </a>
      </div>
      <h1 className="text-xl"></h1>
      <ul className="space-y-2">
        {data?.map((s) => (
          <li className="border p-3 rounded" key={s.id}>
            <div className="font-mono">{s.email}</div>
            <div className="">{new Date(s.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
