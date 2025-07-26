'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import NoteList from '@/components/note-list';
import Editor from '@/components/editor';
import Welcome from '@/components/welcome';
import ToolsView from '@/components/tools-view';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/lib/types';
import { FileText, Wrench, Music, Settings } from 'lucide-react';

type ActiveView = 'notes' | 'tools' | 'suno' | 'settings';

export default function LinguaScribeApp() {
  const { toast } = useToast();
  const [notes, setNotes] = useLocalStorage<Note[]>('lingua-scribe-notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useLocalStorage<number>('lingua-scribe-font-size', 16);
  const [activeView, setActiveView] = useState<ActiveView>('notes');

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '',
      createdAt: Date.now(),
    };
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setActiveNoteId(newNote.id);
    setActiveView('notes');
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    setActiveView('notes');
  };

  const handleUpdateNote = (id: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === id ? { ...note, content } : note))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => {
      const remainingNotes = prevNotes.filter(note => note.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
      return remainingNotes;
    });
    toast({ title: 'Note deleted', description: 'The note has been successfully deleted.' });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!', description: 'The note content has been copied.' });
  };

  const activeNote = notes.find(note => note.id === activeNoteId) || null;

  const renderActiveView = () => {
    switch (activeView) {
      case 'notes':
        return activeNote ? (
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
        );
      case 'tools':
        return <ToolsView />;
      case 'suno':
        return <div className="p-4">Suno Editor coming soon...</div>;
      case 'settings':
        return <div className="p-4">Settings coming soon...</div>;
      default:
        return <Welcome onNewNote={handleNewNote} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={activeView === 'notes'}>
      <div className="flex h-screen bg-background">
        <nav className="flex flex-col items-center gap-4 border-r bg-card p-2">
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setActiveView('notes')}
                    isActive={activeView === 'notes'}
                    tooltip="Editor"
                    className="h-10 w-10"
                >
                    <FileText />
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setActiveView('tools')}
                    isActive={activeView === 'tools'}
                    tooltip="Text Tools"
                    className="h-10 w-10"
                >
                    <Wrench />
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={() => setActiveView('suno')}
                    isActive={activeView === 'suno'}
                    tooltip="Suno Editor"
                    className="h-10 w-10"
                >
                    <Music />
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
           <div className="flex-grow" />
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={() => setActiveView('settings')}
                        isActive={activeView === 'settings'}
                        tooltip="Settings"
                        className="h-10 w-10"
                    >
                        <Settings />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </nav>
        <Sidebar>
            {activeView === 'notes' && (
                <NoteList
                    notes={notes}
                    activeNoteId={activeNoteId}
                    onSelectNote={handleSelectNote}
                    onNewNote={handleNewNote}
                    onDeleteNote={handleDeleteNote}
                />
            )}
        </Sidebar>
        <SidebarInset>
            {renderActiveView()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
