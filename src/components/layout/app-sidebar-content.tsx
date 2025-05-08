
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import LogoIcon from '@/components/icons/logo-icon';
import { useAuth } from '@/components/auth/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Home, // Changed from LayoutDashboard to Home for Forum
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  Users,
  FileStack,
  CreditCard,
  LogOut,
  Briefcase, // Placeholder for Dashboard
  AreaChart, // Placeholder for Analytics
  PlusCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const getInitials = (name?: string | null) => {
  if (!name) return '??';
  const names = name.split(' ');
  return names.length > 1
    ? names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchStartsWith?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const mainNavGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { href: '/forum', label: 'Forum', icon: Home, matchStartsWith: true },
      { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
      { href: '/analytics', label: 'Analytics', icon: AreaChart },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/profile', label: 'Profile', icon: User },
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/premium-features', label: 'Premium Features', icon: ShieldCheck },
    ],
  },
];

const adminNavGroup: NavGroup = {
  label: 'Admin',
  items: [
    { href: '/admin/manage-users', label: 'Manage Users', icon: Users },
    { href: '/admin/manage-posts', label: 'Manage Posts', icon: FileStack },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  ],
};


const AppSidebarContent = () => {
  const { currentUser, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading || !currentUser) {
    return (
      <>
        <SidebarHeader className="p-4">
          <Skeleton className="h-8 w-32" />
        </SidebarHeader>
        <SidebarContent className="p-4 space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          <SidebarSeparator />
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Skeleton className="h-10 w-full" />
        </SidebarFooter>
      </>
    );
  }


  return (
    <>
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Link href="/forum" className="flex items-center">
          <LogoIcon width={100} height={25} />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {mainNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.matchStartsWith ? pathname.startsWith(item.href) : pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center', className: 'ml-2' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          ))}
          {/* Placeholder for Admin section, can be conditionally rendered based on user role */}
           <SidebarGroup>
              <SidebarGroupLabel>{adminNavGroup.label}</SidebarGroupLabel>
              {adminNavGroup.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.matchStartsWith ? pathname.startsWith(item.href) : pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center', className: 'ml-2' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
            <Link href="/profile" className="flex items-center gap-3 overflow-hidden flex-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User avatar'} data-ai-hint="abstract avatar" />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs truncate">
                <span className="font-semibold text-sidebar-foreground truncate">{currentUser.name}</span>
                <span className="text-sidebar-foreground/70 truncate">{currentUser.email}</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground shrink-0">
              <LogOut size={18} />
              <span className="sr-only">Log out</span>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
};

export default AppSidebarContent;
