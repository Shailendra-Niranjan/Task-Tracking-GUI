import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  return user == null ? <Navigate to="/login" replace /> : element;
};

export default ProtectedRoute;
