import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative rounded-2xl overflow-hidden glass hover:shadow-hover transition-all duration-500 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
            <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.bestseller && (
            <Badge className="bg-accent text-accent-foreground">Bestseller</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">{discount}% OFF</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-primary border-primary/50">
            {course.category}
          </Badge>
          <Badge variant="secondary">{course.level}</Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.lessons} lessons
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="font-semibold">{course.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({course.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-foreground">
              ${course.price}
            </span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${course.originalPrice}
              </span>
            )}
          </div>
          <Button variant="gradient" size="sm" asChild>
            <Link to={`/courses/${course.id}`}>Enroll Now</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
