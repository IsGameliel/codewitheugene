import React, { createContext, useContext, useState, ReactNode } from "react";

export type Resource = { id: string; name: string; url?: string };
export type Lecture = {
  id: string;
  title: string;
  duration: string;
  video?: { status: "Processing" | "Ready" | "Failed"; progress: number; url?: string; thumbnail?: string } | null;
  resources: Resource[];
  type: "video" | "article" | "quiz";
};

export type Section = { id: string; title: string; lectures: Lecture[] };

interface CurriculumContextType {
  sections: Section[];
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void;
  openSections: string[];
  setOpenSections: (sections: string[] | ((prev: string[]) => string[])) => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export const CurriculumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<Section[]>(() => [
    {
      id: "sec-" + Math.random().toString(36).slice(2, 8),
      title: "Introduction",
      lectures: [
        {
          id: "lec-" + Math.random().toString(36).slice(2, 8),
          title: "Welcome",
          duration: "2:15",
          video: null,
          resources: [],
          type: "video",
        },
      ],
    },
  ]);

  const [openSections, setOpenSectionsState] = useState<string[]>([]);

  const setOpenSections = (value: string[] | ((prev: string[]) => string[])) => {
    if (typeof value === "function") {
      setOpenSectionsState(value);
    } else {
      setOpenSectionsState(value);
    }
  };

  return (
    <CurriculumContext.Provider value={{ sections, setSections, openSections, setOpenSections }}>
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculumContext = () => {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error("useCurriculumContext must be used within CurriculumProvider");
  }
  return context;
};
