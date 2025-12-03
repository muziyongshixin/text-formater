import React from 'react';
import { Clipboard, Trash2, FileText } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ value, onChange, onClear }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-blue-400">
          <FileText size={18} />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Input Source</h2>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
            title="Clear"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            <Clipboard size={14} />
            <span>Paste</span>
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-slate-600"
          placeholder="Paste your raw JSON, Markdown, escaped text, or logs here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="px-4 py-2 border-t border-slate-800 text-xs text-slate-500 bg-slate-950">
        {value.length} characters
      </div>
    </div>
  );
};

export default InputSection;
