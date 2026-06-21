import { httpClient } from "../../../shared/api/httpClient";

/**
 * @param {{ name: string, phone: string, email: string, password: string, userRole: "MERCHANT" | "INVESTOR" }} payload
 */
export function registerUser(payload) {
  return httpClient.post("/auth/register", payload);
}

/**
 * @param {{ email: string, code: string }} payload
 * @returns {Promise<{ accessToken: string }>}
 */
export function verifyUser(payload) {
  return httpClient.post("/auth/verify", payload);
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ accessToken: string }>}
 */
export function loginUser(payload) {
  return httpClient.post("/auth/login", payload);
}
