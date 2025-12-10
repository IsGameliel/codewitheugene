export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  category: string;
  /** Optional list of categories when a post belongs to multiple categories */
  categories?: string[];
  tags: string[];
  /** Reaction counts stored locally for static data */
  likes?: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications in 2024",
    excerpt: "Learn the best practices and patterns for building large-scale React applications that are maintainable and performant.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    author: "John Developer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "React",
    tags: ["React", "JavaScript", "Architecture"],
    featured: true,
    likes: 12,
  },
  {
    id: "2",
    title: "The Future of Web Development: What to Learn in 2024",
    excerpt: "A comprehensive guide to the technologies and skills that will be most valuable for web developers this year.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    author: "John Developer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Career",
    tags: ["Career", "Learning", "Trends"],
    featured: true,
    likes: 8,
  },
  {
    id: "3",
    title: "Mastering TypeScript Generics",
    excerpt: "Deep dive into TypeScript generics with practical examples and real-world use cases.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop",
    author: "John Developer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Programming", "Tutorial"],
    featured: false,
    likes: 3,
  },
  {
    id: "4",
    title: "Building REST APIs with Node.js Best Practices",
    excerpt: "Learn how to structure and build production-ready REST APIs following industry best practices.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
    author: "John Developer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
    date: "2023-12-28",
    readTime: "15 min read",
    category: "Node.js",
    tags: ["Node.js", "API", "Backend"],
    featured: false,
    likes: 1,
  },
];

export const blogCategories = ["All", "React", "TypeScript", "Node.js", "Career", "Tutorial"];
