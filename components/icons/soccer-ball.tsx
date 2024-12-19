export function SoccerBall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 8.66 5" />
      <path d="M12 2a10 10 0 0 0-8.66 5" />
      <path d="M12 22V2" />
      <path d="M12 22a10 10 0 0 0 8.66-5" />
      <path d="M12 22a10 10 0 0 1-8.66-5" />
      <path d="M2 12h20" />
    </svg>
  );
} 