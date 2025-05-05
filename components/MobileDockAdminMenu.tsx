'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export function MobileDockAdminMenu() {
  const { signOut } = useAuthenticator();
  const router = useRouter();

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <span className="sr-only">Admin Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              Admin Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/posts/new')}>
              New Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="w-8 h-8" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
}
