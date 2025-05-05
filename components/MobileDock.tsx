'use client';

import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Home, FileText, Settings, LogOut, User, Squirrel } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ModeToggle } from './ThemeToggle';
import { MobileDockAdminMenu } from './MobileDockAdminMenu';

export function MobileDock() {
  const { user } = useAuthenticator();
  const router = useRouter();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-50">
      <TooltipProvider>
        <Dock direction="middle">
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => router.push('/')}
                >
                  <Home className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => router.push('/about')}
                >
                  <User className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => router.push('/socials')}
                >
                  <Squirrel className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Socials</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          {user && <MobileDockAdminMenu />}
          <Separator orientation="vertical" className="h-full" />
          <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <ModeToggle buttonVariant="ghost" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
          
        </Dock>
      </TooltipProvider>
    </div>
  );
} 