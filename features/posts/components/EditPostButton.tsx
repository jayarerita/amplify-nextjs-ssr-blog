'use client'

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

export function EditPostButton({ slug }: { slug: string }) {
  return (
    <Link 
          href={`/admin/posts/edit/${slug}`}
          className="absolute top-4 right-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            size="icon" 
            variant="ghost"
            className="rounded-full w-8 h-8 cursor-pointer bg-foreground/30 hover:bg-background/50 text-primary-foreground"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit post</span>
          </Button>
        </Link>
  )
}
