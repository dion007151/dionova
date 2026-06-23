export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getDiscountPercentage(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "DN-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    PROCESSING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    SHIPPED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getImageUrl(src: string): string {
  if (!src) return "/placeholder.svg";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/uploads/${src}`;
}

export function parseProductImages(imagesField: string | string[] | null | undefined): string[] {
  if (!imagesField) return [];
  if (Array.isArray(imagesField)) return imagesField;
  
  if (typeof imagesField === "string") {
    const trimmed = imagesField.trim();
    if (!trimmed) return [];
    
    // If it's a raw URL or path and not a JSON string, return it directly
    if (!trimmed.startsWith("[") && !trimmed.startsWith("{") && !trimmed.startsWith("\"")) {
      return [trimmed];
    }
    
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((img: any) => typeof img === "string" ? img : String(img));
      }
      if (typeof parsed === "string") {
        // Handle double serialization
        return parseProductImages(parsed);
      }
      return [trimmed];
    } catch {
      return [trimmed];
    }
  }
  
  return [];
}

