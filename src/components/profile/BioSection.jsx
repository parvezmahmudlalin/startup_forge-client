// "use client";

// import { TextArea } from "@heroui/react";

// const MAX_BIO_LENGTH = 250;

// export default function BioSection({ bio, setBio }) {
//   return (
//     <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm">

//       <div className="mb-3 flex items-center justify-between">

//         <div>
//           <h2 className="text-xl font-bold">
//             Bio
//           </h2>

//           <p className="mt-1 text-sm text-default-500">
//             Tell people about yourself, your experience and startup interests.
//           </p>
//         </div>

//         <span
//           className={`text-sm font-medium ${
//             bio.length >= MAX_BIO_LENGTH
//               ? "text-danger"
//               : "text-default-500"
//           }`}
//         >
//           {bio.length}/{MAX_BIO_LENGTH}
//         </span>

//       </div>

//       <TextArea
//         value={bio}
//         onValueChange={setBio}
//         placeholder="Write a short bio..."
//         variant="bordered"
//         radius="lg"
//         minRows={5}
//         maxRows={8}
//         maxLength={MAX_BIO_LENGTH}
//       />

//       <p className="mt-3 text-xs text-default-500">
//         Maximum 250 characters.
//       </p>

//     </div>
//   );
// }