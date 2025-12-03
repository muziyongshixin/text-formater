import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { detectAndParse } from './utils/textProcessing';
import { ParseResult, DataType } from './types';
import { LayoutGrid, HelpCircle, X, ExternalLink } from 'lucide-react';
import AdUnit from './components/AdUnit';

function App() {
  const [inputText, setInputText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult>({ 
    type: DataType.TEXT, 
    content: '' 
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // YOUR ADSENSE ID (Replace this with your actual ID: ca-pub-XXXXXXXXXXXXXXXX)
  const AD_CLIENT_ID = "ca-pub-0000000000000000"; 
  
  // YOUR AD SLOT IDs (Create these in AdSense dashboard and replace)
  const FOOTER_AD_SLOT = "0987654321";

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

  const HelpModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LayoutGrid size={20} className="text-blue-500" />
            How to use DataVisor
          </h2>
          <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4 text-slate-300 text-sm">
          <p>
            DataVisor detects and formats unstructured text into readable layouts instantly.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
              <div>
                <p className="font-semibold text-slate-200">Paste your content</p>
                <p className="text-xs text-slate-400 mt-1">Copy text from logs, API responses, or documents into the left Input Source panel.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
              <div>
                <p className="font-semibold text-slate-200">Auto-detection</p>
                <p className="text-xs text-slate-400 mt-1">The tool automatically identifies JSON, HTML, Markdown, or Unicode escapes.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
              <div>
                <p className="font-semibold text-slate-200">View & Export</p>
                <p className="text-xs text-slate-400 mt-1">Switch tabs to view different formats, toggle word wrap, and copy the result with one click.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
            <p>Supported formats: JSON (with newline support), Markdown, HTML, ASCII/Unicode Escapes, Raw Text.</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-950 flex justify-end">
          <button 
            onClick={() => setIsHelpOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden relative">
      {isHelpOpen && <HelpModal />}
      
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
        
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden md:inline text-xs font-medium text-slate-500">
            Formats: JSON · Markdown · HTML · ASCII
          </span>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            <HelpCircle size={14} />
            <span>How to use</span>
          </button>
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

      {/* Footer Ad Placeholder */}
      <div className="min-h-[100px] border-t border-slate-800 bg-slate-950 shrink-0 flex flex-col items-center justify-center p-4">
         <span className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">Sponsored</span>
         {/* Footer Ad Unit */}
         <div className="w-full flex justify-center overflow-hidden">
            <AdUnit 
              client={AD_CLIENT_ID} 
              slot={FOOTER_AD_SLOT} 
              className="bg-slate-900/20 rounded-md"
            />
         </div>
      </div>
    </div>
  );
}

export default App;