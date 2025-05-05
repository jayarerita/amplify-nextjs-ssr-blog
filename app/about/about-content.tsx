'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FileText, Github, Mail } from 'lucide-react';
import Link from 'next/link';

const SKILLS = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'AWS', 'Tailwind CSS',
  'GraphQL', 'PostgreSQL', 'Python', 'Docker'
];

const LINKS = [
  {
    title: 'Resume',
    href: '/resume.pdf',
    icon: FileText,
    description: 'Download my resume'
  },
  {
    title: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: Github,
    description: 'Check out my code'
  },
  {
    title: 'Email',
    href: 'mailto:your.email@example.com',
    icon: Mail,
    description: 'Get in touch'
  }
];

export default function AboutContent() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl font-bold tracking-tighter sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hey, I'm [Your Name] 👋
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-[600px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A full-stack developer passionate about building products that make a difference.
          </motion.p>
        </div>

        {/* Main Content */}
        <motion.div 
          className="grid gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-muted-foreground">
              I'm a software engineer with a focus on modern web technologies. 
              Currently building awesome things at [Company/Project]. 
              When I'm not coding, you'll find me [Your Interests].
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Links Section */}
        <motion.div
          className="grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {LINKS.map((link, index) => (
            <Link 
              key={link.title}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="no-underline"
            >
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <link.icon className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 