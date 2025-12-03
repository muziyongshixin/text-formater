import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    try {
      // Ensure the ad hasn't already been pushed to avoid duplicates in React strict mode or re-renders
      if (adRef.current && adRef.current.innerHTML === '') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={{ minHeight: '90px', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      {/* Fallback/Development placeholder if script is blocked or not loaded */}
      <div className="text-[10px] text-slate-700 text-center py-1 select-none pointer-events-none">
        Advertisement
      </div>
    </div>
  );
};

export default AdUnit;