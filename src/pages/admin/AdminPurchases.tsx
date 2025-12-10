import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye } from "lucide-react";
import { useState } from "react";

const purchases = [
  { id: "ORD-001", user: "John Smith", email: "john@example.com", course: "Complete React Masterclass", amount: 89.99, date: "2024-01-15", status: "completed" },
  { id: "ORD-002", user: "Sarah Johnson", email: "sarah@example.com", course: "Node.js API Development", amount: 79.99, date: "2024-01-14", status: "completed" },
  { id: "ORD-003", user: "Mike Wilson", email: "mike@example.com", course: "TypeScript Patterns", amount: 69.99, date: "2024-01-13", status: "completed" },
  { id: "ORD-004", user: "Emily Brown", email: "emily@example.com", course: "Full-Stack Bootcamp", amount: 129.99, date: "2024-01-12", status: "refunded" },
  { id: "ORD-005", user: "David Lee", email: "david@example.com", course: "AI & Machine Learning", amount: 99.99, date: "2024-01-11", status: "completed" },
];

const AdminPurchases = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Purchases</h1>
            <p className="text-muted-foreground">Track all course purchases and revenue</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-display font-bold text-gradient">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-6 rounded-2xl glass">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-display font-bold">{purchases.length}</p>
          </div>
          <div className="p-6 rounded-2xl glass">
            <p className="text-sm text-muted-foreground mb-1">Refund Rate</p>
            <p className="text-3xl font-display font-bold">
              {((purchases.filter((p) => p.status === "refunded").length / purchases.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Purchases Table */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="p-4 font-mono text-sm">{purchase.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{purchase.user}</p>
                        <p className="text-sm text-muted-foreground">{purchase.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">
                      {purchase.course}
                    </td>
                    <td className="p-4 font-semibold text-primary">${purchase.amount}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          purchase.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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

export default AdminPurchases;
