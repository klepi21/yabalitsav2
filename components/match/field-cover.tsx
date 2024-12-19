export function FieldCover({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-48 bg-gradient-to-b from-primary/20 to-background overflow-hidden ${className}`}>
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.15]"
        viewBox="0 0 800 400" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Field outline */}
        <rect x="20" y="20" width="760" height="360" stroke="currentColor" fill="none" strokeWidth="2"/>
        
        {/* Center circle */}
        <circle cx="400" cy="200" r="70" stroke="currentColor" fill="none" strokeWidth="2"/>
        
        {/* Center line */}
        <line x1="400" y1="20" x2="400" y2="380" stroke="currentColor" strokeWidth="2"/>
        
        {/* Left penalty area */}
        <rect x="20" y="120" width="100" height="160" stroke="currentColor" fill="none" strokeWidth="2"/>
        <rect x="20" y="160" width="50" height="80" stroke="currentColor" fill="none" strokeWidth="2"/>
        <circle cx="120" cy="200" r="2" fill="currentColor"/>
        
        {/* Right penalty area */}
        <rect x="680" y="120" width="100" height="160" stroke="currentColor" fill="none" strokeWidth="2"/>
        <rect x="730" y="160" width="50" height="80" stroke="currentColor" fill="none" strokeWidth="2"/>
        <circle cx="680" cy="200" r="2" fill="currentColor"/>
        
        {/* Corner arcs */}
        <path d="M20,40 A20,20 0 0,1 40,20" stroke="currentColor" fill="none" strokeWidth="2"/>
        <path d="M760,40 A20,20 0 0,0 780,20" stroke="currentColor" fill="none" strokeWidth="2"/>
        <path d="M20,360 A20,20 0 0,0 40,380" stroke="currentColor" fill="none" strokeWidth="2"/>
        <path d="M760,360 A20,20 0 0,1 780,380" stroke="currentColor" fill="none" strokeWidth="2"/>
      </svg>
    </div>
  );
} 