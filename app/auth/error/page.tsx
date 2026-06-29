import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell>
      <div className="rounded-2xl border bg-white p-8 text-center shadow-xl shadow-emerald-950/5">
        <h1 className="text-2xl font-semibold text-slate-950">
          We couldn&apos;t sign you in
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {params.error || "An unexpected authentication error occurred."}
        </p>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Try again</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
