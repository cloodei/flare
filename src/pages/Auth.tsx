import { lazy, Suspense } from "react";
import { Navigate, useSearchParams } from "react-router";
import { Card } from "@/components/ui/card";
import { useUser } from "@/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/login";
import ModeToggle from "@/components/mode-toggle";
const Signup = lazy(() => import("@/components/auth/signup"));

export default function Auth() {
  const [tab, setTab] = useSearchParams("?tab=login");
  const user = useUser();

  if (user)
    return <Navigate to="/" replace />;

  function handleTabChange(value: string) {
    setTab({ tab: value });
  }

  const tabValue = tab.get("tab") || "login";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden dark:bg-[#0a0b0f] bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1f9ff] via-[#e6e6e6] to-[#f1f9ff] dark:from-[#000000] dark:via-neutral-900 dark:to-[#000000] opacity-85" />
      
      <Card className="w-full max-w-md mx-4 p-8 bg-white dark:bg-[#060708] backdrop-blur-sm shadow-2xl dark:shadow-none relative border-gray-300 dark:border-[#2a2a2a]">
        <ModeToggle className="absolute -top-2 right-0 max-sm:-translate-y-full sm:top-0 sm:-right-3 sm:translate-x-full" />

        <Tabs className="w-full" onValueChange={handleTabChange} value={tabValue}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-[#1a1a1a]">
            <TabsTrigger
              value="login"
              className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white cursor-pointer">
              Đăng nhập
            </TabsTrigger>

            <TabsTrigger
              value="signup"
              className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white cursor-pointer">
              Đăng ký
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <Suspense fallback={<SignUpSkeleton />}>
              <Signup />
            </Suspense>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function SignUpSkeleton() {
  return (
    <div className="space-y-3.5">
      <Skeleton className="w-full h-[38px] sm:h-10 max-sm:placeholder:text-sm" />
      <Skeleton className="w-full h-[38px] sm:h-10 max-sm:placeholder:text-sm" />
      <Skeleton className="w-full h-[38px] sm:h-10 max-sm:placeholder:text-sm" />
      <Skeleton className="w-full h-[38px] sm:h-10 max-sm:placeholder:text-sm" />
    </div>
  );
}
