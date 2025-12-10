import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blogs";
import type { BlogPost as BlogPostType } from "@/data/blogs";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ArrowLeft, User, Share2, Twitter, Linkedin, Facebook, Heart, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (id) {
          // try by id
          let { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
          if (error || !data) {
            // try by slug
            const bySlug = await supabase.from("blog_posts").select("*").eq("slug", id).single();
            data = bySlug.data;
          }

          if (data) {
            const d: any = data;
            // normalize image
            let imageUrl: string | undefined = d.cover_image || undefined;
            if (imageUrl && !/^https?:\/\//i.test(imageUrl) && !imageUrl.startsWith("data:")) {
              try {
                const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(imageUrl);
                if (urlData?.publicUrl) imageUrl = urlData.publicUrl;
              } catch (e) {
                // ignore
              }
            }
            if (!imageUrl) imageUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop";

            const rawCategory = d.category || "General";
            const categoriesArr = String(rawCategory).split(",").map((c: string) => c.trim()).filter(Boolean);

            const mapped: BlogPostType = {
              id: d.id,
              title: d.title,
              excerpt: d.excerpt || (d.content ? String(d.content).slice(0, 150) : ""),
              content: d.content || "",
              image: imageUrl,
              author: d.author || "Admin",
              authorImage: d.author_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
              date: d.published_at || d.created_at,
              readTime: d.read_time || "5 min read",
              category: categoriesArr[0] || "General",
              categories: categoriesArr,
              tags: d.tags || [],
              likes: d.likes || 0,
              featured: false,
            };

            setPost(mapped);
            setLoading(false);
            return;
          }
        }

        // fallback to static
        const staticPost = blogPosts.find((p) => p.id === id || p.id === String(id));
        if (staticPost) setPost(staticPost);
        else setPost(null);
      } catch (e) {
        const staticPost = blogPosts.find((p) => p.id === id || p.id === String(id));
        if (staticPost) setPost(staticPost);
        else setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formattedDate = post ? new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  const relatedPosts = post ? blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2) : [];

  // Reactions state (localStorage-backed for now)
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // initialize reactions when post loads
  useEffect(() => {
    if (!post) return;
    try {
      const LIKE_KEY = `liked_${post.id}`;
      const COUNT_KEY = `likes_count_${post.id}`;
      const storedLiked = localStorage.getItem(LIKE_KEY);
      const storedCount = localStorage.getItem(COUNT_KEY);
      setLiked(storedLiked === "true");
      if (storedCount) setLikesCount(Number(storedCount));
      else setLikesCount(post.likes || 0);
    } catch (e) {
      setLiked(false);
      setLikesCount(post.likes || 0);
    }
  }, [post]);

  useEffect(() => {
    if (!post) return;
    try {
      const LIKE_KEY = `liked_${post.id}`;
      const COUNT_KEY = `likes_count_${post.id}`;
      localStorage.setItem(LIKE_KEY, liked ? "true" : "false");
      localStorage.setItem(COUNT_KEY, String(likesCount));
    } catch (e) {
      // ignore storage errors
    }
  }, [liked, likesCount, post]);

  const toggleLike = () => {
    if (!post) return;
    if (liked) {
      setLikesCount((c) => Math.max(0, c - 1));
      setLiked(false);
    } else {
      setLikesCount((c) => c + 1);
      setLiked(true);
    }
  };

  const postUrl = typeof window !== "undefined" && post ? `${window.location.origin}/blog/${post.id}` : `/blog/${id}`;

  const handleNativeShare = async () => {
    if (!post) return;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: post.title,
          text: post.excerpt,
          url: postUrl,
        });
      } catch (e) {
        // user cancelled or failed
      }
    } else {
      // fallback to copy
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (!post) return;
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />

        <div className="container-custom relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            <Badge variant="outline" className="text-primary border-primary/50 mb-4">
              {post.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 animate-fade-in">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden glass animate-scale-in">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {post.excerpt}
              </p>

              <h2 className="text-2xl font-display font-bold text-foreground mt-12 mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 className="text-2xl font-display font-bold text-foreground mt-12 mb-4">Key Concepts</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 my-8">
                <p className="text-foreground font-medium italic">
                  "The best way to learn is by building real projects. Theory without practice is just imagination."
                </p>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground mt-12 mb-4">Conclusion</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </article>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Reactions: Like + Share */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    /* placeholder, handled below */
                  }}
                  className="inline-flex items-center gap-2 text-muted-foreground"
                >
                  <Share2 className="w-5 h-5" />
                  Share this article
                </button>
              </div>

              <div className="flex items-center gap-3">
                  <button
                    onClick={toggleLike}
                    aria-pressed={liked}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      liked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-primary"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{likesCount}</span>
                  </button>
                  <button
                    onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`)}
                    title="Share on Twitter"
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openShareWindow(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`)}
                    title="Share on LinkedIn"
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`)}
                    title="Share on Facebook"
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    title={copied ? "Link copied" : "Copy link"}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-card/30">
          <div className="container-custom">
            <h2 className="text-2xl font-display font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group rounded-2xl overflow-hidden glass hover:shadow-hover transition-all duration-500"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-bold group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">{relatedPost.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPost;
