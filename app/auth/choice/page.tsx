// app/choice/page.tsx
import ChoiceClient from "./Choice";

interface ChoicePageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function ChoicePage({ searchParams }: ChoicePageProps) {
  const params = await searchParams;
  const nextParam = params.next || "";

  const loginHref = nextParam
    ? `/dashboard?next=${encodeURIComponent(nextParam)}` // Adjust destination as needed
    : "/dashboard";

  return <ChoiceClient loginHref={loginHref} />;
}
