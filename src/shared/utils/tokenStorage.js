const ACCESS_TOKEN_KEY = "bazaarai_access_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (!token) {
    console.error(
        "setAccessToken called with an empty/undefined token. Check the API response shape."
    );
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
