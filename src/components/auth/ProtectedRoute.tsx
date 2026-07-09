import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, refreshUser } = useAuth();
  const [isRefreshingRole, setIsRefreshingRole] = useState(false);

  useEffect(() => {
    if (!requireAdmin || isLoading || !user || isAdmin) {
      return;
    }

    let isMounted = true;

    const syncRole = async () => {
      setIsRefreshingRole(true);
      try {
        await refreshUser();
      } finally {
        if (isMounted) {
          setIsRefreshingRole(false);
        }
      }
    };

    void syncRole();

    return () => {
      isMounted = false;
    };
  }, [requireAdmin, isLoading, user, isAdmin, refreshUser]);

  if (isLoading || isRefreshingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
