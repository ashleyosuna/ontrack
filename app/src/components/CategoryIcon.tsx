import {
  Home,
  Heart,
  DollarSign,
  Smartphone,
  Shield,
  Plane,
  Car,
  FileText,
  Star,
  CheckCircle,
  Circle,
  Calendar,
  ShoppingBag,
  Briefcase,
  Book,
  Dumbbell,
  Music,
  Camera,
  Coffee,
  Gift,
  Lightbulb,
  Users,
  Wrench,
  Package,
} from "lucide-react";

interface CategoryIconProps {
  iconName: string;
  size?: number;
  className?: string;
  color?: string;
  textColor?: string;
}

// Function to get the correct icon component
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Home":
      return Home;
    case "Heart":
      return Heart;
    case "DollarSign":
      return DollarSign;
    case "Smartphone":
      return Smartphone;
    case "Shield":
      return Shield;
    case "Plane":
      return Plane;
    case "Car":
      return Car;
    case "FileText":
      return FileText;
    case "Star":
      return Star;
    case "CheckCircle":
      return CheckCircle;
    case "Circle":
      return Circle;
    case "Calendar":
      return Calendar;
    case "ShoppingBag":
      return ShoppingBag;
    case "Briefcase":
      return Briefcase;
    case "Book":
      return Book;
    case "Dumbbell":
      return Dumbbell;
    case "Music":
      return Music;
    case "Camera":
      return Camera;
    case "Coffee":
      return Coffee;
    case "Gift":
      return Gift;
    case "Lightbulb":
      return Lightbulb;
    case "Users":
      return Users;
    case "Wrench":
      return Wrench;
    case "Package":
      return Package;
    default:
      return Star;
  }
}

export function CategoryIcon({
  iconName,
  size = 24,
  className = "",
  color,
  textColor = "#FFFFFF",
}: CategoryIconProps) {
  // Get the icon component using switch statement
  const Icon = getIconComponent(iconName);

  // Calculate wrapper size based on icon size
  const wrapperSize = size * 1.8;
  const iconSize = size * 1.2; // Increased from 0.8 to 1.2 (1.5x bigger)

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{
        backgroundColor: color || "#3B82F6",
        width: `${wrapperSize}px`,
        height: `${wrapperSize}px`,
      }}
    >
      <Icon
        size={iconSize}
        strokeWidth={2}
        style={{
          color: textColor,
        }}
        fill="none"
        aria-hidden="true"
      />
    </div>
  );
}
