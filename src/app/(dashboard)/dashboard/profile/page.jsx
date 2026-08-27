"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { serverMutation } from "@/lib/api";
import { imageUploader } from "@/lib/imageUploader";

import {
  FiUser,
  FiMail,
  FiCamera,
  FiEdit3,
  FiSave,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // Profile Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form States
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load User Info
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setImage(user.image || "");
    setBio(user.bio || "");
    setSkills(Array.isArray(user.skills) ? user.skills : []);
  }, [user]);

  // Open Edit Modal
  const handleOpenEdit = () => {
    setEditName(name);
    setEditImage(image);
    setEditImageFile(null);
    setEditBio(bio);
    setEditSkills([...skills]);
    setSkillInput("");
    setMessage({ type: "", text: "" });
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    if (isSaving) return;
    setIsEditModalOpen(false);
    setEditImageFile(null);
    setSkillInput("");
  };

  // Image Change Handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5MB.",
      });
      return;
    }

    setEditImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setEditImage(previewUrl);
    setMessage({ type: "", text: "" });
  };

  // Add Skill
  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    const exists = editSkills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setEditSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setEditSkills((prev) => prev.filter((item) => item !== skillToRemove));
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (!user?.email) {
      setMessage({ type: "error", text: "User session not found." });
      return;
    }

    if (!editName.trim()) {
      setMessage({ type: "error", text: "Name is required." });
      return;
    }

    try {
      setIsSaving(true);
      setMessage({ type: "", text: "" });

      // 1. Image Upload
      let finalImage = editImage;
      if (editImageFile) {
        finalImage = await imageUploader(editImageFile);
      }

      // 2. Update Auth Session
      await authClient.updateUser({
        name: editName.trim(),
        image: finalImage || "",
      });

      // 3. Update Database
      await serverMutation("/api/users/profile", "PUT", {
        email: user.email,
        name: editName.trim(),
        image: finalImage || "",
        bio: editBio.trim(),
        skills: editSkills,
      });

      // 4. Update Local State
      setName(editName.trim());
      setImage(finalImage || "");
      setBio(editBio.trim());
      setSkills(editSkills);
      setEditImageFile(null);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Profile Update Error:", error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auth Loading
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FiAlertCircle className="mx-auto mb-3 text-rose-500" size={32} />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage your personal information and professional profile.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <FiEdit3 size={17} />
            Edit Profile
          </button>
        </div>

        {/* Global Message */}
        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {message.type === "success" ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Main Info */}
          <div className="border-b border-slate-200 p-6 dark:border-slate-800 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                {image ? (
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser size={42} className="text-slate-400" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {name || "Your Name"}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <FiMail size={15} />
                  {email}
                </div>
                {user.role && (
                  <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border-b border-slate-200 p-6 dark:border-slate-800 sm:p-8">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
              About Me
            </h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              {bio || (
                <span className="text-slate-400 dark:text-slate-500">
                  No bio added yet. Click{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Edit Profile
                  </span>{" "}
                  to add your bio.
                </span>
              )}
            </p>
          </div>

          {/* Skills */}
          <div className="p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Skills
            </h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-500">
                No skills added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-black/80"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              handleCloseEdit();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Profile
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Update your profile information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6 p-6">
              {/* Photo Input */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Profile Photo
                </label>

                <div className="flex items-center gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                    {editImage ? (
                      <img
                        src={editImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser size={34} className="text-slate-400" />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="edit-profile-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <FiCamera size={16} />
                      Change Photo
                      <input
                        id="edit-profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div>
                <label
                  htmlFor="edit-bio"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
                  {editBio.length}/500
                </p>
              </div>

              {/* Skills Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="e.g. React, Node.js, UI/UX"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <FiPlus size={17} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>

                {/* Edit Skills Badges */}
                {editSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editSkills.map((skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="rounded-full p-0.5 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-500/20 dark:hover:text-white"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Alert Message */}
              {message.type === "error" && message.text && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                  <FiAlertCircle size={17} />
                  {message.text}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}