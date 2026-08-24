// "use client";

// import { useState } from "react";
// import { Button, Chip, Input } from "@heroui/react";
// import { Plus } from "@gravity-ui/icons";

// const MAX_SKILLS = 15;

// export default function SkillsSection({ skills = [], setSkills }) {
//   const [skillInput, setSkillInput] = useState("");

//   // Add Skill
//   const handleAddSkill = () => {
//     const newSkill = skillInput.trim();

//     if (!newSkill) return;

//     // Duplicate check (Case-insensitive check is safer)
//     if (skills.some((item) => item.toLowerCase() === newSkill.toLowerCase())) {
//       alert("Skill already added!");
//       return;
//     }

//     // Max limit
//     if (skills.length >= MAX_SKILLS) {
//       alert("Maximum 15 skills allowed!");
//       return;
//     }

//     setSkills([...skills, newSkill]);
//     setSkillInput("");
//   };

//   // Remove Skill
//   const handleRemoveSkill = (skillToRemove) => {
//     setSkills(skills.filter((skill) => skill !== skillToRemove));
//   };

//   return (
//     <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm">
//       {/* Header */}
//       <div className="mb-5">
//         <h2 className="text-xl font-bold">Skills</h2>
//         <p className="mt-1 text-sm text-default-500">
//           Add up to {MAX_SKILLS} skills to showcase your expertise.
//         </p>
//       </div>

//       {/* Input */}
//       <div className="flex flex-col gap-3 sm:flex-row">
//         <Input
//           value={skillInput}
//           onValueChange={setSkillInput}
//           placeholder="React, Node.js, Marketing..."
//           variant="bordered"
//           radius="lg"
//           className="flex-1"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               handleAddSkill();
//             }
//           }}
//         />

//         <Button
//           color="primary"
//           radius="lg"
//           startContent={<Plus />}
//           onPress={handleAddSkill}
//         >
//           Add
//         </Button>
//       </div>

//       {/* Skills Container */}
//       <div className="mt-6 flex flex-wrap gap-2">
//         {skills.length === 0 ? (
//           <p className="text-sm text-default-500 italic">
//             No skills added yet.
//           </p>
//         ) : (
//           skills.map((skill) => (
//             <Chip
//               key={skill}
//               color="primary"
//               variant="flat"
//               onClose={() => handleRemoveSkill(skill)}
//             >
//               {skill}
//             </Chip>
//           ))
//         )}
//       </div>

//       {/* Footer */}
//       <div className="mt-4 text-right text-sm text-default-500">
//         {skills.length} / {MAX_SKILLS} Skills
//       </div>
//     </div>
//   );
// }