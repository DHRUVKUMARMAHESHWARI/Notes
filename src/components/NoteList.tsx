
import React from 'react';
import NoteCard from './NoteCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NoteListProps {
  notes: Note[];
  onNoteSelect?: (note: Note) => void;
}

const NoteList = ({ notes, onNoteSelect }: NoteListProps) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-100">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-full mb-4">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <p className="text-purple-600 text-center font-medium">No notes yet. Create your first note to get started!</p>
        <p className="text-purple-400 text-sm mt-2">Let your creativity flow ✨</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid grid-cols-1 gap-4 animate-fade-in">
        {notes.map((note, index) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            created_at={note.created_at}
            onClick={() => onNoteSelect && onNoteSelect(note)}
            className="animate-slide-in backdrop-blur-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NoteList;
