const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AZ_PHONE_RE = /^(10|50|51|55|70|77|99)\d{7}$/;

export function validateName(name) {
  if (!name.trim()) return "Full name cannot be empty";
  if (name.trim().length < 2) return "Full name is too short";
  return null;
}

export function validateEmail(email) {
  if (!email.trim()) return "Email cannot be empty";
  if (!EMAIL_RE.test(email.trim())) return "Email is not in a valid format";
  return null;
}

export function validatePhone(phone) {
  const digits = phone.replace(/\s/g, "");
  if (!digits) return "Phone number cannot be empty";
  if (!AZ_PHONE_RE.test(digits)) return "Phone number is not in a valid format";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password cannot be empty";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please re-enter your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

export function validateCode(code) {
  if (!/^\d{6}$/.test(code)) return "Code must be 6 digits";
  return null;
}

export function toE164AzPhone(localDigits) {
  return `+994${localDigits.replace(/\s/g, "")}`;
}