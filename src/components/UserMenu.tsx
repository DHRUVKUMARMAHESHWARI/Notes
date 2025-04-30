
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-note-dark" />
        <span className="text-sm font-medium text-note-dark hidden sm:inline-block">
          {user?.email}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        className="border-note-border"
      >
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline-block">Log out</span>
      </Button>
    </div>
  );
};

export default UserMenu;
