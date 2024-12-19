import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RatingDisplay({ rating, showValue = true, size = "md" }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'fill-primary text-primary'
              : 'text-muted-foreground'
          }`}
        />
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating})
        </span>
      )}
    </div>
  );
} 