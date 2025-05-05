'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
          404
        </h1>
        
        <div className="max-w-[600px] space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Looks like we've wandered off the map
          </h2>
          <p className="text-muted-foreground">
            Don't worry, even the best explorers get lost sometimes. Let's get you back on track.
          </p>
        </div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="default"
            size="lg"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          <p>Error Code: Lost_In_Digital_Space_404</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 