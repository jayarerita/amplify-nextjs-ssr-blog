'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { siX, siBluesky } from 'simple-icons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Import the css file
import './socials.css';
import { useTheme } from 'next-themes';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  isDark?: boolean;
}

const Icon = ({ children, size = 24, isDark, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    {children}
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: 'Bluesky',
    href: 'https://bsky.app/profile/yourusername',
    icon: (props: IconProps) => (
      <Icon {...props}>

      <svg id="flutterby" className="bluesky-flutter" viewBox="0 0 566 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="wing" fill="currentColor" d="M 123.244 35.008 C 188.248 83.809 283.836 176.879 283.836 235.857 C 283.836 316.899 283.879 235.845 283.836 376.038 C 283.889 375.995 282.67 376.544 280.212 383.758 C 266.806 423.111 214.487 576.685 94.841 453.913 C 31.843 389.269 61.013 324.625 175.682 305.108 C 110.08 316.274 36.332 297.827 16.093 225.504 C 10.271 204.699 0.343 76.56 0.343 59.246 C 0.343 -27.451 76.342 -0.206 123.244 35.008 Z" />
        </defs>
        <use xlinkHref="#wing" className="left" />
        <use xlinkHref="#wing" className="right" />
      </svg>
</Icon>
    ),
    description: 'Join me on Bluesky for decentralized social networking',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/yourusername',
    icon: (props: IconProps) => (
      <Icon {...props} className="x-logo">
        <path d={siX.path} />
      </Icon>
    ),
    description: 'Follow me on X for tech insights and updates',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: (props: IconProps) => (
      <>
      {props.isDark ? (
        <Image src={"/InBug-White.png"} alt="LinkedIn" width={24} height={24} />
      ) : (
        <Image src={"/InBug-Black.png"} alt="LinkedIn" width={24} height={24} />
      )}
      </>
    ),
    description: 'Connect with me professionally on LinkedIn',
  }
];

export function SocialsContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Connect With Me</h1>
        <p className="text-muted-foreground">
          Find me across the social web and let's stay connected
        </p>
      </motion.div>

      <div className="grid gap-6 mt-8">
        {SOCIAL_LINKS.map((social, index) => (
          <motion.div
            key={social.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-4 group-hover:bg-primary/10 transition-colors">
                    <social.icon className="h-6 w-6" isDark={isDark} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold">{social.name}</h2>
                    <p className="text-muted-foreground">{social.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 