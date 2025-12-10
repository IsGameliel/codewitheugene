import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Code2, 
  Database, 
  Cloud, 
  Palette, 
  ArrowRight,
  Download,
  Mail,
  MapPin,
  Award,
  Users,
  BookOpen
} from "lucide-react";

const skills = [
  {
    category: "Frontend",
    icon: Palette,
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js", "HTML/CSS"],
  },
  {
    category: "Backend",
    icon: Database,
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs"],
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel", "Linux"],
  },
  {
    category: "Other",
    icon: Code2,
    items: ["Git", "Agile", "Testing", "Performance", "Security", "System Design"],
  },
];

const experience = [
  {
    role: "Senior Full-Stack Developer",
    company: "Tech Corp Inc.",
    period: "2021 - Present",
    description: "Leading development of enterprise web applications serving millions of users.",
  },
  {
    role: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2019 - 2021",
    description: "Built and scaled multiple products from MVP to production.",
  },
  {
    role: "Frontend Developer",
    company: "Agency Creative",
    period: "2017 - 2019",
    description: "Developed responsive web applications for various clients.",
  },
];

const achievements = [
  { icon: Users, value: "10,000+", label: "Students Taught" },
  { icon: BookOpen, value: "6", label: "Courses Published" },
  { icon: Award, value: "4.9", label: "Average Rating" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Hi, I'm <span className="text-gradient">John Developer</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                I'm a passionate full-stack developer with 8+ years of experience building scalable web applications. I love teaching and have helped thousands of developers level up their skills through my courses and tutorials.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  San Francisco, CA
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  hello@devportfolio.com
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/courses">
                    View Courses
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg">
                  <Download className="w-5 h-5" />
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden glass shadow-glow">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop"
                  alt="John Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl glass shadow-card">
                <div className="text-3xl font-display font-bold text-gradient">8+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <div key={achievement.label} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <achievement.icon className="w-7 h-7" />
                </div>
                <div className="text-4xl font-display font-bold text-gradient mb-2">
                  {achievement.value}
                </div>
                <div className="text-muted-foreground">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
            <p className="text-muted-foreground">
              A comprehensive toolkit built over years of professional experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill) => (
              <div key={skill.category} className="p-6 rounded-2xl glass">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <skill.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold mb-4">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-sm rounded-lg bg-secondary text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Work <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-muted-foreground">
              A journey through companies where I've made an impact.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-border last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 rounded-full bg-primary" />
                <div className="p-6 rounded-2xl glass">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-display font-bold">{exp.role}</h3>
                    <span className="text-sm text-primary">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{exp.company}</p>
                  <p className="text-muted-foreground text-sm">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Let's Work <span className="text-gradient">Together</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Interested in collaborating or have a project in mind? I'd love to hear from you.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="mailto:hello@devportfolio.com">
                <Mail className="w-5 h-5" />
                Get In Touch
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
