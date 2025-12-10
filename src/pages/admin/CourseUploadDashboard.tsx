import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import CurriculumBuilder from "@/components/admin/CurriculumBuilder";
import PricingPublish from "@/components/admin/PricingPublish";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCourseContext } from "@/contexts/CourseContext";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  "Basics",
  "Curriculum",
  "Pricing",
  "Publish",
];

interface CourseFormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  objectives: string[];
  requirements: string[];
  price: number;
  thumbnail?: string;
}

const CourseUploadDashboard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [autosave, setAutosave] = useState<{ saving: boolean; lastSaved?: string }>({ saving: false });
  const { toast } = useToast();
  const { addPublishedCourse } = useCourseContext();
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [lectureCount, setLectureCount] = useState(0);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",
    description: "",
    category: "Development",
    language: "English",
    level: "Beginner",
    objectives: [],
    requirements: [],
    price: 0,
    thumbnail: undefined,
  });

  // Simple autosave simulator
  useEffect(() => {
    const id = setInterval(() => {
      setAutosave({ saving: true });
      setTimeout(() => setAutosave({ saving: false, lastSaved: new Date().toLocaleTimeString() }), 700);
    }, 25000);
    return () => clearInterval(id);
  }, []);

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Please enter a course title" });
      return;
    }
    // Attempt to save to Supabase
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        long_description: formData.description || null,
        category: formData.category || null,
        level: formData.level || null,
        price: formData.price || 0,
        duration: totalDuration || null,
        lessons_count: lectureCount || 0,
        thumbnail_url: formData.thumbnail || null,
        is_published: true,
      };

      const { data, error } = await supabase.from("courses").insert(payload).select().single();

      if (error || !data) {
        console.error("Supabase insert error:", error);
        toast({ title: "Publish failed", description: "Could not save to database. Saved locally instead." });
        // fallback to local-only publish
        const fallback = {
          id: Math.random().toString(36).slice(2, 9),
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          category: formData.category,
          language: formData.language,
          level: formData.level,
          price: formData.price,
          thumbnail: formData.thumbnail,
          duration: totalDuration,
          lessons: lectureCount,
          learningObjectives: formData.objectives,
          requirements: formData.requirements,
          totalDuration: totalDuration,
          publishedAt: new Date().toLocaleString(),
          status: "published" as const,
        };

        addPublishedCourse(fallback);
      } else {
        // Map DB row to PublishedCourse shape
        const dbRow: any = data;
        const published = {
          id: dbRow.id,
          title: dbRow.title,
          subtitle: formData.subtitle,
          description: dbRow.description ?? formData.description,
          category: dbRow.category ?? formData.category,
          language: formData.language,
          level: (dbRow.level as any) ?? formData.level,
          price: dbRow.price ?? formData.price,
          thumbnail: dbRow.thumbnail_url ?? undefined,
          duration: dbRow.duration ?? totalDuration,
          lessons: dbRow.lessons_count ?? lectureCount,
          learningObjectives: formData.objectives,
          requirements: formData.requirements,
          totalDuration: dbRow.duration ?? totalDuration,
          publishedAt: dbRow.created_at ?? new Date().toLocaleString(),
          status: dbRow.is_published ? "published" : "draft",
        } as any;

        addPublishedCourse(published);
        toast({ title: "Course Published!", description: "Saved to database and published." });
      }

      // Reset form
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        category: "Development",
        language: "English",
        level: "Beginner",
        objectives: [],
        requirements: [],
        price: 0,
      });
      setActiveStep(0);
    } catch (err) {
      console.error(err);
      toast({ title: "Publish error", description: "Unexpected error while publishing. Check console." });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Create a New Course</h1>
            <p className="text-muted-foreground mt-1">A guided workflow for uploading and publishing your course.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Autosave</div>
            <div className="min-w-[120px] flex items-center gap-2">
              {autosave.saving ? (
                <div className="text-xs text-primary">Saving...</div>
              ) : (
                <div className="text-xs text-muted-foreground">Saved {autosave.lastSaved ?? "just now"}</div>
              )}
              <Button variant="outline" size="sm" onClick={() => alert("Manual save (simulated)")}>Save</Button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setActiveStep(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                i === activeStep ? "bg-primary text-primary-foreground shadow" : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basics Step */}
            {activeStep === 0 && (
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Course Basics</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Course Title</label>
                    <input
                      className="w-full rounded-lg border border-border p-3 bg-transparent"
                      placeholder="e.g. Mastering React: From Zero to Production"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <input
                      className="w-full rounded-lg border border-border p-3 bg-transparent"
                      placeholder="A short, compelling subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full rounded-lg border border-border p-3 min-h-[120px] bg-transparent"
                      placeholder="Write a clear course description for prospective students"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      className="w-full rounded-lg border border-border p-3 bg-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Development</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Full Stack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select
                      className="w-full rounded-lg border border-border p-3 bg-transparent"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Skill Level</label>
                    <select
                      className="w-full rounded-lg border border-border p-3 bg-transparent"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as "Beginner" | "Intermediate" | "Advanced" })}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium">Course Thumbnail</h3>
                  <p className="text-muted-foreground text-sm mt-1">Upload a cover image (recommended: 1280x720px)</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="w-40 h-24 bg-secondary rounded-lg flex items-center justify-center overflow-hidden border border-border">
                      {formData.thumbnail ? (
                        <img src={formData.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-muted-foreground">No image</span>
                      )}
                    </div>
                    <label className="px-4 py-2 rounded-lg bg-primary text-primary-foreground cursor-pointer text-sm font-medium inline-block">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setFormData({ ...formData, thumbnail: base64 });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium">Learning Objectives</h3>
                  <p className="text-muted-foreground text-sm mt-1">Add short, measurable objectives students will achieve.</p>
                  <textarea className="w-full rounded-lg border border-border p-3 min-h-[80px] mt-3 bg-transparent" placeholder={"• "} />
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium">Requirements</h3>
                  <p className="text-muted-foreground text-sm mt-1">What students should know or have before starting.</p>
                  <textarea className="w-full rounded-lg border border-border p-3 min-h-[80px] mt-3 bg-transparent" placeholder={"• "} />
                </div>
              </div>
            )}

            {/* Curriculum Step */}
            {activeStep === 1 && (
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Curriculum Builder</h2>
                <p className="text-sm text-muted-foreground mt-1">Organize your sections and lectures. You can upload multiple lectures at once.</p>
                <div className="mt-6">
                  <div className="relative">
                    <CurriculumBuilder onDataChange={(duration, lectures) => {
                      setTotalDuration(duration);
                      setLectureCount(lectures);
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Step */}
            {activeStep === 2 && (
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Pricing & Promotions</h2>
                <div className="mt-4">
                  <PricingPublish price={formData.price} onPriceChange={(price) => setFormData({ ...formData, price })} />
                </div>
              </div>
            )}

            {/* Publish Step */}
            {activeStep === 3 && (
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Publish</h2>
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-secondary">
                    <h3 className="font-medium">Quality Review Checklist</h3>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>• Course meets audio & video quality standards</li>
                      <li>• Sufficient lecture length and structure</li>
                      <li>• Promotional assets uploaded</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button size="lg" className="bg-primary text-primary-foreground" onClick={handlePublish}>Publish Course</Button>
                    <Button variant="ghost">Unpublish</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar preview */}
          <aside className="space-y-4 relative z-20">
            <div className="rounded-2xl p-4 border border-border bg-card w-full">
              <h3 className="text-sm font-medium">Course Landing Preview</h3>
              <div className="mt-3">
                <div className="w-full h-40 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-sm p-4 overflow-hidden border border-border">
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Course thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{formData.title ? formData.title : "Course Preview"}</span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-base line-clamp-2">{formData.title || "Untitled Course"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formData.subtitle || "Add a subtitle"}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-secondary rounded text-foreground">{formData.level}</span>
                    <span className="px-2 py-1 bg-secondary rounded text-foreground">{formData.category}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Instructor • {lectureCount} lectures</p>
                    <p className="font-semibold text-primary">${formData.price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 border border-border bg-card w-full">
              <h3 className="text-sm font-medium">Publish Status</h3>
              <div className="mt-3 flex flex-col gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Title: </span>
                  <span className={formData.title ? "text-green-600 font-medium" : "text-yellow-600"}>{formData.title ? "✓ Complete" : "Pending"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Curriculum: </span>
                  <span className={lectureCount > 0 ? "text-green-600 font-medium" : "text-yellow-600"}>{lectureCount > 0 ? `✓ ${lectureCount} lectures` : "Pending"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Price: </span>
                  <span className={formData.price > 0 ? "text-green-600 font-medium" : "text-yellow-600"}>{formData.price > 0 ? `✓ $${formData.price}` : "Pending"}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Duration: <span className="text-foreground font-medium">{totalDuration}</span></p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Need help? Check the instructor guide or contact support.</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setActiveStep((s) => Math.max(0, s - 1))}>Back</Button>
            <Button onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}>Next</Button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default CourseUploadDashboard;
