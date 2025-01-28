import Link from 'next/link';
import React from 'react';

interface SideBarProps {
  isOpen?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen = true }) => {
  return (
    <div
      className={`h-screen w-64 fixed left-0 top-0 bg-gray-800 text-white transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
