import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/data/blogs";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Map DB posts to BlogPost interface and normalize image URL
      const transformed: BlogPost[] = await Promise.all(
        (data || []).map(async (dbPost: any) => {
          let imageUrl: string | undefined = dbPost.cover_image || undefined;

          // If cover_image exists but is not a URL (e.g. stored path), try to get public URL
          if (imageUrl && !/^https?:\/\//i.test(imageUrl) && !imageUrl.startsWith("data:")) {
            try {
              const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(imageUrl);
              if (urlData?.publicUrl) imageUrl = urlData.publicUrl;
            } catch (e) {
              // ignore and fallback to placeholder below
            }
          }

          // final fallback
          if (!imageUrl) imageUrl = PLACEHOLDER_IMAGE;

          // Use first category as the display category and also build categories array
          const rawCategory = dbPost.category || "General";
          const categoriesArr = String(rawCategory)
            .toString()
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean);
          const primaryCategory = categoriesArr[0] || "General";

          return {
            id: dbPost.id,
            title: dbPost.title,
            excerpt: dbPost.excerpt || (dbPost.content ? String(dbPost.content).slice(0, 150) : ""),
            content: dbPost.content || "",
            image: imageUrl,
            author: dbPost.author || "Admin",
            authorImage: dbPost.author_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
            date: dbPost.published_at || dbPost.created_at,
            readTime: dbPost.read_time || "5 min read",
            category: primaryCategory,
            categories: categoriesArr,
            tags: dbPost.tags || [],
            featured: false,
          } as BlogPost;
        })
      );

      // mark first as featured (optional)
      if (transformed.length > 0) transformed[0].featured = true;

      setPosts(transformed);

      // Build unique categories from the `categories` array on each post (if present)
      const categorySet = new Set<string>();
      transformed.forEach((p) => {
        const cats = (p as any).categories;
        if (Array.isArray(cats) && cats.length > 0) {
          cats.forEach((c: string) => c && categorySet.add(c));
        } else if ((p as any).category) {
          categorySet.add((p as any).category);
        }
      });

      setCategories(["All", ...Array.from(categorySet).sort((a, b) => a.localeCompare(b))]);
    } catch (err) {
      // keep previous static fallback behavior if fetch fails
      // eslint-disable-next-line no-console
      console.error("Failed to load posts:", err);
      setPosts([]);
      setCategories(["All"]);
    } finally {
      setLoading(false);
    }
  };

  const featuredPost = posts.find((p) => p.featured);
  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "All") return !post.featured;
    // match if the activeCategory is the primary category or included in categories array
    const inCategories = Array.isArray((post as any).categories) && (post as any).categories.includes(activeCategory);
    const matchesCategory = post.category === activeCategory || inCategories;
    return matchesCategory && !post.featured;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Developer <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights, tutorials, and thoughts on web development, programming, and building great software.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8">
          <div className="container-custom">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">Featured Article</h2>
            <BlogCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Filter */}
      <section className="py-8 border-b border-border">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length > 0 && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;