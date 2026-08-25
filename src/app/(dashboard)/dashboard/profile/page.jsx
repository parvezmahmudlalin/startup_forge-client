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
  FiBriefcase,
} from "react-icons/fi";

export default function ProfilePage() {
  const {
    data: session,
    isPending: authLoading,
  } = authClient.useSession();

  const user = session?.user;

  // ==========================================
  // Profile Data
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);

  // ==========================================
  // Modal States
  // ==========================================

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // Edit Form States
  // ==========================================

  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editImageFile, setEditImageFile] =
    useState(null);
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // ==========================================
  // Message
  // ==========================================

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // Load User
  // ==========================================

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setImage(user.image || "");
    setBio(user.bio || "");

    setSkills(
      Array.isArray(user.skills)
        ? user.skills
        : []
    );
  }, [user]);

  // ==========================================
  // Open Edit Modal
  // ==========================================

  const handleOpenEdit = () => {
    setEditName(name);
    setEditImage(image);
    setEditImageFile(null);
    setEditBio(bio);
    setEditSkills([...skills]);
    setSkillInput("");

    setMessage({
      type: "",
      text: "",
    });

    setIsEditModalOpen(true);
  };

  // ==========================================
  // Close Edit Modal
  // ==========================================

  const handleCloseEdit = () => {
    if (isSaving) return;

    setIsEditModalOpen(false);
    setEditImageFile(null);
    setSkillInput("");
  };

  // ==========================================
  // Image Change
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5MB.",
      });

      return;
    }

    setEditImageFile(file);

    // Preview image
    const previewUrl =
      URL.createObjectURL(file);

    setEditImage(previewUrl);

    setMessage({
      type: "",
      text: "",
    });
  };

  // ==========================================
  // Add Skill
  // ==========================================

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = editSkills.some(
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setEditSkills((prev) => [
      ...prev,
      skill,
    ]);

    setSkillInput("");
  };

  // ==========================================
  // Skill Enter
  // ==========================================

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // ==========================================
  // Remove Skill
  // ==========================================

  const handleRemoveSkill = (skill) => {
    setEditSkills((prev) =>
      prev.filter(
        (item) => item !== skill
      )
    );
  };

  // ==========================================
  // Save Profile
  // ==========================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    if (!user?.email) {
      setMessage({
        type: "error",
        text: "User session not found.",
      });

      return;
    }

    if (!editName.trim()) {
      setMessage({
        type: "error",
        text: "Name is required.",
      });

      return;
    }

    try {
      setIsSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      // ======================================
      // 1. Image Upload
      // ======================================

      let finalImage = editImage;

      if (editImageFile) {
        finalImage =
          await imageUploader(editImageFile);
      }

      // ======================================
      // 2. Update Better Auth
      // ======================================

      await authClient.updateUser({
        name: editName.trim(),
        image: finalImage || "",
      });

      // ======================================
      // 3. Update MongoDB
      // ======================================

      await serverMutation(
        "/api/users/profile",
        "PUT",
        {
          email: user.email,
          name: editName.trim(),
          image: finalImage || "",
          bio: editBio.trim(),
          skills: editSkills,
        }
      );

      // ======================================
      // 4. Update Local State
      // ======================================

      setName(editName.trim());
      setImage(finalImage || "");
      setBio(editBio.trim());
      setSkills(editSkills);

      setEditImageFile(null);

      // ======================================
      // Success
      // ======================================

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Close modal
      setIsEditModalOpen(false);

    } catch (error) {
      console.error(
        "Profile Update Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // Authentication Loading
  // ==========================================

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // ==========================================
  // Not Logged In
  // ==========================================

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-[#121824] px-8 py-6 text-center">
          <FiAlertCircle
            className="mx-auto mb-3 text-red-400"
            size={30}
          />

          <h2 className="text-lg font-semibold text-white">
            Authentication Required
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Main Page
  // ==========================================

  return (
    <>
      <div className="mx-auto max-w-5xl px-5 py-8">

        {/* ====================================
            Header
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-white">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your personal information
              and professional profile.
            </p>
          </div>

          {/* Edit Profile Button */}

          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <FiEdit3 size={17} />

            Edit Profile
          </button>
        </div>

        {/* ====================================
            Message
        ===================================== */}

        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
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

        {/* ====================================
            Profile Card
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121824]">

          {/* Profile Header */}

          <div className="border-b border-white/10 p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Profile Image */}

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#1c2638] bg-[#1a2332]">

                {image ? (
                  <img
                    src={image}
                    alt={name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser
                    size={42}
                    className="text-gray-500"
                  />
                )}

              </div>

              {/* User Info */}

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {name || "Your Name"}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                  <FiMail size={15} />
                  {email}
                </div>

                {user.role && (
                  <span className="mt-3 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                    {user.role}
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* ==================================
              About
          =================================== */}

          <div className="border-b border-white/10 p-6 sm:p-8">

            <h3 className="mb-3 text-lg font-semibold text-white">
              About Me
            </h3>

            <p className="text-sm leading-7 text-gray-400">
              {bio || (
                <span className="text-gray-600">
                  No bio added yet. Click{" "}
                  <span className="text-blue-400">
                    Edit Profile
                  </span>{" "}
                  to add your bio.
                </span>
              )}
            </p>

          </div>

          {/* ==================================
              Skills
          =================================== */}

          <div className="p-6 sm:p-8">

            <h3 className="mb-4 text-lg font-semibold text-white">
              Skills
            </h3>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">

                {skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No skills added yet.
              </p>
            )}

          </div>

        </div>
      </div>

      {/* ======================================
          EDIT PROFILE MODAL
      ======================================= */}

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !isSaving
            ) {
              handleCloseEdit();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#121824] shadow-2xl">

            {/* ==================================
                Modal Header
            =================================== */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#121824] px-6 py-4">

              <div>
                <h2 className="text-xl font-bold text-white">
                  Edit Profile
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update your profile information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* ==================================
                Modal Form
            =================================== */}

            <form
              onSubmit={handleSaveProfile}
              className="space-y-6 p-6"
            >

              {/* =================================
                  Image
              ================================== */}

              <div>

                <label className="mb-3 block text-sm font-medium text-gray-300">
                  Profile Photo
                </label>

                <div className="flex items-center gap-5">

                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#1c2638] bg-[#0d1420]">

                    {editImage ? (
                      <img
                        src={editImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser
                        size={34}
                        className="text-gray-500"
                      />
                    )}

                  </div>

                  <div>

                    <label
                      htmlFor="edit-profile-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      <FiCamera size={16} />

                      Change Photo

                      <input
                        id="edit-profile-image"
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>

                    <p className="mt-2 text-xs text-gray-600">
                      JPG, PNG or WebP. Max 5MB.
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================
                  Name
              ================================== */}

              <div>

                <label
                  htmlFor="edit-name"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>

                <div className="relative">

                  <FiUser
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-white/10 bg-[#0d1420] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                  />

                </div>

              </div>

              {/* =================================
                  Email
              ================================== */}

              <div>

                <label
                  htmlFor="edit-email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">

                  <FiMail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#0a101a] py-3 pl-10 pr-4 text-sm text-gray-600 outline-none"
                  />

                </div>

              </div>

              {/* =================================
                  Bio
              ================================== */}

              <div>

                <label
                  htmlFor="edit-bio"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Bio
                </label>

                <textarea
                  id="edit-bio"
                  value={editBio}
                  onChange={(e) =>
                    setEditBio(
                      e.target.value
                    )
                  }
                  placeholder="Tell others about yourself..."
                  rows={5}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#0d1420] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />

                <p className="mt-1 text-right text-xs text-gray-600">
                  {editBio.length}/500
                </p>

              </div>

              {/* =================================
                  Skills
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Skills
                </label>

                <div className="flex gap-2">

                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) =>
                      setSkillInput(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleSkillKeyDown
                    }
                    placeholder="e.g. React, Node.js, UI/UX"
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0d1420] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <FiPlus size={17} />

                    <span className="hidden sm:inline">
                      Add
                    </span>
                  </button>

                </div>

                {/* Skills */}

                {editSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">

                    {editSkills.map(
                      (skill, index) => (
                        <div
                          key={`${skill}-${index}`}
                          className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400"
                        >
                          <span>
                            {skill}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSkill(
                                skill
                              )
                            }
                            className="rounded-full p-0.5 hover:bg-blue-500/20 hover:text-white"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* =================================
                  Error Message
              ================================== */}

              {message.type === "error" &&
                message.text && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <FiAlertCircle
                      size={17}
                    />

                    {message.text}
                  </div>
                )}

              {/* =================================
                  Modal Footer
              ================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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