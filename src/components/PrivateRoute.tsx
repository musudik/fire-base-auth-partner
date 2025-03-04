import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an AuthContext

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth(); // Assuming useAuth provides the current user

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export { PrivateRoute };