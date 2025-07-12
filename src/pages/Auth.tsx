import { Link, useSearchParams } from "react-router";
import { ArrowLeftFromLine } from "lucide-react";
import { Tabs } from "@radix-ui/react-tabs";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/login";
import Signup from "@/components/auth/signup";

export default function Auth() {
  const [tab, setTab] = useSearchParams("?tab=login");
  
  function handleTabChange(value: string) {
    setTab({ tab: value });
  }

  const tabValue = tab.get("tab") || "login";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden dark:bg-[#0a0b0f] bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1f9ff] via-[#e6e6e6] to-[#f1f9ff] dark:from-[#000000] dark:via-gray-800 dark:to-[#000000] opacity-85" />
      
      <Card className="w-full mt-10 max-w-md mx-4 p-8 bg-white dark:bg-[#060708] backdrop-blur-sm shadow-2xl dark:shadow-none relative border-gray-300 dark:border-[#2a2a2a]">
        <Link to="/" className="absolute -top-7 left-0 text-[13px] text-gray-700 dark:text-[#e1e1e1] transition-colors hover:text-gray-950 dark:hover:text-white flex gap-1 items-center">
          <ArrowLeftFromLine className="h-[22px] w-[22px]" />
          Quay lại
        </Link>
        
        <Tabs className="w-full" onValueChange={handleTabChange} value={tabValue}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-[#1a1a1a]">
            <TabsTrigger value="login" className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-gray-600 dark:text-[#e1e1e1] data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
              Đăng ký
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <Login />
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <Signup />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
