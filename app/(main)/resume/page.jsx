import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className=" pt-20 w-full px-4 md:px-8 lg:px-16 py-6 max-w-5xl mx-auto">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
