import Image from "next/image";

type Props = {
  /** Tailwind height class; width follows aspect ratio */
  className?: string;
  priority?: boolean;
};

export function ErpBrandLogo({ className = "h-10 w-auto", priority }: Props) {
  return (
    <Image
      src="/sueeplogo.png"
      alt="Sueep"
      width={180}
      height={60}
      className={className}
      priority={priority}
    />
  );
}
