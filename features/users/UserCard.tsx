import { type Schema } from "@/amplify/data/resource";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type UserProfileType = Schema["UserProfile"]["type"];

interface UserCardProps {
  user: UserProfileType;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const router = useRouter();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="h-12 w-12">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.displayName} />
          ) : (
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{user.displayName}</h3>
            <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
              {user.role === "admin" ? "Admin" : "User"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p className="font-medium">Email:</p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        {user.bio && (
          <div className="mt-3 text-sm">
            <p className="font-medium">Bio:</p>
            <p className="text-muted-foreground line-clamp-2">{user.bio}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <span className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/admin/users/${user.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        </span>
        {onDelete && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(user.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 