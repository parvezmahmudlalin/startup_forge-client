"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, TextArea, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

// Gravity UI Icons & React Icons
import { Camera, Plus, Compass, ArrowRightToSquare } from "@gravity-ui/icons";
import { BiUser } from "react-icons/bi";
import { HiOutlineCheckCircle } from "react-icons/hi2";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Form States
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Populate user data once loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setBio(user.bio || "");
      setSkills(user.skills || ["React", "Next.js", "Tailwind CSS"]);
    }
  }, [user]);

  // Handle adding a skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Handle Image Upload / Preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call or authClient update logic
      setTimeout(() => {
        setIsSaving(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    }
  };

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5 dark:border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Account Profile
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Update your public profile, personal information, skills, and bio.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          <HiOutlineCheckCircle className="h-5 w-5" />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. IMAGE UPLOAD SECTION */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Profile Picture
          </h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative group">
              <Avatar
                src={image || undefined}
                className="h-24 w-24 ring-4 ring-indigo-500/20 text-2xl"
              >
                <Avatar.Fallback className="bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {name ? name.charAt(0).toUpperCase() : <BiUser className="h-8 w-8" />}
                </Avatar.Fallback>
              </Avatar>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload a new photo
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Allowed Formats: JPG, PNG, or GIF. Max size: 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* 2. NAME SECTION */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Personal Details
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 3. BIO SECTION */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Bio
          </h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Write a short bio about yourself, your background, or your startup interests.
          </p>
          <TextArea
            rows={4}
            placeholder="Tell us a little bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 4. SKILLS SECTION */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Skills & Expertise
          </h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Add skills to showcase your expertise on your profile.
          </p>

          <div className="mb-4 flex gap-2">
            <Input
              type="text"
              placeholder="Add a skill (e.g. React, Marketing, Sales)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill(e)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="flex min-h-[40px] flex-wrap gap-2 rounded-xl border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-950/50">
            {skills.length === 0 ? (
              <span className="p-1 text-xs text-gray-400">No skills added yet.</span>
            ) : (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500 focus:outline-none"
                  >
                    <Compass className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 font-medium text-white shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <ArrowRightToSquare className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;