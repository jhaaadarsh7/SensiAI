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

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [html2pdf, setHtml2pdf] = useState(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
      setPreviewContent(newContent || initialContent || "");
    }
  }, [formValues, activeTab, initialContent]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  // Load html2pdf library dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadHtml2pdf = async () => {
      try {
        // Load html2pdf and html2canvas
        const [html2pdfModule, html2canvasModule] = await Promise.all([
          import("html2pdf.js"),
          import("html2canvas"),
        ]);

        // Set html2canvas for html2pdf
        if (html2pdfModule && html2canvasModule) {
          html2pdfModule.default.html2canvas = html2canvasModule.default;
          setHtml2pdf(() => html2pdfModule.default || html2pdfModule);
          setIsLibraryLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load PDF library:", error);
        setIsLibraryLoaded(false);
        toast.error("Failed to load PDF library");
      }
    };

    loadHtml2pdf();
  }, []);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName || "Your Name"}</div>
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

  // Helper function to convert modern CSS colors to compatible formats
  const sanitizeStylesForPDF = (element) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    const nodes = [element];
    let node;
    
    while (node = walker.nextNode()) {
      nodes.push(node);
    }

    // Convert problematic CSS properties to compatible ones
    nodes.forEach(node => {
      if (node.style) {
        const computedStyle = window.getComputedStyle(node);
        
        // Convert CSS custom properties and modern color functions
        const propertiesToCheck = [
          'color', 'backgroundColor', 'borderColor', 'boxShadow',
          'textDecorationColor', 'outlineColor', 'caretColor'
        ];
        
        propertiesToCheck.forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && (value.includes('oklch') || value.includes('var(--'))) {
            // Convert to RGB if possible
            try {
              const rgb = window.getComputedStyle(node).getPropertyValue(prop);
              if (rgb && !rgb.includes('oklch') && !rgb.includes('var(--')) {
                node.style.setProperty(prop, rgb, 'important');
              }
            } catch (e) {
              // Fallback to safe colors
              if (prop === 'color') node.style.setProperty(prop, '#000000', 'important');
              if (prop === 'backgroundColor') node.style.setProperty(prop, '#ffffff', 'important');
              if (prop === 'borderColor') node.style.setProperty(prop, '#cccccc', 'important');
            }
          }
        });
      }
    });
  };

  const generatePDF = async () => {
    if (!html2pdf) {
      toast.error("PDF generator not loaded yet, please wait...");
      return;
    }

    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      if (!element) {
        throw new Error("Resume content not found for PDF generation");
      }

      // Create a clone to avoid modifying the original
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = 'static';
      clonedElement.style.left = 'auto';
      clonedElement.style.top = 'auto';
      clonedElement.style.zIndex = 'auto';
      
      // Temporarily add to document for processing
      document.body.appendChild(clonedElement);

      // Sanitize styles for PDF generation
      sanitizeStylesForPDF(clonedElement);

      const options = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            // Additional cleanup in the cloned document
            const clonedBody = clonedDoc.body;
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                color: #000000 !important;
                background-color: #ffffff !important;
                border-color: #cccccc !important;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #333333 !important;
              }
              a {
                color: #0066cc !important;
              }
              .gradient, .gradient-title {
                background: #333333 !important;
                color: #ffffff !important;
                -webkit-background-clip: unset !important;
                background-clip: unset !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(options).from(clonedElement).save();
      
      // Clean up the cloned element
      document.body.removeChild(clonedElement);
      
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating || !isLibraryLoaded}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : !isLibraryLoaded ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading PDF Library...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter/X Profile</label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
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
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
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
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
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
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>

          {/* Hidden container for PDF generation with compatible styling */}
          <div
            id="resume-pdf"
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "800px",
              padding: "20px",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              fontSize: "14px",
              lineHeight: "1.6",
              zIndex: -1,
            }}
          >
            <style>
              {`
                #resume-pdf * {
                  background-color: #ffffff !important;
                  border-color: #cccccc !important;
                  color: #000000 !important;
                }
                
                #resume-pdf h1, #resume-pdf h2, #resume-pdf h3, #resume-pdf h4, #resume-pdf h5, #resume-pdf h6 {
                  color: #333333 !important;
                }
                
                #resume-pdf a {
                  color: #0066cc !important;
                }
                
                #resume-pdf code {
                  background-color: #f5f5f5 !important;
                  color: #333333 !important;
                }
                
                #resume-pdf pre {
                  background-color: #f8f8f8 !important;
                  border: 1px solid #cccccc !important;
                }
                
                #resume-pdf blockquote {
                  background-color: #f9f9f9 !important;
                  border-left: 4px solid #cccccc !important;
                }
                
                #resume-pdf .gradient,
                #resume-pdf .gradient-title {
                  background: #333333 !important;
                  color: #ffffff !important;
                  -webkit-background-clip: unset !important;
                  background-clip: unset !important;
                }
              `}
            </style>
            <MDEditor.Markdown
              source={previewContent}
              style={{ background: "#ffffff", color: "#000000" }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}