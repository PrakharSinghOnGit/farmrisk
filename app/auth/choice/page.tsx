import Link from "next/link";

interface ChoicePageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function ChoicePage({ searchParams }: ChoicePageProps) {
  const params = await searchParams;
  const nextParam = params.next || "";
  const loginHref = nextParam 
    ? `/auth/login?next=${encodeURIComponent(nextParam)}` 
    : "/auth/login";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center space-y-6">
        <h1 className="text-2xl font-bold">Choose your experience</h1>
        <p className="text-sm text-slate-600">
          Would you like to continue using the free dashboard with basic weather data, or access a personalized agri-intelligence dashboard?
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-3 px-4 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition text-center block"
          >
            Continue with Free Version
          </Link>
          <Link
            href={loginHref}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition text-center block"
          >
            Get Personalized Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
