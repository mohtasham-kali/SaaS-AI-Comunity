
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
} from '@/components/ui/sidebar';
import LogoIcon from '@/components/icons/logo-icon';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Home, 
  User,
  Settings,
  ShieldCheck,
  Users,
  FileStack,
  CreditCard,
  LogOut,
  Briefcase, 
  AreaChart, 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
      { href: '/forum', label: 'Forum', icon: Home, matchStartsWith: true }, // Using Home for Forum as per common practice & image context
      { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
      { href: '/analytics', label: 'Analytics', icon: AreaChart }, // Changed from BarChart3 to AreaChart as per earlier structure
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
    router.push('/'); // Redirect to home/login page after logout
  };

  if (loading) { // Removed !currentUser check here as layout already handles redirect
    return (
      <>
        <SidebarHeader className="p-4">
          <Skeleton className="h-8 w-32" />
        </SidebarHeader>
        <SidebarContent className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full mb-1" />)}
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
        <Link href="/forum" className="flex items-center" aria-label="CodeAssist Home">
          <LogoIcon width={120} height={30} />
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
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="w-full"
                tooltip={{ children: "Logout", side: 'right', align: 'center', className: 'ml-2' }}
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </>
  );
};

export default AppSidebarContent;
