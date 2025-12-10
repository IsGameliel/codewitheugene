import React, { useEffect, useRef, useState } from "react";
import { Plus, MoveVertical, FileVideo, FileText, Play, MoreHorizontal, Trash2, Copy, UploadCloud, Image, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurriculumContext, type Section, type Lecture, type Resource } from "@/contexts/CurriculumContext";

type VideoPreview = { url: string; title: string } | null;

const formatDuration = (secs: number) => {
  if (!secs) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

interface CurriculumBuilderProps {
  onDataChange?: (duration: string, lectureCount: number) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({ onDataChange }) => {
  const { sections, setSections, openSections, setOpenSections } = useCurriculumContext();
  const [dragging, setDragging] = useState<{ type: "section" | "lecture"; sectionId?: string; lectureId?: string } | null>(null);
  const bulkRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [autosave, setAutosave] = useState<{ saving: boolean; lastSaved?: string }>({ saving: false });
  const [videoPreview, setVideoPreview] = useState<VideoPreview>(null);

  // Autosave simulation
  useEffect(() => {
    const id = setInterval(() => {
      setAutosave({ saving: true });
      setTimeout(() => setAutosave({ saving: false, lastSaved: new Date().toLocaleTimeString() }), 800);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Notify parent of curriculum changes
  useEffect(() => {
    if (onDataChange) {
      let totalLectures = 0;
      let totalSecs = 0;
      sections.forEach((sec) => {
        totalLectures += sec.lectures.length;
        sec.lectures.forEach((l) => {
          const [m, s] = l.duration.split(":").map(Number);
          totalSecs += (m || 0) * 60 + (s || 0);
        });
      });
      const duration = formatDuration(totalSecs);
      onDataChange(duration, totalLectures);
    }
  }, [sections, onDataChange]);

  // Helpers
  const addSection = (open = true) => {
    const id = "sec-" + Math.random().toString(36).slice(2, 8);
    setSections((s) => [...s, { id, title: "New Section", lectures: [] }]);
    if (open) setOpenSections((o) => [...o, id]);
    toast({ title: "Section added", description: "A new section was added and expanded." });
  };

  const addLecture = (sectionId: string, files?: FileList | null) => {
    setSections((s) =>
      s.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const newLectures: Lecture[] = [];
        if (files && files.length) {
          Array.from(files).forEach((f) => {
            // Extract video duration metadata
            const videoFile = f;
            const video = document.createElement("video");
            video.onloadedmetadata = () => {
              const duration = formatDuration(video.duration);
              setSections((prev) =>
                prev.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        lectures: s.lectures.map((l) =>
                          l.title === f.name ? { ...l, duration } : l
                        ),
                      }
                    : s
                )
              );
            };
            video.src = URL.createObjectURL(f);
            newLectures.push({
              id: "lec-" + Math.random().toString(36).slice(2, 8),
              title: f.name,
              duration: "0:00",
              video: { status: "Processing", progress: 0, url: URL.createObjectURL(f) },
              resources: [],
              type: "video",
            });
          });
        } else {
          newLectures.push({ id: "lec-" + Math.random().toString(36).slice(2, 8), title: "New Lecture", duration: "0:00", video: null, resources: [], type: "video" });
        }
        return { ...sec, lectures: [...sec.lectures, ...newLectures] };
      })
    );
    // auto expand
    setTimeout(() => setOpenSections((o) => Array.from(new Set([...o, sectionId]))), 100);
    toast({ title: "Lecture(s) added", description: "You can reorder or edit the lectures." });
  };

  // Bulk upload to first section
  const onBulkUpload = (files: FileList | null) => {
    if (!files) return;
    if (!sections.length) addSection(false);
    addLecture(sections[0].id, files);
  };

  // Simulate upload progress for videos
  useEffect(() => {
    const timers: Array<{ id: string; t: number }> = [];
    sections.forEach((sec) => {
      sec.lectures.forEach((lec) => {
        if (lec.video && lec.video.status === "Processing" && lec.video.progress < 100) {
          const interval = window.setInterval(() => {
            setSections((prev) =>
              prev.map((s) => ({
                ...s,
                lectures: s.lectures.map((l) => {
                  if (l.id !== lec.id) return l;
                  const p = Math.min(100, (l.video?.progress ?? 0) + Math.round(Math.random() * 30));
                  return { ...l, video: { ...l.video!, progress: p, status: p >= 100 ? (Math.random() > 0.05 ? "Ready" : "Failed") : "Processing" } };
                }),
              }))
            );
          }, 700 + Math.random() * 800);
          timers.push({ id: lec.id, t: interval });
        }
      });
    });
    return () => timers.forEach((x) => clearInterval(x.t));
  }, [sections]);

  // Drag and drop handlers (HTML5 DnD)
  const onSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    setDragging({ type: "section", sectionId });
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "section", sectionId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onLectureDragStart = (e: React.DragEvent, sectionId: string, lectureId: string) => {
    setDragging({ type: "lecture", sectionId, lectureId });
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "lecture", sectionId, lectureId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropOnSection = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "section") {
        const srcId = parsed.sectionId as string;
        if (srcId === targetSectionId) return;
        setSections((s) => {
          const srcIdx = s.findIndex((x) => x.id === srcId);
          const tgtIdx = s.findIndex((x) => x.id === targetSectionId);
          if (srcIdx === -1 || tgtIdx === -1) return s;
          const arr = [...s];
          const [moved] = arr.splice(srcIdx, 1);
          arr.splice(tgtIdx, 0, moved);
          return arr;
        });
        toast({ title: "Section reordered" });
      }

      if (parsed.type === "lecture") {
        const { sectionId: srcSectionId, lectureId } = parsed;
        if (!lectureId) return;
        if (srcSectionId === targetSectionId) return; // handled by lecture drop ordering
        setSections((s) => {
          const copy = JSON.parse(JSON.stringify(s)) as Section[];
          let lect: Lecture | null = null;
          for (const sec of copy) {
            const idx = sec.lectures.findIndex((l) => l.id === lectureId);
            if (idx > -1) {
              lect = sec.lectures.splice(idx, 1)[0];
              break;
            }
          }
          if (!lect) return s;
          const tgt = copy.find((x) => x.id === targetSectionId);
          if (!tgt) return s;
          tgt.lectures.push(lect);
          return copy;
        });
        toast({ title: "Lecture moved" });
      }
    } catch (err) {
      // noop
    } finally {
      setDragging(null);
    }
  };

  const onLectureDropAt = (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed.type !== "lecture") return;
      const { sectionId: srcSectionId, lectureId } = parsed;
      if (!lectureId) return;
      setSections((s) => {
        const copy = JSON.parse(JSON.stringify(s)) as Section[];
        let lect: Lecture | null = null;
        for (const sec of copy) {
          const idx = sec.lectures.findIndex((l) => l.id === lectureId);
          if (idx > -1) {
            lect = sec.lectures.splice(idx, 1)[0];
            break;
          }
        }
        if (!lect) return s;
        const tgtSec = copy.find((x) => x.id === targetSectionId);
        if (!tgtSec) return s;
        const insertIdx = targetLectureId ? Math.max(0, tgtSec.lectures.findIndex((l) => l.id === targetLectureId)) : tgtSec.lectures.length;
        if (insertIdx === -1) tgtSec.lectures.push(lect);
        else tgtSec.lectures.splice(insertIdx, 0, lect);
        return copy;
      });
      toast({ title: "Lecture reordered" });
    } catch (err) {
      // noop
    } finally {
      setDragging(null);
    }
  };

  const onDeleteLecture = (sectionId: string, lectureId: string) => {
    const ok = window.confirm("Delete this lecture? This action cannot be undone.");
    if (!ok) return;
    setSections((s) => s.map((sec) => (sec.id === sectionId ? { ...sec, lectures: sec.lectures.filter((l) => l.id !== lectureId) } : sec)));
    toast({ title: "Lecture deleted" });
  };

  const duplicateLecture = (sectionId: string, lectureId: string) => {
    setSections((s) =>
      s.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const idx = sec.lectures.findIndex((l) => l.id === lectureId);
        if (idx === -1) return sec;
        const original = sec.lectures[idx];
        const copy = { ...original, id: "lec-" + Math.random().toString(36).slice(2, 8), title: original.title + " (Copy)" };
        const lectures = [...sec.lectures];
        lectures.splice(idx + 1, 0, copy);
        return { ...sec, lectures };
      })
    );
    toast({ title: "Lecture duplicated" });
  };

  const uploadResource = (sectionId: string, lectureId: string, file: File) => {
    setSections((s) =>
      s.map((sec) =>
        sec.id === sectionId
          ? { ...sec, lectures: sec.lectures.map((l) => (l.id === lectureId ? { ...l, resources: [...l.resources, { id: Math.random().toString(36).slice(2, 8), name: file.name, url: URL.createObjectURL(file) }] } : l)) }
          : sec
      )
    );
    toast({ title: "Resource uploaded" });
  };

  const totalDuration = (sec: Section) => {
    // sum durations in mm:ss
    let totalSec = 0;
    sec.lectures.forEach((l) => {
      const [m, s] = l.duration.split(":").map(Number);
      totalSec += (m || 0) * 60 + (s || 0);
    });
    return formatDuration(totalSec);
  };

  const getTotalCourseDuration = () => {
    let totalSec = 0;
    sections.forEach((sec) => {
      sec.lectures.forEach((l) => {
        const [m, s] = l.duration.split(":").map(Number);
        totalSec += (m || 0) * 60 + (s || 0);
      });
    });
    return formatDuration(totalSec);
  };

  return (
    <div className="bg-transparent">
      {/* Video Preview Modal */}
      {videoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-2xl rounded-lg bg-black p-4">
            <button onClick={() => setVideoPreview(null)} className="absolute top-4 right-4 text-white z-10">
              <X className="w-6 h-6" />
            </button>
            <video src={videoPreview.url} controls className="w-full rounded-lg" autoPlay />
            <p className="mt-3 text-white text-sm">{videoPreview.title}</p>
          </div>
        </div>
      )}

      <div className="sticky top-4 z-10 w-full bg-background/60 backdrop-blur-sm py-3 px-3 rounded-md mb-4 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2" onClick={() => addSection(true)}><Plus className="w-4 h-4" /> Add Section</Button>
          <input ref={bulkRef} type="file" multiple accept="video/*" className="hidden" onChange={(e) => onBulkUpload(e.target.files)} />
          <Button variant="outline" onClick={() => bulkRef.current?.click()}>Bulk Upload Lectures</Button>
          <div className="text-sm text-muted-foreground ml-4">{autosave.saving ? <span className="text-primary">Saving...</span> : <span>Saved {autosave.lastSaved ?? 'just now'}</span>}</div>
          <div className="ml-4 text-sm font-medium text-foreground">Total Duration: {getTotalCourseDuration()}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Preview</Button>
          <Button className="bg-primary text-primary-foreground">Save</Button>
          <Button className="bg-primary text-primary-foreground">Publish</Button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={openSections} onValueChange={(v) => setOpenSections(typeof v === "string" ? [v] : v)} className="space-y-3">
        {sections.map((sec, sIdx) => (
          <AccordionItem key={sec.id} value={sec.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <div
              draggable
              onDragStart={(e) => onSectionDragStart(e, sec.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropOnSection(e, sec.id)}
              className="flex items-center justify-between p-4 cursor-grab bg-white/0"
            >
              <div className="flex items-center gap-4">
                <div className="text-primary"><MoveVertical className="w-5 h-5" /></div>
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{sec.title}</div>
                      <div className="text-sm text-muted-foreground">{sec.lectures.length} lectures • {totalDuration(sec)}</div>
                    </div>
                    <div className="text-sm text-primary">Add Lecture</div>
                  </div>
                </AccordionTrigger>
              </div>
              <div className="flex items-center gap-2">
                <button title="Add Lecture" className="text-sm text-muted-foreground" onClick={() => addLecture(sec.id)}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AccordionContent className="bg-secondary/50">
              <div className="p-4 space-y-3">
                {sec.lectures.map((lec, idx) => (
                  <div
                    key={lec.id}
                    draggable
                    onDragStart={(e) => onLectureDragStart(e, sec.id, lec.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onLectureDropAt(e, sec.id, lec.id)}
                    className="p-3 rounded-md bg-white border border-border flex flex-col md:flex-row items-start gap-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded"><MoveVertical className="w-4 h-4 text-primary" /></div>
                      <div className="text-xs text-muted-foreground">{lec.type}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <input
                            className="w-full text-lg font-semibold bg-transparent text-primary-foreground placeholder:text-muted-foreground focus:outline-none"
                            value={lec.title}
                            onChange={(e) =>
                              setSections((s) =>
                                s.map((secX) =>
                                  secX.id === sec.id
                                    ? {
                                        ...secX,
                                        lectures: secX.lectures.map((l) => (l.id === lec.id ? { ...l, title: e.target.value } : l)),
                                      }
                                    : secX
                                )
                              )
                            }
                          />
                          <div className="text-sm text-muted-foreground mt-1">{lec.type} • {lec.duration}</div>
                        </div>

                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          <button title="Duplicate" className="text-muted-foreground hover:text-primary p-1 rounded" onClick={() => duplicateLecture(sec.id, lec.id)}>
                            <Copy className="w-4 h-4" />
                          </button>
                          <button title="Delete" className="text-destructive hover:bg-destructive/10 p-1 rounded" onClick={() => onDeleteLecture(sec.id, lec.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button title="More" className="text-muted-foreground hover:text-primary p-1 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex-row items-center gap-3 w-full">
                        <div className="w-full md:w-28 h-20 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                          {lec.video?.url ? (
                            <video src={lec.video.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-xs text-muted-foreground">No video</div>
                          )}
                        </div>

                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                if (lec.video?.url) {
                                  setVideoPreview({ url: lec.video.url, title: lec.title });
                                } else {
                                  toast({ description: "No video uploaded yet" });
                                }
                              }}
                              title="Preview video"
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary text-primary-foreground cursor-pointer text-sm font-medium"
                            >
                              <Play className="w-4 h-4" /> Preview
                            </button>
                            <label className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary text-primary-foreground cursor-pointer text-sm font-medium">
                              <UploadCloud className="w-4 h-4" /> Upload Video
                              <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addLecture(sec.id, e.target.files); }} />
                            </label>
                            <label className="inline-flex items-center text-primary-foreground gap-2 px-3 py-1 rounded-lg border border-border cursor-pointer text-sm font-medium text-foreground">
                              <FileText className="w-4 h-4" /> Add Resource
                              <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadResource(sec.id, lec.id, f); }} />
                            </label>

                            </div>
                          </div>

                          <div className="mt-3 w-full">
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                              <div className="h-2 bg-primary" style={{ width: `${lec.video?.progress ?? 0}%` }} />
                            </div>
                            <div className="mt-2 text-xs">
                              <span className={`px-2 py-1 rounded text-xs ${lec.video?.status === "Ready" ? "bg-green-100 text-green-600" : lec.video?.status === "Failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>{lec.video?.status ?? "No video"}</span>
                              <span className="ml-2 text-muted-foreground">{lec.resources.length} resources</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button variant="outline" onClick={() => addLecture(sec.id)}><Plus className="w-4 h-4" /> Add Lecture</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CurriculumBuilder;
