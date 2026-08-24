// "use client";

// import { Avatar } from "@heroui/react";
// import { Camera } from "@gravity-ui/icons";

// export default function ProfileHeader({ name, email, image, setImage, setImageFile }) {
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="relative rounded-2xl border border-default-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
//       <div className="flex flex-col items-center gap-4 sm:flex-row">
//         <div className="relative">
//           {/* isBordered তুলে Tailwind ring ব্যবহার করা হলো */}
//           <Avatar
//             src={image || undefined}
//             className="h-24 w-24 text-large ring-2 ring-indigo-600 ring-offset-2 ring-offset-background"
//           />
//           <label
//             htmlFor="profile-image-input"
//             className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
//           >
//             <Camera className="h-4 w-4" />
//             <input
//               id="profile-image-input"
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageChange}
//             />
//           </label>
//         </div>

//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {name || "Your Profile"}
//           </h1>
//           <p className="text-sm text-default-500">{email}</p>
//         </div>
//       </div>
//     </div>
//   );
// }