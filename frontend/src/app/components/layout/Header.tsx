"use client";

import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowLogoutButton(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    setShowLogoutButton(false);
  };

  const handleGenerateNewPlan = () => {
    router.push('/template-selection');
    setShowMenu(false);
  };

  const handleHistory = () => {
    router.push('/dashboard');
    setShowMenu(false);
  };

  const handleManageClassProfiles = () => {
    router.push('/manage-class-profiles');
    setShowMenu(false);
  };

  return (
    <div className="fixed top-0 w-full z-50 h-16 bg-blue-700 border-b border-white/0">
      <div className="w-full max-w-[1336px] h-9 mx-auto px-[52px] pt-4">
        <div className={`flex items-center h-full ${isAuthPage ? 'justify-center' : 'justify-between'}`}>
          {!isAuthPage && (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
                <Image src="/menu-icon.svg" alt="Menu" width={28} height={28} />
              </button>
              {showMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleGenerateNewPlan}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Gerar novo plano de aula
                  </button>
                  <button
                    onClick={handleHistory}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Histórico
                  </button>
                  <button
                    onClick={handleManageClassProfiles}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Gerenciar perfis de turma
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-center text-white text-3xl font-bold font-inter">
            <Image src="/logo.png" alt="PlanEJA logo" width={36} height={36} />
            PlanEJA
          </div>

          {!isAuthPage && session && (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowLogoutButton(!showLogoutButton)} className="cursor-pointer">
                <Image src="/user-icon.svg" alt="Usuário" width={28} height={28} />
              </button>
              {showLogoutButton && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
