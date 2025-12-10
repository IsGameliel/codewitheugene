import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/courses";
import {
  Star,
  Clock,
  BookOpen,
  Play,
  Check,
  ArrowLeft,
  Users,
  Award,
  Globe,
  Infinity,
  ShoppingCart,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button asChild>
              <Link to="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const features = [
    { icon: Clock, label: `${course.duration} of content` },
    { icon: BookOpen, label: `${course.lessons} lessons` },
    { icon: Infinity, label: "Lifetime access" },
    { icon: Globe, label: "Access on mobile & desktop" },
    { icon: Award, label: "Certificate of completion" },
  ];

  const whatYouLearn = [
    "Build real-world projects from scratch",
    "Master modern development best practices",
    "Understand core concepts deeply",
    "Deploy applications to production",
    "Write clean, maintainable code",
    "Debug and solve problems effectively",
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px]" />

        <div className="container-custom relative z-10">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {course.bestseller && (
                  <Badge className="bg-accent text-accent-foreground">Bestseller</Badge>
                )}
                <Badge variant="outline" className="text-primary border-primary/50">
                  {course.category}
                </Badge>
                <Badge variant="secondary">{course.level}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{(course.reviewCount * 3).toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop"
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-primary">{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl glass overflow-hidden">
                {/* Preview Image */}
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 text-sm bg-background/80 px-3 py-1 rounded-full">
                    Preview this course
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="p-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-display font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                        <Badge className="bg-destructive text-destructive-foreground">
                          {discount}% off
                        </Badge>
                      </>
                    )}
                  </div>

                  <Button variant="gradient" size="xl" className="w-full mb-4">
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mb-6">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature.label} className="flex items-center gap-3 text-sm">
                        <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
              What You'll Learn
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {whatYouLearn.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
