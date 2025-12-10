export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  category: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    category: "Web App",
    featured: true,
  },
  {
    id: "2",
    title: "AI Content Generator",
    description: "An AI-powered platform for generating marketing content, blog posts, and social media captions using GPT-4.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
    techStack: ["Next.js", "OpenAI", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://example.com",
    category: "AI/ML",
    featured: true,
  },
  {
    id: "3",
    title: "Real-Time Chat Application",
    description: "Scalable chat application with WebSocket support, file sharing, and end-to-end encryption.",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop",
    techStack: ["React", "Socket.io", "MongoDB", "Express"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    category: "Web App",
    featured: false,
  },
  {
    id: "4",
    title: "Fitness Tracking Dashboard",
    description: "Comprehensive fitness tracker with workout planning, progress charts, and integration with wearable devices.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    techStack: ["Vue.js", "D3.js", "Firebase", "Fitbit API"],
    liveUrl: "https://example.com",
    category: "Mobile",
    featured: true,
  },
  {
    id: "5",
    title: "Blockchain Voting System",
    description: "Decentralized voting platform ensuring transparency and security through smart contracts.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
    techStack: ["Solidity", "Ethereum", "React", "Web3.js"],
    repoUrl: "https://github.com",
    category: "Blockchain",
    featured: false,
  },
  {
    id: "6",
    title: "Task Management Suite",
    description: "Project management tool with Kanban boards, team collaboration, and automated workflows.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    techStack: ["React", "GraphQL", "PostgreSQL", "Docker"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    category: "Web App",
    featured: false,
  },
];

export const categories = ["All", "Web App", "AI/ML", "Mobile", "Blockchain"];
