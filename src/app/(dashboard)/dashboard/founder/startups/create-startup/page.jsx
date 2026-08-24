import BackButton from "@/components/dashboard/founder/BackButton";
import CreateStartupForm from "@/components/dashboard/founder/CreateStartupForm";

import Rocket from "lucide-react/dist/esm/icons/rocket";

export const metadata = {
  title: "Create Startup | StartupForge",
  description: "Create your startup profile and start building your dream team.",
};

export default function CreateStartupPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Client component only for router.back() */}
        <BackButton />

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Rocket size={30} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create Your Startup
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-default-500 sm:text-base">
            Create your startup profile and start building your dream team.
          </p>
        </div>

        {/* Interactive Client Form */}
       <CreateStartupForm/>

        <p className="mt-6 text-center text-xs text-default-400">
          StartupForge · Build your team. Build your future.
        </p>
      </div>
    </main>
  );
}