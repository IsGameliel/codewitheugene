import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/data/blogs";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <article className="group relative rounded-2xl overflow-hidden glass hover:shadow-hover transition-all duration-500">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-video md:aspect-auto overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray((post as any).categories) && (post as any).categories.length > 0 ? (
                (post as any).categories.map((c: string) => (
                  <Badge key={c} variant="outline" className="self-start text-primary border-primary/50">
                    {c}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="self-start text-primary border-primary/50">
                  {post.category}
                </Badge>
              )}
            </div>

            <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <p className="text-muted-foreground mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <Link
              to={`/blog/${post.id}`}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Read Article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative rounded-2xl overflow-hidden glass hover:shadow-hover transition-all duration-500">
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray((post as any).categories) && (post as any).categories.length > 0 ? (
            (post as any).categories.map((c: string) => (
              <Badge key={c} variant="outline" className="text-primary border-primary/50">
                {c}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-primary border-primary/50 mb-3">
              {post.category}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
        </div>

        <Link
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
        >
          Read More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
