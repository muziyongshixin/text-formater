import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { detectAndParse } from './utils/textProcessing';
import { ParseResult, DataType } from './types';
import { LayoutGrid } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult>({ 
    type: DataType.TEXT, 
    content: '' 
  });

  // Debounce detection to avoid lagging on huge text inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = detectAndParse(inputText);
      setParseResult(result);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center px-6 border-b border-slate-800 bg-slate-950 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">DataVisor</h1>
            <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wider -mt-1">
              Universal Formatter
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="hidden md:inline">Formats: JSON · Markdown · ASCII · Log</span>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel (Input) */}
        <div className="flex-1 h-1/2 md:h-full md:w-1/2 min-w-0">
          <InputSection 
            value={inputText} 
            onChange={setInputText} 
            onClear={handleClear} 
          />
        </div>

        {/* Right Panel (Output) */}
        <div className="flex-1 h-1/2 md:h-full md:w-1/2 min-w-0 bg-slate-900/30">
          <OutputSection 
            parseResult={parseResult} 
            originalText={inputText}
          />
        </div>
      </main>
    </div>
  );
}

export default App;