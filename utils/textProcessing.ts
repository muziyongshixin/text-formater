import { DataType, ParseResult } from '../types';

/**
 * Decodes ASCII/Unicode escape sequences (e.g., \u4f60\u597d or \n)
 * into readable characters.
 */
export const decodeEscapedString = (str: string): string => {
  try {
    // Basic unescape for standard JSON-like escapes including unicode
    // We wrap in quotes and JSON.parse to leverage the JS engine's own unescaping
    // However, if it's already a valid string representation without quotes, we might need to be careful.
    
    // Fallback: If JSON.parse fails (e.g. invalid json but has unicode), use regex
    const unescaped = str.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    }).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
    
    return unescaped;
  } catch (e) {
    return str;
  }
};

/**
 * Formats HTML string with basic indentation
 */
export const formatHtml = (html: string): string => {
  const tab = '  ';
  let result = '';
  let indent = '';

  // Remove whitespace between tags
  const input = html.replace(/>\s+</g, '><').trim();

  // Split by tags
  const tokens = input.split(/(<[^>]+>)/g).filter(Boolean);

  tokens.forEach(token => {
      if (token.match(/^<\//)) {
          // Closing tag
          indent = indent.substring(tab.length);
          result += indent + token + '\n';
      } else if (token.match(/^<[a-zA-Z][^>]*\/>/) || token.match(/^<(img|br|hr|input|meta|link|base|area|col|embed|param|source|track|wbr|!doctype)/i)) {
          // Self-closing or void tag
          result += indent + token + '\n';
      } else if (token.match(/^<[a-zA-Z][^>]*>/)) {
          // Opening tag
          result += indent + token + '\n';
          indent += tab;
      } else {
          // Content
          result += indent + token + '\n';
      }
  });

  return result.trim();
};

/**
 * Detects the format of the input text and prepares it for rendering.
 */
export const detectAndParse = (input: string): ParseResult => {
  if (!input || input.trim().length === 0) {
    return { type: DataType.TEXT, content: '' };
  }

  const trimmed = input.trim();

  // 1. Check for JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(input);
      return { type: DataType.JSON, content: parsed };
    } catch (e) {
      // Not valid JSON, continue
    }
  }

  // 2. Check for HTML
  // Simple heuristic: starts with < and has a tag-like structure
  if (/^\s*<(!doctype|html|head|body|div|span|p|a|script|style|table|form|img|ul|ol)/i.test(trimmed) || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
    return { type: DataType.HTML, content: trimmed, formattedText: formatHtml(trimmed) };
  }

  // 3. Check for ASCII/Unicode escapes that need decoding
  // Pattern: \uXXXX or literal \n that hasn't been parsed
  if (/\\u[0-9a-fA-F]{4}/.test(input) || input.includes('\\n')) {
     const decoded = decodeEscapedString(input);
     // After decoding, it might be JSON (e.g. a stringified JSON string)
     try {
       const possibleJson = JSON.parse(decoded);
       if (typeof possibleJson === 'object' && possibleJson !== null) {
          return { type: DataType.JSON, content: possibleJson };
       }
     } catch (e) {
        // Not JSON, but we decoded it. Let's see if it looks like Markdown now.
        if (isMarkdown(decoded)) {
             return { type: DataType.MARKDOWN, content: decoded };
        }
        return { type: DataType.ASCII_UNICODE, content: input, formattedText: decoded };
     }
  }

  // 4. Check for Markdown
  // Heuristics: # Headers, **bold**, tables |, lists -, [links]
  if (isMarkdown(input)) {
    return { type: DataType.MARKDOWN, content: input };
  }

  // 5. Default to Text (preserving newlines)
  return { type: DataType.TEXT, content: input };
};

const isMarkdown = (text: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m,         // Headers
    /\*\*.+\*\*/,         // Bold
    /\[.+\]\(.+\)/,       // Links
    /^\s*[-*+]\s/m,       // Lists
    /\|.*\|.*\|/,         // Tables
    /`{3}/                // Code blocks
  ];
  return markdownPatterns.some(p => p.test(text));
};

export const prettifyJson = (json: object): string => {
  return JSON.stringify(json, null, 2);
};

/**
 * Prettifies JSON but replaces escaped newlines (\n) within strings
 * to actual line breaks for better human readability.
 */
export const prettifyJsonReadable = (json: object): string => {
  try {
    const jsonStr = JSON.stringify(json, null, 2);
    // Replace literal \n sequence with actual newline character
    // We rely on the fact that JSON.stringify escapes control chars.
    return jsonStr.replace(/\\n/g, '\n');
  } catch (e) {
    return JSON.stringify(json, null, 2);
  }
};