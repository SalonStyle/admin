"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./sidebar-provider";

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white px-2 py-2 flex items-center justify-between sticky top-0 z-10 rounded-xl">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* <h1 className="text-xl font-bold">Barber</h1> */}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-[200px] lg:w-[300px] h-9"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative bg-gray-100 cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer account-menu">
          <Avatar className="bg-gray-200">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>RF</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="font-medium text-sm">Robert Fox</div>
            <div className="text-xs text-gray-500">robertfox@gmail.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
