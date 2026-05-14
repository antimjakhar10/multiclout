import { Navigate, useLocation } from "react-router-dom";

function ProtectedUserRoute({ children }) {
  const location = useLocation();
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedUserRoute;