
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LogoIcon from '@/components/icons/logo-icon';
import { useAuth } from '@/components/auth/auth-provider';
import { Home, PlusCircle, User, LogOut, LogIn, Settings, Menu, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

const Navbar = () => {
  const { currentUser, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter(); 

  const getInitials = (name?: string | null) => {
    if (!name) return 'CA';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const authenticatedNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/new-post", label: "New Post", icon: PlusCircle },
    // { href: "/#faq", label: "FAQ", icon: HelpCircle }, // FAQ link removed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="CodeAssist Home">
          <LogoIcon />
        </Link>
        
        {currentUser && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {authenticatedNavLinks.map(link => (
              <Link key={link.href} href={link.href} className="flex items-center transition-colors hover:text-primary">
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User avatar'} data-ai-hint="abstract avatar" />
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); router.push('/'); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Buttons for non-logged-in users (Desktop)
            <>
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link href="/login">
                  Get Started
                </Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogoIcon />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                {currentUser && (
                  <nav className="flex flex-col space-y-3">
                    {authenticatedNavLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                         <Link
                          href={link.href}
                          className="flex items-center rounded-md p-3 text-base hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <link.icon className="mr-3 h-5 w-5" />
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                )}

                {/* Auth links for mobile menu */}
                {!currentUser && !loading && (
                  <div className={`space-y-3 ${currentUser ? 'mt-8 border-t pt-6' : ''}`}>
                     <SheetClose asChild>
                      <Button variant="outline" className="w-full justify-start p-3 text-base" asChild>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <LogIn className="mr-3 h-5 w-5" /> Get Started
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full justify-start p-3 text-base" asChild>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <UserPlus className="mr-3 h-5 w-5" /> Sign Up
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}

                {currentUser && !loading && (
                  <div className="mt-8 space-y-3 border-t pt-6">
                     <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center rounded-md p-3 text-base hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5" />
                        Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start p-3 text-base hover:bg-accent hover:text-accent-foreground" 
                        onClick={() => { logout(); router.push('/'); setIsMobileMenuOpen(false); }}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log out
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
