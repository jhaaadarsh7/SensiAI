"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  FileText,
  Sparkles,
  Eye,
  Settings,
  Briefcase,
  GraduationCap,
  Code,
  Target,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName || 'Your Name'}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: `${user?.fullName || 'resume'}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div data-color-mode="dark" className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Resume Builder
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create a professional resume with AI-powered improvements and modern design
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Resume
                </>
              )}
            </Button>
            <Button 
              onClick={generatePDF} 
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50 p-1 rounded-lg">
              <TabsTrigger 
                value="edit" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Form</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-8 mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                
                {/* Contact Information */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-300 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-400" />
                        Email Address
                      </label>
                      <Input
                        {...register("contactInfo.email")}
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                      />
                      {errors.contactInfo?.email && (
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {errors.contactInfo.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-400" />
                        Mobile Number
                      </label>
                      <Input
                        {...register("contactInfo.mobile")}
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                      />
                      {errors.contactInfo?.mobile && (
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {errors.contactInfo.mobile.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-300 flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-500" />
                        LinkedIn Profile
                      </label>
                      <Input
                        {...register("contactInfo.linkedin")}
                        type="url"
                        placeholder="https://linkedin.com/in/your-profile"
                        className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                      />
                      {errors.contactInfo?.linkedin && (
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {errors.contactInfo.linkedin.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-300 flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-cyan-400" />
                        Twitter/X Profile
                      </label>
                      <Input
                        {...register("contactInfo.twitter")}
                        type="url"
                        placeholder="https://twitter.com/your-handle"
                        className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12"
                      />
                      {errors.contactInfo?.twitter && (
                        <p className="text-sm text-red-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {errors.contactInfo.twitter.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                      <Target className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Professional Summary</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Write a compelling summary that highlights your key achievements and career goals
                    </p>
                    <Controller
                      name="summary"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          className="h-40 bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                          placeholder="Write a compelling professional summary that showcases your expertise, achievements, and career objectives..."
                        />
                      )}
                    />
                    {errors.summary && (
                      <p className="text-sm text-red-400 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {errors.summary.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                      <Zap className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Skills & Technologies</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      List your technical skills, tools, and technologies
                    </p>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          className="h-40 bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                          placeholder="List your key skills, technologies, programming languages, frameworks, and tools..."
                        />
                      )}
                    />
                    {errors.skills && (
                      <p className="text-sm text-red-400 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {errors.skills.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                      <Briefcase className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Work Experience</h3>
                  </div>
                  
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Experience"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-400 flex items-center mt-4">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                      <GraduationCap className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Education</h3>
                  </div>
                  
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Education"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.education && (
                    <p className="text-sm text-red-400 flex items-center mt-4">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.education.message}
                    </p>
                  )}
                </div>

                {/* Projects */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                      <Code className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Projects</h3>
                  </div>
                  
                  <Controller
                    name="projects"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Project"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.projects && (
                    <p className="text-sm text-red-400 flex items-center mt-4">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {errors.projects.message}
                    </p>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-8">
              {/* Preview Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                    }
                    className="bg-gray-900/50 border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    {resumeMode === "preview" ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Markdown
                      </>
                    ) : (
                      <>
                        <Monitor className="h-4 w-4 mr-2" />
                        Preview Mode
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-gray-400">
                  {resumeMode === "preview" ? "Preview Mode" : "Edit Mode"}
                </div>
              </div>

              {/* Warning Message */}
              {resumeMode !== "preview" && (
                <div className="flex items-center p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-300">
                      Editing Warning
                    </p>
                    <p className="text-sm text-yellow-400/80">
                      Manual markdown edits will be overwritten when you update form data.
                    </p>
                  </div>
                </div>
              )}

              {/* Markdown Editor */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-xl">
                <MDEditor
                  value={previewContent}
                  onChange={setPreviewContent}
                  height={800}
                  preview={resumeMode}
                  data-color-mode="dark"
                  className="!bg-gray-900/50"
                />
              </div>

              {/* Hidden PDF Generation Element */}
              <div className="hidden">
                <div id="resume-pdf" className="bg-white p-8 max-w-4xl mx-auto">
                  <MDEditor.Markdown
                    source={previewContent}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      lineHeight: "1.6",
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}