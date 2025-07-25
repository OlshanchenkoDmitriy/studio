'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Toolbar from '@/components/toolbar';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/lib/types';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onCopy: (content: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export default function Editor({
  note,
  onUpdateNote,
  onDeleteNote,
  onCopy,
  fontSize,
  setFontSize,
}: EditorProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSpeechResult = useCallback((transcript: string) => {
    setContent(prevContent => {
      const newContent = prevContent ? `${prevContent} ${transcript}`.trim() : transcript;
      onUpdateNote(note.id, newContent);
      return newContent;
    });
  }, [note.id, onUpdateNote]);

  const onSpeechError = useCallback((error: string) => {
    toast({
      variant: 'destructive',
      title: 'Speech Recognition Error',
      description: error,
    });
  }, [toast]);

  const { isRecording, startRecording, stopRecording } = useSpeechRecognition({
    onResult: onSpeechResult,
    onError: onSpeechError,
  });

  useEffect(() => {
    setContent(note.content);
  }, [note.content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdateNote(note.id, e.target.value);
  };
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);


  return (
    <div className="flex flex-col h-full">
      <Toolbar
        isRecording={isRecording}
        onRecordToggle={isRecording ? stopRecording : startRecording}
        onDelete={() => onDeleteNote(note.id)}
        onCopy={() => onCopy(content)}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <div className="flex-grow p-4 pt-0">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing or use the microphone to dictate..."
          className="w-full h-full resize-none border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base leading-relaxed"
          style={{ fontSize: `${fontSize}px` }}
        />
      </div>
    </div>
  );
}
