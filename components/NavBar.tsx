'use client';

import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import * as React from "react"
import { ScrollProgress } from '@/components/magicui/scroll-progress';
import { Home } from 'lucide-react';

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"

const hotTopics: { title: string; href: string; description: string }[] = [
  {
    title: "AWS Amplify",
    href: "/posts/topic/aws-amplify",
    description:
      "AWS Amplify is a development platform for building secure, scalable mobile and web applications.",
  },
  {
    title: "AI Agents",
    href: "/posts/topic/ai-agents",
    description:
      "AI Agents are a new way to build applications. They are a collection of tools and services that can be used to build applications.",
  },
  {
    title: "Next JS",
    href: "/posts/topic/next-js",
    description:
      "Next JS is a React framework for building server-side rendered (SSR) web applications.",
  },
  {
    title: "React",
    href: "/posts/topic/react",
    description: "React is a JavaScript library for building user interfaces.",
  },
  {
    title: "AWS Lambda",
    href: "/posts/topic/aws-lambda",
    description:
      "AWS Lambda is a compute service that lets you run code without provisioning or managing servers.",
  },
  {
    title: "AWS DynamoDB",
    href: "/posts/topic/aws-dynamodb",
    description:
      "AWS DynamoDB is a fast, flexible, and fully managed NoSQL database service that supports key-value and document data structures.",
  },
]

export function NavBar() {
  const { signOut, user } = useAuthenticator();
  const router = useRouter();
          
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center w-full max-w-3xl mx-auto p-4 relative">
        <span className="flex items-center w-max mx-auto">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About Me</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          {/* TODO Logo here */}
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Jake Rita
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Incredibly handsome and talented software engineer. Ready to build <del>your</del> my next big idea.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/about" title="Introduction">
                     Learn more about me.
                    </ListItem>
                    <ListItem href="/socials" title="Socials">
                      Find me on social media.
                    </ListItem>
                    <ListItem href="/contact" title="Contact">
                      Get in touch.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Hot Topics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {hotTopics.map((topic) => (
                      <ListItem
                        key={topic.title}
                        title={topic.title}
                        href={topic.href}
                      >
                        {topic.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {user && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem
                      key="Dashboard"
                      title="Dashboard"
                      href="/admin"
                      >
                        Dashboard
                      </ListItem>
                      <ListItem
                        key="New Post"
                        title="New Post"
                        href="/admin/posts/new"
                      >
                        New Post
                      </ListItem>
                      {/* Users */}
                      <ListItem
                        key="Users"
                        title="Users"
                        href="/admin/users"
                      >
                        Users
                      </ListItem>
                      {/* Sign Out Button */}
                      <ListItem
                        key="Sign Out"
                        title="Sign Out"
                        onClick={() => {
                          signOut();
                          router.push('/');
                        }}
                      >
                        Sign Out
                      </ListItem>
                    </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </span>
        <div className="absolute right-0">
          <ModeToggle />
        </div>
        <div className="absolute left-0">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <Home />
          </Button>
        </div>
      </div>
      <ScrollProgress className="bottom-0 top-auto -z-10" />
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

