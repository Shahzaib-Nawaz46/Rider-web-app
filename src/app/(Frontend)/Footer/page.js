'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineDirectionsCar } from 'react-icons/md';
import { BiWallet } from 'react-icons/bi';
import { HiOutlineUser } from 'react-icons/hi';

export default function Footer() {
  const pathname = usePathname();
   console.log(pathname)
  const navItems = [
    { href: '/', label: 'Home', icon: AiOutlineHome },
    { href: '/ride', label: 'Ride', icon: MdOutlineDirectionsCar },
    { href: '/wallet', label: 'Wallet', icon: BiWallet },
    { href: '/profile', label: 'Profile', icon: HiOutlineUser },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex justify-around items-center h-16  mx-auto px-4 ">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}