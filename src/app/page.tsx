'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import NoteList from '@/components/note-list';
import Editor from '@/components/editor';
import Welcome from '@/components/welcome';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/lib/types';

export default function LinguaScribeApp() {
  const { toast } = useToast();
  const [notes, setNotes] = useLocalStorage<Note[]>('lingua-scribe-notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useLocalStorage<number>('lingua-scribe-font-size', 16);

  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
    if (activeNoteId && !notes.find(n => n.id === activeNoteId)) {
      setActiveNoteId(notes.length > 0 ? notes[0].id : null);
    }
  }, [notes, activeNoteId]);

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '',
      createdAt: Date.now(),
    };
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setActiveNoteId(newNote.id);
  }, [notes, setNotes]);

  const handleSelectNote = useCallback((id: string) => {
    setActiveNoteId(id);
  }, []);

  const handleUpdateNote = useCallback((id: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === id ? { ...note, content } : note))
    );
  }, [setNotes]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prevNotes => {
      const remainingNotes = prevNotes.filter(note => note.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
      return remainingNotes;
    });
    toast({ title: "Note deleted", description: "The note has been successfully deleted." });
  }, [activeNoteId, setNotes, toast]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "The note content has been copied." });
  }, [toast]);


  const activeNote = useMemo(() => {
    return notes.find(note => note.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  return (
    <SidebarProvider>
      <Sidebar>
        <NoteList
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onDeleteNote={handleDeleteNote}
        />
      </Sidebar>
      <SidebarInset>
        {activeNote ? (
          <Editor
            key={activeNote.id}
            note={activeNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onCopy={handleCopy}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        ) : (
          <Welcome onNewNote={handleNewNote} />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
