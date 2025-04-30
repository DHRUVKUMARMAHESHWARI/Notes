
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface NoteFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
}

const NoteForm = ({ onSubmit }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(title, content);
      setTitle('');
      setContent('');
      toast.success('Note created successfully', {
        icon: '✨',
        position: 'top-center',
        className: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white',
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note', {
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-none bg-white/60 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 pb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <span>Create New Note</span>
            <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Input
              placeholder="Give your note a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-purple-200 focus-visible:ring-violet-500 placeholder:text-purple-300"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Write your thoughts, ideas, or whatever's on your mind..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[180px] resize-none border-purple-200 focus-visible:ring-violet-500 placeholder:text-purple-300"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold py-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-[1px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Create Note</span>
                <Sparkles className="h-4 w-4 ml-2" />
              </div>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NoteForm;
