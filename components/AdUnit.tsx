import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  client: string;      // ca-pub-XXXXXXXXXXXXXXXX
  slot: string;        // The specific ad unit ID from AdSense dashboard
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  client, 
  slot, 
  format = 'auto', 
  responsive = true,
  style = {},
  className = ''
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [adError, setAdError] = useState(false);

  // Check if we are using the placeholder ID
  const isPlaceholder = client === "ca-pub-0000000000000000";

  useEffect(() => {
    // If it's a placeholder ID, do not try to load ads to avoid 400 errors
    if (isPlaceholder) {
      return;
    }

    try {
      // Safety check: ensure window object exists (SSR) and adsbygoogle array is initialized
      if (typeof window !== 'undefined') {
         // Initialize adsbygoogle if it doesn't exist yet (though index.html script should handle this)
         window.adsbygoogle = window.adsbygoogle || [];

         // Ensure the ad hasn't already been pushed to avoid duplicates in React strict mode or re-renders
         if (adRef.current && adRef.current.innerHTML === '') {
            window.adsbygoogle.push({});
         }
      }
    } catch (e) {
      // Catch any synchronous errors during push
      console.error('AdSense push error:', e);
      setAdError(true);
    }
  }, [client, slot, isPlaceholder]);

  // If using placeholder ID, show a preview box for development
  if (isPlaceholder) {
    return (
      <div 
        className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-700 text-slate-500 p-4 ${className}`}
        style={{ minHeight: '90px', ...style }}
      >
        <p className="text-xs font-mono font-bold">Google AdSense Placeholder</p>
        <p className="text-[10px] mt-1 text-center">
          Replace <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">ca-pub-0000...</code> with your real ID to activate ads.
        </p>
      </div>
    );
  }

  if (adError) {
    return null; // Hide completely on error
  }

  return (
    <div className={`ad-container w-full flex justify-center ${className}`} style={{ minHeight: '90px', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdUnit;