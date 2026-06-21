import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import { AppRoutes } from "./app/AppRoutes";
import { MeshBackdrop } from "./shared/ui/MeshBackdrop";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MeshBackdrop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
