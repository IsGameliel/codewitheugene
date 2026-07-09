import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
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

      const response = await apiClient.getBlogPosts();

      // Map API posts to BlogPost interface
      const transformed: BlogPost[] = (response.posts || []).map((dbPost: any) => ({
        id: dbPost.id,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        coverImage: dbPost.cover_image || PLACEHOLDER_IMAGE,
        publishedAt: dbPost.published_at,
        author: dbPost.author_name || 'Admin',
        tags: [], // TODO: Add tags support
        readTime: Math.ceil(dbPost.content.length / 200), // Rough estimate
      }));

      setPosts(transformed);
      setCategories(["All"]);
    } catch (err) {
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