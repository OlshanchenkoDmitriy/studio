'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Clipboard, ClipboardPaste, Trash2, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const specialCharacters = [
  '-', '~', ',', '>', '{', '}', '|', '\\',
  '^', '=', '/', ':', ';', '.', '(', ')',
  '[', ']', '"', "'", '`', '!', '?', '@',
  '#', '$', '%', '&', '*', '_', '+'
];

export default function ToolsView() {
  const { toast } = useToast();
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const text = history[historyIndex] ?? '';

  const [charToFind, setCharToFind] = useState('');
  const [charToReplace, setCharToReplace] = useState('');

  const updateText = useCallback((newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleRemoveChar = (charToRemove: string) => {
    // Escape special regex characters
    const escapedChar = charToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedChar, 'g');
    updateText(text.replace(regex, ''));
  };

  const handleReplace = () => {
    if (!charToFind) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Please specify a character to find.',
      });
      return;
    }
    const regex = new RegExp(charToFind, 'g');
    updateText(text.replace(regex, charToReplace));
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      updateText(clipboardText);
      toast({ title: 'Text pasted from clipboard.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to paste text.' });
    }
  };
  
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: 'Text copied to clipboard.' });
  };
  
  const handleClear = () => {
    updateText('');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;


  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-2 border-b pb-2">
              <Button variant="ghost" size="icon" onClick={handlePaste} aria-label="Paste text"><ClipboardPaste /></Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy text"><Clipboard /></Button>
              <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Clear text"><Trash2 /></Button>
              <div className="flex-grow" />
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} aria-label="Undo"><Undo /></Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} aria-label="Redo"><Redo /></Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => updateText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="min-h-[200px] text-base"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Find and Replace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="find-char">Find</Label>
                <Input
                  id="find-char"
                  value={charToFind}
                  onChange={(e) => setCharToFind(e.target.value)}
                  placeholder="Enter char(s) to find"
                />
              </div>
              <ArrowRight className="hidden sm:block shrink-0 mb-2" />
               <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="replace-char">Replace with</Label>
                <Input
                  id="replace-char"
                  value={charToReplace}
                  onChange={(e) => setCharToReplace(e.target.value)}
                  placeholder="Enter replacement char(s)"
                />
              </div>
              <Button onClick={handleReplace} className="w-full sm:w-auto">Replace All</Button>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Remove Specific Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {specialCharacters.map((char) => (
                <Button
                  key={char}
                  variant="outline"
                  className="text-lg font-mono aspect-square h-14 w-14"
                  onClick={() => handleRemoveChar(char)}
                  aria-label={`Remove ${char}`}
                >
                  {char}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
