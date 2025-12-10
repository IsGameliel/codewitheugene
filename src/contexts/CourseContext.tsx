import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PublishedCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnail?: string;
  duration: string;
  lessons: number;
  learningObjectives: string[];
  requirements: string[];
  totalDuration: string;
  publishedAt: string;
  status: "draft" | "published";
}

interface CourseContextType {
  publishedCourses: PublishedCourse[];
  addPublishedCourse: (course: PublishedCourse) => void;
  updatePublishedCourse: (id: string, course: Partial<PublishedCourse>) => void;
  deletePublishedCourse: (id: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storageKey = "publishedCourses";
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as PublishedCourse[]) : [];
    } catch (e) {
      return [];
    }
  });

  const addPublishedCourse = (course: PublishedCourse) => {
    setPublishedCourses((prev) => [...prev, course]);
  };

  const updatePublishedCourse = (id: string, updates: Partial<PublishedCourse>) => {
    setPublishedCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
    );
  };

  const deletePublishedCourse = (id: string) => {
    setPublishedCourses((prev) => prev.filter((course) => course.id !== id));
  };

  // Persist to localStorage so published courses survive reloads/navigation
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(publishedCourses));
    } catch (e) {
      // ignore localStorage errors
    }
  }, [publishedCourses]);

  return (
    <CourseContext.Provider value={{ publishedCourses, addPublishedCourse, updatePublishedCourse, deletePublishedCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within CourseProvider");
  }
  return context;
};
