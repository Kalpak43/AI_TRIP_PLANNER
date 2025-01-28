import type React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const currentPath = `${location.pathname}${location.search}`;
      navigate("/signin", { state: { from: currentPath }, replace: true });
    }
  }, [user, navigate, location]);

  if (!user) {
    return null; // or a loading indicator
  }

  return <>{children}</>;
};

export default ProtectedRoute;
