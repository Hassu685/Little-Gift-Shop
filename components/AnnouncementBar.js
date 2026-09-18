"use client";

import { Truck, Tag, Ticket, Package } from "lucide-react";

const items = [
  { icon: Truck, text: "Free Shipping on Orders Over $50" },
  { icon: Tag, text: "Special 15% Off on All Gifts" },
  { icon: Ticket, text: "Use Code: GIFT15" },
  { icon: Package, text: "Track Your Order" },
];

export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] bg-primary-dark text-white text-xs sm:text-[13px] tracking-wide">
      <div className="container-x hidden sm:flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          {items.slice(0, 2).map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 opacity-90">
              <Icon size={13} className="text-gold" />
              {text}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {items.slice(2).map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 opacity-90">
              <Icon size={13} className="text-gold" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile auto-scrolling marquee */}
      <div className="sm:hidden overflow-hidden py-2">
        <div className="flex w-max animate-marquee gap-10">
          {[...items, ...items].map(({ icon: Icon, text }, i) => (
            <span key={i} className="flex items-center gap-1.5 whitespace-nowrap opacity-90">
              <Icon size={13} className="text-gold" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
