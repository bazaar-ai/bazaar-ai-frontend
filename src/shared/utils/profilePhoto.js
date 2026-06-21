/**
 * The backend serializes `profilePhoto` (a Java byte[]) as a base64 string
 * in JSON by default. Handle both that (the common case) and a raw byte
 * array, just in case the serialization changes.
 */
export function toProfilePhotoSrc(profilePhoto) {
  if (!profilePhoto) return null;

  if (typeof profilePhoto === "string") {
    return profilePhoto.startsWith("data:")
      ? profilePhoto
      : `data:image/jpeg;base64,${profilePhoto}`;
  }

  try {
    return `data:image/jpeg;base64,${btoa(
      String.fromCharCode(...new Uint8Array(profilePhoto))
    )}`;
  } catch {
    return null;
  }
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
