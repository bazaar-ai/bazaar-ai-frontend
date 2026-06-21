import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TextField, Button } from "../../../shared/ui";
import { useUser } from "../hooks/useUser";
import { ROLE_META } from "../../auth/userRole";
import { validateName, validatePhone, toE164AzPhone } from "../../../shared/utils/validators";
import { toProfilePhotoSrc, getInitials } from "../../../shared/utils/profilePhoto";
import "./ProfilePage.css";

const STATUS_META = {
    ACTIVE: { label: "Active", tone: "eligible" },
    PENDING: { label: "Pending", tone: "pending" },
    SUSPENDED: { label: "Suspended", tone: "rejected" },
    BLOCKED: { label: "Blocked", tone: "rejected" },
};

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function ProfilePage() {
    const context = useOutletContext();
    const { user: userFromLayout } = context || {};
    const { user: userFromHook, loading, error, update, uploadPhoto, removePhoto } = useUser();

    const user = userFromHook ?? userFromLayout;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
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
            setCity(user.city ?? "");
            setCountry(user.country ?? "");
            setAddress(user.address ?? "");
            setDateOfBirth(user.dateOfBirth ?? "");
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
                city: city.trim() || null,
                country: country.trim() || null,
                address: address.trim() || null,
                dateOfBirth: dateOfBirth || null,
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
    const statusMeta = STATUS_META[user?.userStatus] ?? { label: user?.userStatus ?? "—", tone: "pending" };

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
                        <span className="profile-status-label">Status</span>
                        <span className={`pill pill--${statusMeta.tone}`}>
              <span className="pill__dot" />
                            {statusMeta.label}
            </span>
                    </div>
                </section>

                <section className="profile-card">
                    <div className="profile-card__title">Account info</div>
                    <div className="profile-status-row">
                        <span className="profile-status-label">Member since</span>
                        <span className="profile-status-value">{formatDate(user?.createdAt)}</span>
                    </div>
                    <div className="profile-status-row">
                        <span className="profile-status-label">Last updated</span>
                        <span className="profile-status-value">{formatDate(user?.updatedAt)}</span>
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

                        <div className="profile-field-row">
                            <TextField
                                label="City"
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                containerClassName="field--spaced"
                                autoComplete="address-level2"
                            />
                            <TextField
                                label="Country"
                                value={country}
                                onChange={(event) => setCountry(event.target.value)}
                                containerClassName="field--spaced"
                                autoComplete="country-name"
                            />
                        </div>

                        <TextField
                            label="Address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            containerClassName="field--spaced"
                            autoComplete="street-address"
                        />

                        <TextField
                            label="Date of birth"
                            type="date"
                            value={dateOfBirth}
                            onChange={(event) => setDateOfBirth(event.target.value)}
                            containerClassName="field--spaced"
                            autoComplete="bday"
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