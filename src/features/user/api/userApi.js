import { httpClient } from "../../../shared/api/httpClient";

export function getUserDetails() {
    return httpClient.get("/users/me");
}

export function updateUserDetails(payload) {
    return httpClient.put("/users/me", payload);
}

export function uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.post("/users/me/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export function removeProfilePhoto() {
    const formData = new FormData();
    return httpClient.post("/users/me/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}