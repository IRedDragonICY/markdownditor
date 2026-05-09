import React, { useState, useEffect, useMemo } from 'react';
import { useMarkdownStore } from '../../store/useMarkdownStore';
import { Search, X, Copy } from 'lucide-react';

interface GitHubEmoji {
  name: string;
  url: string;
  markdown: string;
}

export const EmojiPickerModal: React.FC = () => {
  const { showEmojiPicker, setShowEmojiPicker, insertTextAtCursor } = useMarkdownStore();
  const [emojis, setEmojis] = useState<GitHubEmoji[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<GitHubEmoji | null>(null);

  useEffect(() => {
    if (showEmojiPicker && emojis.length === 0) {
      setLoading(true);
      fetch('https://api.github.com/emojis')
        .then(res => res.json())
        .then(data => {
          const emojiList = Object.entries(data).map(([name, url]) => ({
            name,
            url: url as string,
            markdown: `:${name}:`
          }));
          setEmojis(emojiList);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch github emojis', err);
          setLoading(false);
        });
    }
  }, [showEmojiPicker, emojis.length]);

  const filteredEmojis = useMemo(() => {
    if (!search) return emojis;
    const lowerSearch = search.toLowerCase();
    return emojis.filter(e => e.name.toLowerCase().includes(lowerSearch));
  }, [emojis, search]);

  const handleInsert = (emoji: GitHubEmoji) => {
    insertTextAtCursor({ prefix: emoji.markdown, suffix: '', replace: true });
    setShowEmojiPicker(false);
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  if (!showEmojiPicker) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4" onClick={() => setShowEmojiPicker(false)}>
      <div 
        className="bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden text-sm" 
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[var(--color-border)] font-semibold flex items-center justify-between text-center bg-[var(--color-bg-header)]">
          <div className="flex bg-[var(--color-bg-header)] text-center text-md justify-center flex-1">
             GitHub Emojis
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 overflow-hidden h-full">
          <div className="mb-4 text-[var(--color-text-muted)]">Search</div>
          <div className="relative mb-4">
            <input 
              type="text"
              placeholder="Search emojis"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--color-bg-editor)] border border-[var(--color-border)] rounded-md py-2 px-3 text-[var(--color-text-main)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-[var(--color-bg-main)]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">Loading emojis...</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-1">
                  {filteredEmojis.map(emoji => (
                    <div 
                      key={emoji.name}
                      onClick={() => setSelectedEmoji(emoji)}
                      onDoubleClick={() => handleInsert(emoji)}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedEmoji?.name === emoji.name ? 'border-gray-400 bg-[var(--color-bg-hover)]' : 'border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]'}`}
                    >
                      <div className="h-10 w-10 mb-2 flex items-center justify-center">
                        <img src={emoji.url} alt={emoji.name} loading="lazy" className="max-h-8 max-w-8 object-contain" />
                      </div>
                      <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs truncate max-w-full">
                        <span className="truncate" title={emoji.markdown}>{emoji.markdown}</span>
                        <button 
                          onClick={(e) => handleCopy(e, emoji.markdown)}
                          className="hover:text-[var(--color-text-main)] shrink-0"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredEmojis.length === 0 && search && (
                    <div className="col-span-full py-8 text-center text-[var(--color-text-muted)]">
                      No emojis found matching "{search}"
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-header)] flex items-center justify-end gap-2 shrink-0">
            <button 
              onClick={() => setShowEmojiPicker(false)} 
              className="px-4 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-main)] rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => selectedEmoji && handleInsert(selectedEmoji)} 
              disabled={!selectedEmoji}
              className={`px-4 py-1.5 rounded transition-colors ${selectedEmoji ? 'bg-[var(--color-border)] hover:bg-gray-600' : 'bg-transparent border border-[var(--color-border)] opacity-50 cursor-not-allowed'}`}
            >
              Insert
            </button>
        </div>
      </div>
    </div>
  );
};
