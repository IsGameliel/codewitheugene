import React, { useRef, useState } from "react";
import { Play, UploadCloud, Trash2, Image } from "lucide-react";

type Lecture = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "Processing" | "Ready" | "Failed";
  url?: string;
  thumbnail?: string;
};

const VideoUploader: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Lecture[]>([]);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: Lecture[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2, 9),
      name: f.name,
      size: f.size,
      progress: 0,
      status: "Processing",
      url: URL.createObjectURL(f),
    }));
    setItems((s) => [...newItems, ...s]);

    // simulate upload
    newItems.forEach((it) => simulateProgress(it.id));
  };

  const simulateProgress = (id: string) => {
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 25;
      setItems((list) =>
        list.map((l) => (l.id === id ? { ...l, progress: Math.min(100, Math.round(progress)) } : l))
      );
      if (progress >= 100) {
        clearInterval(tick);
        // random success/fail
        const ok = Math.random() > 0.07;
        setItems((list) => list.map((l) => (l.id === id ? { ...l, progress: 100, status: ok ? "Ready" : "Failed" } : l)));
      }
    }, 700 + Math.random() * 900);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => setItems((s) => s.filter((i) => i.id !== id));

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="rounded-lg border border-border p-6 flex flex-col items-center justify-center text-center bg-secondary"
      >
        <UploadCloud className="w-8 h-8 text-primary" />
        <div className="mt-3 text-sm font-medium">Drag & drop videos here</div>
        <div className="text-sm text-muted-foreground mt-1">Or</div>
        <div className="mt-3">
          <input
            type="file"
            multiple
            accept="video/*"
            ref={fileRef}
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <button
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            onClick={() => fileRef.current?.click()}
          >
            Upload Videos
          </button>
        </div>
        <div className="text-xs text-muted-foreground mt-3">Supported: mp4, mov, webm — max: your plan limit</div>
      </div>

      {/* Uploaded list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
            <div className="w-28 h-16 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
              {item.url ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <Image className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{(item.size / 1024 ** 2).toFixed(1)} MB</div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className={`h-2 bg-primary`} style={{ width: `${item.progress}%` }} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className={`px-2 py-1 rounded text-xs ${item.status === "Ready" ? "bg-green-100 text-green-600" : item.status === "Failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {item.status}
                  </div>
                  <button className="text-muted-foreground hover:text-foreground" title="Preview">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="text-destructive hover:text-destructive/80" onClick={() => remove(item.id)} title="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoUploader;
