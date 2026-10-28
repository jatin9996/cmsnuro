import Image from "next/image";

export function LogoMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-2xl bg-[#163a78] ${className}`}>
      <Image src="/media/neurokalp-logo.jpg" alt="NEUROKALP" fill sizes="160px" className="object-cover object-center" />
    </span>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.7.7-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.8 4.8 0 0 0 1 2.6 11 11 0 0 0 4.2 3.7c.6.2 1 .4 1.4.5a3.4 3.4 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.1-.4-.2z" />
    </svg>
  );
}
