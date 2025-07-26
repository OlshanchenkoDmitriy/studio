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
  const [history, setHistory] = useState<string[]>([note.content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const content = history[historyIndex] ?? '';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateContent = useCallback((newContent: string, fromSpeech = false) => {
    setHistory(prevHistory => {
      let updatedContent = newContent;
      if (fromSpeech) {
          const currentContent = prevHistory[prevHistory.length - 1] ?? '';
          updatedContent = currentContent ? `${currentContent} ${newContent}`.trim() : newContent;
      }

      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(updatedContent);
      onUpdateNote(note.id, updatedContent);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex, note.id, onUpdateNote]);


  const onSpeechResult = useCallback((transcript: string) => {
    if (textareaRef.current) {
        const currentContent = textareaRef.current.value;
        const newContent = currentContent ? `${currentContent} ${transcript}`.trim() : transcript;
        updateContent(newContent);
    }
  }, [updateContent]);

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
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(e.target.value);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onUpdateNote(note.id, history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onUpdateNote(note.id, history[newIndex]);
    }
  };
  
  const handleClear = () => {
    updateContent('');
  };

  useEffect(() => {
    setHistory([note.content]);
    setHistoryIndex(0);
  }, [note.id, note.content]);

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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
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
