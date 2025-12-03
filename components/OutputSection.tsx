import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Braces, FileType, AlignLeft, AlertCircle, WrapText, Code } from 'lucide-react';
import { DataType, ParseResult } from '../types';
import { prettifyJsonReadable } from '../utils/textProcessing';

interface OutputSectionProps {
  parseResult: ParseResult;
  originalText: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({ parseResult, originalText }) => {
  const [activeTab, setActiveTab] = useState<DataType>(parseResult.type);
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);

  // Auto-switch tab when detection changes
  useEffect(() => {
    setActiveTab(parseResult.type);
  }, [parseResult.type]);

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTab === DataType.JSON && typeof parseResult.content === 'object') {
      // When copying, we usually want valid JSON, so we use standard stringify
      textToCopy = JSON.stringify(parseResult.content, null, 2);
    } else if (activeTab === DataType.ASCII_UNICODE && parseResult.formattedText) {
      textToCopy = parseResult.formattedText;
    } else if (activeTab === DataType.HTML && parseResult.formattedText) {
      textToCopy = parseResult.formattedText;
    } else if (typeof parseResult.content === 'string') {
      textToCopy = parseResult.content;
    } else if (typeof parseResult.content === 'object') {
       textToCopy = JSON.stringify(parseResult.content);
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (!originalText) {
      return (
        <div className="flex items-center justify-center h-full text-slate-600">
          <p>Waiting for input...</p>
        </div>
      );
    }

    const wrapClass = isWrapped ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto";

    // JSON View
    if (activeTab === DataType.JSON) {
      const jsonContent = typeof parseResult.content === 'object' 
        ? parseResult.content 
        : { error: 'Not valid JSON' };
      
      // Use the readable version that unescapes \n
      const displayString = prettifyJsonReadable(jsonContent);

      return (
        <div className={`p-4 font-mono text-sm h-full text-slate-300 ${wrapClass}`}>
          <div className="text-emerald-400">
            {displayString}
          </div>
        </div>
      );
    }

    // Markdown View
    if (activeTab === DataType.MARKDOWN) {
      const content = typeof parseResult.content === 'string' ? parseResult.content : '';
      return (
        <div className="p-6 h-full overflow-auto">
          <div className="markdown-body text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      );
    }

    // HTML View
    if (activeTab === DataType.HTML) {
      const contentToRender = parseResult.formattedText || (typeof parseResult.content === 'string' ? parseResult.content : JSON.stringify(parseResult.content));
      return (
        <div className={`p-4 font-mono text-sm text-blue-300 h-full ${wrapClass}`}>
          {contentToRender}
        </div>
      );
    }

    // ASCII/Unicode Decoded View
    if (activeTab === DataType.ASCII_UNICODE) {
       return (
        <div className={`p-4 font-mono text-sm text-slate-200 h-full ${wrapClass}`}>
          {parseResult.formattedText}
        </div>
       )
    }

    // Default Text View
    return (
      <div className={`p-4 font-mono text-sm text-slate-300 leading-relaxed h-full ${wrapClass}`}>
        {typeof parseResult.content === 'string' 
          ? parseResult.content 
          : JSON.stringify(parseResult.content, null, 2)}
      </div>
    );
  };

  const TabButton = ({ id, label, icon: Icon }: { id: DataType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <TabButton id={DataType.JSON} label="JSON" icon={Braces} />
          <TabButton id={DataType.MARKDOWN} label="Markdown" icon={FileType} />
          <TabButton id={DataType.HTML} label="HTML" icon={Code} />
          <TabButton id={DataType.ASCII_UNICODE} label="Decoded" icon={AlignLeft} />
          <TabButton id={DataType.TEXT} label="Raw" icon={AlignLeft} />
        </div>
        <div className="flex items-center pl-4 gap-3 border-l border-slate-700 ml-2">
           <button 
             onClick={() => setIsWrapped(!isWrapped)}
             className={`flex items-center gap-1.5 text-xs font-medium transition-colors p-1.5 rounded ${isWrapped ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
             title="Toggle Text Wrapping"
           >
             <WrapText size={16} />
             <span className="hidden sm:inline">{isWrapped ? 'Wrap On' : 'Wrap Off'}</span>
           </button>
           <button 
             onClick={handleCopy}
             className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
           >
             {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
             <span className={copied ? "text-emerald-400" : ""}>{copied ? 'Copied' : 'Copy'}</span>
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        {parseResult.type === DataType.UNKNOWN && originalText.length > 0 && (
          <div className="absolute top-0 w-full bg-yellow-900/20 text-yellow-500 px-4 py-2 text-xs flex items-center gap-2 border-b border-yellow-900/30 z-10">
            <AlertCircle size={12} />
            Unknown format detected. Showing raw text.
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputSection;