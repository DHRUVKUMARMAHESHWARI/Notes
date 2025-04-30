
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  created_at: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const NoteCard = ({ id, title, content, created_at, onClick, className, style }: NoteCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  
  // Generate random gradient from a predefined set for each card
  const gradients = [
    'from-pink-100 to-violet-100',
    'from-sky-100 to-indigo-100',
    'from-amber-100 to-orange-100',
    'from-lime-100 to-emerald-100',
    'from-fuchsia-100 to-pink-100',
  ];
  
  const randomGradient = gradients[Math.floor(id.charCodeAt(0) % gradients.length)];
  
  return (
    <Card 
      className={cn(
        "note-card cursor-pointer border-none bg-gradient-to-br shadow-md hover:shadow-lg transition-all duration-300", 
        randomGradient,
        className
      )}
      onClick={onClick}
      style={style}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg font-bold line-clamp-1 text-violet-900">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-purple-600 font-medium">
            {formattedDate}
          </CardDescription>
        </div>
        <Star className="h-4 w-4 text-amber-400" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
