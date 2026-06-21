import { Navigate } from "react-router-dom";
import { useRegistration } from "./context/RegistrationContext";

export function RequireRegistrationEmail({ children }) {
  const { formData } = useRegistration();

  if (!formData.email) {
    return <Navigate to="/qeydiyyat" replace />;
  }

  return children;
}
