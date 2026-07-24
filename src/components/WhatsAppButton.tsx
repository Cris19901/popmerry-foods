'use client';

import { waLink } from '@/lib/constants';

export default function WhatsAppButton() {
  return (
    <a
      href={waLink("Hi PopMerry! I'd like to enquire about an order 🍰")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-50 group flex items-center gap-3"
    >
      {/* Tooltip */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
        Chat with us
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 flex items-center justify-center rounded-full shadow-lg shadow-green-500/30 transition-transform duration-200 group-hover:scale-110 active:scale-95"
        style={{ background: '#25D366' }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: '#25D366' }} />

        {/* WhatsApp SVG */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.002 2C8.28 2 2 8.28 2 16.002c0 2.478.648 4.804 1.776 6.83L2 30l7.374-1.736A13.93 13.93 0 0 0 16.002 30C23.72 30 30 23.72 30 16.002 30 8.28 23.72 2 16.002 2Zm0 25.454a11.42 11.42 0 0 1-5.828-1.594l-.418-.248-4.374 1.028 1.054-4.262-.274-.436A11.387 11.387 0 0 1 4.546 16c0-6.318 5.14-11.456 11.456-11.456S27.456 9.682 27.456 16 22.318 27.454 16.002 27.454Zm6.288-8.572c-.344-.172-2.038-1.004-2.352-1.12-.316-.114-.546-.172-.776.172-.23.344-.89 1.12-1.092 1.35-.2.23-.402.258-.746.086-.344-.172-1.452-.534-2.766-1.706-1.022-.912-1.712-2.036-1.912-2.38-.2-.344-.022-.53.15-.702.154-.154.344-.402.516-.602.172-.2.23-.344.344-.574.116-.23.058-.43-.028-.602-.088-.172-.776-1.872-1.064-2.562-.28-.672-.564-.58-.776-.592l-.66-.012c-.23 0-.602.086-.918.43s-1.204 1.176-1.204 2.868 1.232 3.326 1.404 3.556c.172.23 2.426 3.706 5.878 5.196.822.354 1.464.566 1.964.724.824.262 1.576.224 2.17.136.66-.098 2.038-.834 2.324-1.636.286-.804.286-1.492.2-1.636-.084-.144-.314-.23-.66-.402Z" />
        </svg>
      </div>
    </a>
  );
}
