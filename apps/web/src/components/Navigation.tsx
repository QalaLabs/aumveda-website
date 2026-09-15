"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  History,
  User,
  ShieldAlert,
  CalendarCheck,
  Utensils,
  Package,
  Activity
} from 'lucide-react';
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname() || '';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CalendarCheck, label: 'Routine', path: '/dashboard/routine' },
    { icon: Utensils, label: 'Food Guide', path: '/dashboard/food-guide' },
    { icon: BookOpen, label: 'Courses', path: '/dashboard/courses' },
    { icon: History, label: 'Journal', path: '/dashboard/journal' },
    { icon: Activity, label: 'Timeline', path: '/dashboard/activity' },
    { icon: ShoppingBag, label: 'Shop', path: '/dashboard/shop' },
    { icon: Package, label: 'Orders', path: '/dashboard/orders' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-4 pb-safe pt-3 flex justify-between items-center z-50 md:sticky md:top-0 md:flex-col md:h-screen md:w-64 md:shrink-0 md:border-t-0 md:border-r md:p-8 md:justify-start md:gap-8 md:bg-white md:overflow-y-auto">
      <div className="hidden md:flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md overflow-hidden border border-slate-100">
          <img src="/logo.png" alt="Aumveda Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tighter">Aumveda</span>
      </div>

      <div className="flex w-full justify-between md:flex-col md:gap-2 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.path || pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[64px] md:min-w-0 md:flex-row md:gap-3 md:px-4 md:py-3 md:rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary md:bg-accent"
                  : "text-slate-400 hover:text-primary md:hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-5 h-5 md:w-5 md:h-5", isActive ? "text-primary" : "text-slate-400")} />
              <span className="text-[9px] font-bold uppercase tracking-widest md:text-sm md:normal-case md:tracking-normal md:font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:mt-auto md:block w-full">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            pathname === '/admin' ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"
          )}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-sm font-semibold">Admin Panel</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
