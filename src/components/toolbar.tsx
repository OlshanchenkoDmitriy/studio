'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Copy, Trash2, ZoomIn, ZoomOut, Undo, Redo, FileX } from 'lucide-react';

interface ToolbarProps {
  isRecording: boolean;
  onRecordToggle: () => void;
  onDelete: () => void;
  onCopy: () => void;
  fontSize: number;
  setFontSize: (size: number | ((s:number) => number)) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  isRecording,
  onRecordToggle,
  onDelete,
  onCopy,
  fontSize,
  setFontSize,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRecordToggle}
        className={isRecording ? 'text-destructive animate-pulse-record' : 'text-primary'}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <MicOff /> : <Mic />}
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
        <Undo />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} aria-label="Redo">
        <Redo />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="icon" onClick={onCopy} aria-label="Copy note">
        <Copy />
      </Button>
       <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear note">
        <FileX />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} className="hover:text-destructive" aria-label="Delete note">
        <Trash2 />
      </Button>

      <div className="flex-grow" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.max(10, s - 1))} aria-label="Decrease font size">
          <ZoomOut />
        </Button>
        <span className="text-sm text-muted-foreground w-6 text-center">{fontSize}</span>
        <Button variant="ghost" size="icon" onClick={() => setFontSize(s => Math.min(32, s + 1))} aria-label="Increase font size">
          <ZoomIn />
        </Button>
      </div>
    </div>
  );
}
