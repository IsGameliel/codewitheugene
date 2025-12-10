import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProjects />
      <FeaturedCourses />
      <CTASection />
    </Layout>
  );
};

export default Index;
