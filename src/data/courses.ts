export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  featured: boolean;
  bestseller?: boolean;
  previewUrl?: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Complete React Developer Masterclass 2024",
    description: "Master React from scratch. Build 10+ real-world projects including a full e-commerce platform with Redux, Hooks, and modern best practices.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.9,
    reviewCount: 2847,
    price: 89.99,
    originalPrice: 199.99,
    duration: "42 hours",
    lessons: 284,
    level: "Beginner",
    category: "Frontend",
    featured: true,
    bestseller: true,
  },
  {
    id: "2",
    title: "Node.js & Express API Development",
    description: "Build scalable REST APIs with Node.js, Express, MongoDB. Learn authentication, testing, deployment, and microservices architecture.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.8,
    reviewCount: 1923,
    price: 79.99,
    originalPrice: 149.99,
    duration: "36 hours",
    lessons: 198,
    level: "Intermediate",
    category: "Backend",
    featured: true,
  },
  {
    id: "3",
    title: "Advanced TypeScript Patterns",
    description: "Deep dive into TypeScript generics, decorators, and advanced patterns. Write type-safe, maintainable code like a pro.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.9,
    reviewCount: 892,
    price: 69.99,
    originalPrice: 129.99,
    duration: "18 hours",
    lessons: 94,
    level: "Advanced",
    category: "Programming",
    featured: true,
    bestseller: true,
  },
  {
    id: "4",
    title: "Full-Stack Web Development Bootcamp",
    description: "Complete bootcamp covering HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Go from zero to full-stack developer.",
    thumbnail: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.7,
    reviewCount: 4521,
    price: 129.99,
    originalPrice: 299.99,
    duration: "68 hours",
    lessons: 420,
    level: "Beginner",
    category: "Full Stack",
    featured: false,
  },
  {
    id: "5",
    title: "Docker & Kubernetes Essentials",
    description: "Learn containerization and orchestration. Deploy applications at scale with Docker and Kubernetes on AWS and GCP.",
    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.8,
    reviewCount: 756,
    price: 74.99,
    originalPrice: 159.99,
    duration: "24 hours",
    lessons: 142,
    level: "Intermediate",
    category: "DevOps",
    featured: false,
  },
  {
    id: "6",
    title: "AI & Machine Learning with Python",
    description: "Build AI applications from scratch. Cover neural networks, deep learning, NLP, and computer vision with TensorFlow and PyTorch.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop",
    instructor: "John Developer",
    rating: 4.9,
    reviewCount: 1284,
    price: 99.99,
    originalPrice: 249.99,
    duration: "52 hours",
    lessons: 312,
    level: "Intermediate",
    category: "AI/ML",
    featured: true,
  },
];

export const courseCategories = ["All", "Frontend", "Backend", "Full Stack", "DevOps", "AI/ML", "Programming"];
