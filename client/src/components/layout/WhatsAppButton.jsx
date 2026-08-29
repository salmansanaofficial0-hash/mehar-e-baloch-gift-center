import { MessageCircle } from 'lucide-react';
import { brand } from '../../config/brand';

function WhatsAppButton() {
  return (
    <a
      href={brand.primaryWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  );
}

export default WhatsAppButton;
