// // src/app/(dashboard)/dashboard/profile/page.jsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@heroui/react";
// import { authClient } from "@/lib/auth-client";

// import { ArrowRightToSquare } from "@gravity-ui/icons";
// import { HiOutlineCheckCircle } from "react-icons/hi2";

// import ProfileHeader from "@/components/profile/ProfileHeader";
// import PersonalInfo from "@/components/profile/PersonalInfo";
// import BioSection from "@/components/profile/BioSection";
// import SkillsSection from "@/components/profile/SkillsSection";
// import { imageUploader } from "@/lib/imageUploader";

// export default function ProfilePage() {
//   const { data: session, isPending } = authClient.useSession();
//   const user = session?.user;

//   // Form States
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [bio, setBio] = useState("");
//   const [skills, setSkills] = useState([]);

//   const [isSaving, setIsSaving] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   // Load session user details
//   useEffect(() => {
//     if (user) {
//       setName(user.name || "");
//       setImage(user.image || "");
//       setBio(user.bio || "");
//       setSkills(user.skills || []);
//     }
//   }, [user]);

//   // Form Submit Handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setMessage({ type: "", text: "" });

//     try {
//       let finalImageUrl = image;

//       // 1. Upload new image if file selected
//       if (imageFile) {
//         finalImageUrl = await imageUploader(imageFile, user.image);
//       }

//       // 2. Update Auth Client User
//       await authClient.updateUser({
//         name,
//         image: finalImageUrl,
//       });

//       // 3. Update Database via Backend API
//       const response = await fetch("/api/users/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bio,
//           skills,
//           image: finalImageUrl,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update profile database.");
//       }

//       setMessage({ type: "success", text: "Profile updated successfully!" });
//     } catch (error) {
//       console.error("Profile Update Error:", error);
//       setMessage({
//         type: "error",
//         text: error.message || "Failed to update profile. Please try again.",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isPending) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-md"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-5xl px-5 py-10">
//       {message.text && (
//         <div
//           className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium border shadow-sm transition-all ${
//             message.type === "success"
//               ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
//               : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
//           }`}
//         >
//           <HiOutlineCheckCircle className="h-5 w-5" />
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <ProfileHeader
//           name={name}
//           email={user?.email}
//           image={image}
//           setImage={setImage}
//           setImageFile={setImageFile}
//         />

//         <PersonalInfo
//           name={name}
//           setName={setName}
//           email={user?.email}
//         />

//         <BioSection
//           bio={bio}
//           setBio={setBio}
//         />

//         <SkillsSection
//           skills={skills}
//           setSkills={setSkills}
//         />

//         <div className="flex justify-end pt-2">
//           <Button
//             type="submit"
//             color="primary"
//             disabled={isSaving}
//             className={`flex items-center gap-2 font-medium text-white shadow-lg transition-all ${
//               isSaving
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
//             }`}
//           >
//             {isSaving ? (
//               <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//             ) : (
//               <ArrowRightToSquare className="h-4 w-4" />
//             )}
//             {isSaving ? "Saving Changes..." : "Save Profile"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }



export default function ProfilePage() {

  return (  
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">Profile Page</h1>
    </div>
  );
}