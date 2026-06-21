import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { UserRole } from "../userRole";

const RegistrationContext = createContext(null);

const initialState = {
  userRole: UserRole.MERCHANT,
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegistrationProvider({ children }) {
  const [formData, setFormData] = useState(initialState);

  const updateFields = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
  }, []);

  const value = useMemo(
    () => ({ formData, updateFields, reset }),
    [formData, updateFields, reset]
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return ctx;
}
