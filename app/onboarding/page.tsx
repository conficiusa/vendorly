import OnboardingPage from "@/components/onboarding";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }
  return <OnboardingPage />;
};

export default page;
