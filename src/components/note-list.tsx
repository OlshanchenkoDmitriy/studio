'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Notebook } from 'lucide-react';
import type { Note } from '@/lib/types';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id:string) => void;
}

function getNoteTitle(content: string) {
  if (!content) return 'New Note';
  const firstLine = content.split('\n')[0];
  return firstLine.substring(0, 50) || 'New Note';
}

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
}: NoteListProps) {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            <Notebook className="text-primary" />
            <h1 className="text-xl font-bold font-headline">LinguaScribe</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onNewNote} className="h-8 w-8">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {notes.map(note => (
            <SidebarMenuItem key={note.id}>
              <SidebarMenuButton
                onClick={() => onSelectNote(note.id)}
                isActive={note.id === activeNoteId}
                tooltip={getNoteTitle(note.content)}
              >
                <span className="truncate">{getNoteTitle(note.content)}</span>
              </SidebarMenuButton>
              <SidebarMenuAction
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                showOnHover
              >
                <Trash2 />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
