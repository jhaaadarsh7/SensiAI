import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/Data/industries";
import { redirect } from "next/navigation"; // ✅ Fixed import
import OnboardingForm from "./_component/onboarding-form";

const Page = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} /> {/* ✅ Correct JSX */}
    </main>
  );
};

export default Page;
