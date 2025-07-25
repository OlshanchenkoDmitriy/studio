'use client';

import { Button } from '@/components/ui/button';
import { NotebookPen } from 'lucide-react';

interface WelcomeProps {
  onNewNote: () => void;
}

export default function Welcome({ onNewNote }: WelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <NotebookPen className="w-24 h-24 text-primary mb-6" strokeWidth={1} />
      <h2 className="text-3xl font-bold font-headline mb-2">Welcome to LinguaScribe</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your personal notebook with the power of speech. Create, edit, and manage your notes with ease.
      </p>
      <Button onClick={onNewNote}>Create Your First Note</Button>
    </div>
  );
}
