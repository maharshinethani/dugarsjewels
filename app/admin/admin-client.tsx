'use client';

import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Layers, 
  CalendarDays, 
  Mail, 
  Settings, 
  LogOut, 
  Home, 
  Megaphone, 
  Globe, 
  MessageSquare,
  Gem,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/collections', label: 'Collections', icon: Layers },
  { href: '/admin/currencies', label: 'Currencies', icon: Globe },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [loading, user, isLoginPage, router]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#C5A059]/25 animate-ping" />
            <Gem className="h-10 w-10 text-[#C5A059] animate-pulse relative z-10" />
          </div>
          <span className="font-serif text-2xl tracking-[0.3em] text-[#C5A059] font-medium">
            DUGARS
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F2EB] lg:flex text-[#2C2A29]">
      {/* Desktop Sidebar - Fixed / Sticky on Laptop and Up */}
      <aside className="hidden w-64 flex-shrink-0 bg-[#FAF9F6] border-r border-[#E8E2D5] lg:flex lg:flex-col justify-between shadow-sm lg:sticky lg:top-0 lg:h-screen z-20 overflow-y-auto">
        <div>
          {/* Logo Section */}
          <div className="flex h-20 items-center px-6 border-b border-[#E8E2D5]/80 bg-[#FAF9F6] sticky top-0 z-10">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative p-1 rounded-lg bg-[#FAF9F6] group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="DUGARS Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span
                className="text-2xl font-bold tracking-[0.12em] text-[#102B5C] transition-colors"
                style={{ fontFamily: "serif" }}
              >
                DUGARS
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 p-4">
            {adminNav.map((item) => {
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/10 to-transparent text-[#8C6B28] font-bold border-l-4 border-[#C5A059] shadow-sm'
                      : 'text-[#5C5652] hover:bg-[#F2EDE4] hover:text-[#2C2A29]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#C5A059]' : 'text-[#8C857B] group-hover:text-[#C5A059]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#C5A059]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#E8E2D5] p-4 space-y-1.5 bg-[#F5F2EB]/50 sticky bottom-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#5C5652] hover:bg-[#F2EDE4] hover:text-[#2C2A29] transition-all"
          >
            <Home className="h-4 w-4 text-[#8C857B]" /> View Website
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50/80 transition-all"
          >
            <LogOut className="h-4 w-4 text-rose-600" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Fixed at top) */}
      <div className="flex h-16 items-center justify-between bg-[#FAF9F6]/90 backdrop-blur-md px-5 border-b border-[#E8E2D5] lg:hidden sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-[#5C5652] hover:bg-[#F2EDE4] hover:text-[#2C2A29] transition-all focus:outline-none active:scale-95"
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6 text-[#102B5C]" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="DUGARS Logo"
              className="h-7 w-7 object-contain"
            />
            <span
              className="text-xl font-bold tracking-[0.12em] text-[#102B5C] sm:text-2xl"
              style={{ fontFamily: "serif" }}
            >
              DUGARS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-[#5C5652] hover:text-[#2C2A29] hover:bg-[#F2EDE4] rounded-xl transition-all">
            <Home className="h-5 w-5" />
          </Link>
          <button onClick={signOut} className="p-2 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* FIXED FULL-SCREEN MOBILE DRAWER (LUXURY OVERLAY & SMOOTH ANIMATION) */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden flex transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop with Glass Blur & Smooth Fade */}
        <div 
          className={`fixed inset-0 bg-[#102B5C]/50 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div 
          className={`relative w-[75%] max-w-xs bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between z-10 border-r border-[#E8E2D5] rounded-r-[25px] overflow-hidden transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Drawer Top Header with Logo & Close Button */}
            <div className="flex h-16 items-center gap-4 border-b border-[#E8E2D5] bg-[#F5F2EB]/60 px-5">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="shrink-0 rounded-full p-1.5 text-[#5C5652] transition-all hover:bg-[#E8E2D5] focus:outline-none"
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </button>

              <Link href="/admin" className="flex items-center gap-1.5">
                <img
                  src="/logo.png"
                  alt="DUGARS Logo"
                  className="h-7 w-7 object-contain"
                />

                <span
                  className="text-xl font-bold tracking-[0.08em] text-[#102B5C]"
                  style={{ fontFamily: "serif" }}
                >
                  DUGARS
                </span>
              </Link>
            </div>

            {/* Navigation Items List */}
            <div className="p-4 space-y-1.5 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {adminNav.map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#9E7B3B] text-white shadow-md shadow-[#C5A059]/30 font-semibold scale-[1.02]'
                        : 'text-[#5C5652] hover:bg-[#F2EDE4] hover:text-[#2C2A29]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#8C857B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-white" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Brand Label inside Drawer */}
          <div className="p-4 border-t border-[#E8E2D5] bg-[#F5F2EB]/40 flex items-center justify-center gap-2">
            <Gem className="h-4 w-4 text-[#C5A059]" />
            <span className="text-xs tracking-[0.2em] font-serif font-bold text-[#102B5C]">
              DUGARS ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-5 lg:p-8 bg-[#F5F2EB] min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function AdminClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}