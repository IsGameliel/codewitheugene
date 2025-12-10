import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit2, Trash2, BarChart3, Users, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourseContext } from "@/contexts/CourseContext";

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { publishedCourses, deletePublishedCourse } = useCourseContext();

  // Show only published courses
  const allCourses = publishedCourses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    instructor: "You",
    rating: 0,
    reviewCount: 0,
    price: course.price,
    originalPrice: undefined,
    duration: course.duration,
    lessons: course.lessons,
    level: course.level,
    category: course.category,
    featured: false,
    bestseller: false,
    previewUrl: undefined,
    isPublished: true as const,
    publishedAt: course.publishedAt,
  }));

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (courseId: string) => {
    navigate("/admin/course-upload", { state: { editCourseId: courseId } });
  };

  const handleDelete = (courseId: string, isPublished: boolean) => {
    if (window.confirm("Delete this course permanently?")) {
      if (isPublished) {
        deletePublishedCourse(courseId);
      }
      toast({ title: "Course deleted", description: "The course has been removed." });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Your Courses</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your published courses</p>
            {/* session published courses banner removed (debug) */}
          </div>
          <Button className="bg-primary text-primary-foreground flex items-center gap-2 rounded-lg" onClick={() => navigate("/admin/course-upload")}>
            <Plus className="w-4 h-4" />
            Create Course
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-40 bg-secondary overflow-hidden group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleEdit(course.id)}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                      {course.isPublished && (
                        <Badge className="bg-green-500/20 text-green-600 text-xs">Published</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-primary border-primary/50">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {course.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{(course.reviewCount * 3).toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>${course.price}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({course.reviewCount} reviews)</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3">
                    <Button variant="ghost" size="sm" className="flex-1 text-primary">
                      <Eye className="w-4 h-4" /> Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(course.id)}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(course.id, course.isPublished || false)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">No courses published yet</p>
            <Button className="bg-primary text-primary-foreground">Create your first course</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
