import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TextField, Button } from "../../../shared/ui";
import { useUser } from "../hooks/useUser";
import { ROLE_META } from "../../auth/userRole";
import { validateName, validatePhone, toE164AzPhone } from "../../../shared/utils/validators";
import { toProfilePhotoSrc, getInitials } from "../../../shared/utils/profilePhoto";
import "./ProfilePage.css";

export function ProfilePage() {
    const context = useOutletContext();
    const { user: userFromLayout } = context || {};
    const { user: userFromHook, loading, error, update, uploadPhoto, removePhoto } = useUser();

    const user = userFromHook ?? userFromLayout;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const [photoBusy, setPhotoBusy] = useState(false);
    const [photoError, setPhotoError] = useState(null);

    /* eslint-disable react-hooks/set-state-in-effect -- syncs editable form
       fields with the fetched user profile (an external system) once it
       loads; this is a deliberate one-way sync, not a render loop. */
    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setPhone(user.phone ?? "");
        }
    }, [user]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleSave = async (event) => {
        event.preventDefault();
        setSaveError(null);
        setSaveSuccess(false);

        const nextErrors = {
            name: validateName(name),
            phone: validatePhone(phone.replace(/^\+994/, "")),
        };
        setErrors(nextErrors);
        if (Object.values(nextErrors).some(Boolean)) return;

        setSaving(true);
        try {
            const digitsOnly = phone.replace(/[^\d]/g, "").replace(/^994/, "");
            await update({
                name: name.trim(),
                phone: toE164AzPhone(digitsOnly),
            });
            setSaveSuccess(true);
        } catch (err) {
            setSaveError(err.message || "Could not save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPhotoError(null);
        setPhotoBusy(true);
        try {
            await uploadPhoto(file);
        } catch (err) {
            setPhotoError(err.message || "Could not upload photo.");
        } finally {
            setPhotoBusy(false);
            event.target.value = "";
        }
    };

    const handlePhotoRemove = async () => {
        setPhotoError(null);
        setPhotoBusy(true);
        try {
            await removePhoto();
        } catch (err) {
            setPhotoError(err.message || "Could not remove photo.");
        } finally {
            setPhotoBusy(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="profile-page">
                <div className="profile-page__loading">Loading your profile…</div>
            </div>
        );
    }

    const roleLabel = user?.userRole ? ROLE_META[user.userRole]?.label : null;
    const avatar = toProfilePhotoSrc(user?.profilePhoto);
    const kycStatus = user?.kycStatus ?? "pending";

    return (
        <div className="profile-page">
            <div className="profile-page__header">
                <h1 className="profile-page__title">Profile</h1>
                <p className="profile-page__sub">Manage your personal details and account settings.</p>
            </div>

            {error ? <div className="form-error-banner">{error}</div> : null}

            <div className="profile-page__grid">
                <section className="profile-card">
                    <div className="profile-card__title">Photo</div>
                    <div className="profile-photo-row">
                        <div className="profile-avatar">
                            {avatar ? (
                                <img src={avatar} alt="Profile" className="profile-avatar__img" />
                            ) : (
                                <span>{getInitials(user?.name)}</span>
                            )}
                        </div>
                        <div className="profile-photo-actions">
                            <label className="mer-btn mer-btn--outline mer-btn--sm profile-photo-upload">
                                {photoBusy ? "Please wait…" : "Upload photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={photoBusy}
                                    hidden
                                />
                            </label>
                            {avatar ? (
                                <button
                                    type="button"
                                    className="mer-btn mer-btn--outline mer-btn--sm"
                                    onClick={handlePhotoRemove}
                                    disabled={photoBusy}
                                >
                                    Remove
                                </button>
                            ) : null}
                        </div>
                    </div>
                    {photoError ? <p className="field__error">{photoError}</p> : null}
                </section>

                <section className="profile-card">
                    <div className="profile-card__title">Account status</div>
                    <div className="profile-status-row">
                        <span className="profile-status-label">Role</span>
                        <span className="profile-status-value">{roleLabel ?? "—"}</span>
                    </div>
                    <div className="profile-status-row">
                        <span className="profile-status-label">KYC status</span>
                        <span className={`pill pill--${kycStatus === "approved" ? "eligible" : kycStatus === "rejected" ? "rejected" : "pending"}`}>
              <span className="pill__dot" />
                            {kycStatus === "approved" ? "Approved" : kycStatus === "rejected" ? "Rejected" : "Pending"}
            </span>
                    </div>
                </section>

                <section className="profile-card profile-card--wide">
                    <div className="profile-card__title">Personal details</div>

                    {saveError ? <div className="form-error-banner">{saveError}</div> : null}
                    {saveSuccess ? <div className="form-success-banner">Your changes have been saved.</div> : null}

                    <form onSubmit={handleSave} noValidate>
                        <TextField
                            label="Full name"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                            error={errors.name}
                            containerClassName="field--spaced"
                            autoComplete="name"
                        />

                        <TextField
                            label="Email"
                            type="email"
                            value={user?.email ?? ""}
                            containerClassName="field--spaced"
                            disabled
                            readOnly
                        />

                        <TextField
                            label="Phone number"
                            prefix="+994"
                            value={phone.replace(/^\+994/, "")}
                            onChange={(event) => {
                                setPhone(event.target.value);
                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            error={errors.phone}
                            containerClassName="field--spaced"
                            autoComplete="tel-national"
                            inputMode="numeric"
                        />

                        <Button type="submit" loading={saving}>
                            Save changes
                        </Button>
                    </form>
                </section>
            </div>
        </div>
    );
}