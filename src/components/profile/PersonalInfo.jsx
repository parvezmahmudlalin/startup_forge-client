// "use client";

// import { Input } from "@heroui/react";
// import { Envelope, Person } from "@gravity-ui/icons";

// export default function PersonalInfo({ name, setName, email }) {
//   return (
//     <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
//       <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
//         Personal Information
//       </h2>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <Input
//           type="text"
//           label="Full Name"
//           placeholder="Enter your name"
//           value={name}
//           onValueChange={setName}
//           isRequired
//           variant="bordered"
//           labelPlacement="outside"
//           startContent={<Person className="text-default-400 h-4 w-4" />}
//         />

//         <Input
//           type="email"
//           label="Email Address"
//           value={email || ""}
//           isReadOnly
//           isDisabled
//           variant="bordered"
//           labelPlacement="outside"
//           startContent={<Envelope className="text-default-400 h-4 w-4" />}
//         />
//       </div>
//     </div>
//   );
// }