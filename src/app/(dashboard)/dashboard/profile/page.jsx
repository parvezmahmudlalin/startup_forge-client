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
  FiLogOut,
} from "react-icons/fi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      setMessage({
        type: "error",
        text: "Failed to sign out. Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

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

      // 3. Update Database via API using env base URL
      const endpoint = `${API_BASE_URL}/api/users/profile`;
      await serverMutation(endpoint, "PUT", {
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
      <div className="flex justify-center py-20 text-slate-700 dark:text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and professional profile.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FiEdit3 size={16} />
          Edit Profile
        </button>
      </div>

      {/* Global Message */}
      {message.text && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
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
        <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser size={38} className="text-slate-400 dark:text-slate-500" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {name || "Your Name"}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FiMail size={15} />
                {email}
              </div>
              {user.role && (
                <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700 ring-1 ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/30">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
          <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
            About Me
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {bio || (
              <span className="text-slate-400 dark:text-slate-500">
                No bio added yet. Click{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Edit Profile
                </span>{" "}
                to add your bio.
              </span>
            )}
          </p>
        </div>

        {/* Skills */}
        <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-8">
          <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
            Skills
          </h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No skills added yet.
            </p>
          )}
        </div>

        {/* Sign Out Section */}
        <div className="bg-slate-50/50 p-6 dark:bg-slate-900/50 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Account Session
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign out of your account on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              {isSigningOut ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent dark:border-rose-400" />
                  Signing out...
                </>
              ) : (
                <>
                  <FiLogOut size={15} />
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              handleCloseEdit();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
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
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5 p-6">
              {/* Photo Input */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Photo
                </label>

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    {editImage ? (
                      <img
                        src={editImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser size={30} className="text-slate-400 dark:text-slate-500" />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="edit-profile-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <FiCamera size={15} />
                      Change Photo
                      <input
                        id="edit-profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div>
                <label
                  htmlFor="edit-bio"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                />
                <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                  {editBio.length}/500
                </p>
              </div>

              {/* Skills Input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="e.g. React, Node.js, UI/UX"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <FiPlus size={16} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Edit Skills Badges */}
                {editSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editSkills.map((skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Alert Message */}
              {message.type === "error" && message.text && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                  <FiAlertCircle size={15} />
                  {message.text}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}