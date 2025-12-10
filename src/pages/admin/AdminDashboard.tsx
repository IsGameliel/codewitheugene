import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Total Students",
    value: "2,350",
    change: "+180 this month",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Courses",
    value: "6",
    change: "+2 new",
    trend: "up",
    icon: BookOpen,
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentPurchases = [
  { id: 1, user: "John Smith", email: "john@example.com", course: "Complete React Masterclass", amount: "$89.99", date: "2 min ago" },
  { id: 2, user: "Sarah Johnson", email: "sarah@example.com", course: "Node.js API Development", amount: "$79.99", date: "15 min ago" },
  { id: 3, user: "Mike Wilson", email: "mike@example.com", course: "TypeScript Patterns", amount: "$69.99", date: "1 hour ago" },
  { id: 4, user: "Emily Brown", email: "emily@example.com", course: "Full-Stack Bootcamp", amount: "$129.99", date: "3 hours ago" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl glass hover:shadow-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Purchases */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-bold">Recent Purchases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{purchase.user}</p>
                        <p className="text-sm text-muted-foreground">{purchase.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{purchase.course}</td>
                    <td className="p-4 font-semibold text-primary">{purchase.amount}</td>
                    <td className="p-4 text-muted-foreground">{purchase.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
