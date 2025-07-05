// ✅ page.jsx (Server Component)
import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/Data/industries";
import { redirect } from "next/navigation";
import OnboardingForm from "./_component/onboarding-form";

const Page = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default Page;
