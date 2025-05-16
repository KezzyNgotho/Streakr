import * as React from 'react';

const navItems = [
  { label: 'Home', icon: '🏠', href: '#' },
  { label: 'Streaks', icon: '📅', href: '#' },
  { label: 'Add', icon: '➕', href: '#' },
  { label: 'Explore', icon: '🔥', href: '#' },
  { label: 'Profile', icon: '👤', href: '#' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-md flex justify-between md:hidden h-16 pb-safe">
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex flex-col items-center flex-1 min-h-[44px] py-2 text-dark hover:text-primary transition"
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default BottomNav; 