import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Trash2, Edit2, Plus, Download, Eye, EyeOff, Bold, Italic, Underline, Heading2, List, ListOrdered, Image as ImageIcon, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  read_time: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminPosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    tags: "",
    read_time: "",
    is_published: false,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const { toast } = useToast();

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const { data: postsData, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(postsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "",
      category: post.category || "",
      tags: post.tags?.join(", ") || "",
      read_time: post.read_time || "",
      is_published: post.is_published,
    });
    setIsEditModalOpen(true);
  };

  const handleAddNewPost = () => {
    setSelectedPost(null);
    setEditForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      category: "",
      tags: "",
      read_time: "",
      is_published: false,
    });
    setIsEditModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const applyTextFormatting = (format: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editForm.content.substring(start, end);
    const beforeText = editForm.content.substring(0, start);
    const afterText = editForm.content.substring(end);

    let formattedContent = "";

    switch (format) {
      case "bold":
        formattedContent = beforeText + `**${selectedText || "bold text"}**` + afterText;
        break;
      case "italic":
        formattedContent = beforeText + `*${selectedText || "italic text"}*` + afterText;
        break;
      case "underline":
        formattedContent = beforeText + `<u>${selectedText || "underline text"}</u>` + afterText;
        break;
      case "h2":
        formattedContent = beforeText + `\n## ${selectedText || "Heading"}\n` + afterText;
        break;
      case "h3":
        formattedContent = beforeText + `\n### ${selectedText || "Subheading"}\n` + afterText;
        break;
      case "ul":
        formattedContent = beforeText + `\n- ${selectedText || "List item"}\n` + afterText;
        break;
      case "ol":
        formattedContent = beforeText + `\n1. ${selectedText || "List item"}\n` + afterText;
        break;
      case "link":
        formattedContent = beforeText + `[${selectedText || "link text"}](url)` + afterText;
        break;
      case "image":
        formattedContent = beforeText + `![alt text](image-url)` + afterText;
        break;
      default:
        return;
    }

    setEditForm({ ...editForm, content: formattedContent });

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start);
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Image size must be less than 5MB");
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please select a valid image file");
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setImageUploadError("");

      // Create a unique filename
      const timestamp = new Date().getTime();
      const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const filename = `blog-${timestamp}-${cleanFilename}`;

      // Try to upload to Supabase Storage
      let uploadedUrl = null;

      // First, ensure the bucket path exists by attempting the upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError && uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filename);

        uploadedUrl = urlData?.publicUrl;
      } else {
        // Fallback: Convert image to data URL
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (e) => {
            uploadedUrl = e.target?.result as string;
            resolve(uploadedUrl);
          };
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        setEditForm({ ...editForm, cover_image: uploadedUrl });
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to upload image. You can paste an image URL instead.";
      setImageUploadError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleSavePost = async () => {
    if (!editForm.title.trim() || !editForm.slug.trim()) {
      toast({
        title: "Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const tagsArray = editForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData = {
        title: editForm.title,
        slug: editForm.slug,
        excerpt: editForm.excerpt || null,
        content: editForm.content || null,
        cover_image: editForm.cover_image || null,
        category: editForm.category || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        read_time: editForm.read_time || null,
        is_published: editForm.is_published,
        published_at: editForm.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (selectedPost) {
        // Update existing post
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", selectedPost.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from("blog_posts")
          .insert([
            {
              ...postData,
              created_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }

      setIsEditModalOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: post.is_published ? "Post unpublished" : "Post published",
      });

      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleExportPosts = () => {
    try {
      const headers = ["Title", "Slug", "Category", "Status", "Published Date", "Read Time"];
      const rows = filteredPosts.map((post) => [
        post.title,
        post.slug,
        post.category || "Uncategorized",
        post.is_published ? "Published" : "Draft",
        post.published_at ? new Date(post.published_at).toLocaleDateString() : "—",
        post.read_time || "—",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `posts-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Exported ${filteredPosts.length} posts`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export posts",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog posts ({filteredPosts.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPosts} disabled={loading || filteredPosts.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export Posts
            </Button>
            <Button onClick={handleAddNewPost}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Posts Table */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Published Date
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Read Time
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium truncate max-w-xs">{post.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            /{post.slug}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {post.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            post.is_published
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }
                        >
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {post.read_time || "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            title={post.is_published ? "Unpublish" : "Publish"}
                          >
                            {post.is_published ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            title="Edit post"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Create Post Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {selectedPost
                ? "Update your blog post information below."
                : "Create a new blog post. Fill in all the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditForm({
                    ...editForm,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="Enter post title"
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                placeholder="post-slug"
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={editForm.excerpt}
                onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Content with Formatting Toolbar */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              
              {/* Formatting Toolbar */}
              <div className="mb-2 p-2 rounded-lg bg-secondary border border-border flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => applyTextFormatting("bold")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextFormatting("italic")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextFormatting("underline")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                
                <div className="w-px bg-border mx-1" />
                
                <button
                  type="button"
                  onClick={() => applyTextFormatting("h2")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextFormatting("ul")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextFormatting("ol")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                
                <div className="w-px bg-border mx-1" />
                
                <button
                  type="button"
                  onClick={() => applyTextFormatting("link")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Insert Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextFormatting("image")}
                  className="p-2 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                  title="Insert Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              <textarea
                id="content-textarea"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="Write your post content here... Use **text** for bold, *text* for italic, ## for headings, etc."
                rows={8}
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Use Markdown syntax or the formatting toolbar. Supports bold, italic, headings, lists, and more.
              </p>
            </div>

            {/* Cover Image with Upload Button */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              
              {/* Image Preview */}
              {editForm.cover_image && (
                <div className="mb-3 relative rounded-lg overflow-hidden bg-secondary border border-border">
                  <img
                    src={editForm.cover_image}
                    alt="Cover preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.cover_image}
                  onChange={(e) => setEditForm({ ...editForm, cover_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <ImageIcon className="w-4 h-4" />
                    Upload Image
                  </div>
                </label>
              </div>

              {imageUploadError && (
                <p className="text-xs text-destructive mt-2">{imageUploadError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="e.g., Technology, Design, Development"
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium mb-2">Read Time</label>
              <input
                type="text"
                value={editForm.read_time}
                onChange={(e) => setEditForm({ ...editForm, read_time: e.target.value })}
                placeholder="e.g., 5 min read"
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Publish Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={editForm.is_published}
                onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                className="w-4 h-4 rounded border border-border bg-secondary cursor-pointer"
              />
              <label htmlFor="is_published" className="text-sm font-medium cursor-pointer">
                Publish this post
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePost} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : selectedPost ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPosts;
