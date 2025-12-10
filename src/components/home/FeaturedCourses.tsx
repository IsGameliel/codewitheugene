import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { courses } from "@/data/courses";

export function FeaturedCourses() {
  const featuredCourses = courses.filter((course) => course.featured).slice(0, 3);

  return (
    <section className="section-padding bg-card/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Popular <span className="text-gradient">Courses</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Learn from comprehensive video courses designed to take you from beginner to professional developer.
            </p>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => (
            <div
              key={course.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
