"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, TrendingUp, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import AuthModal from "@/components/auth/AuthModal";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const pathname = usePathname();
    const { user, loading } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        ...(user ? [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] : []),
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-7xl rounded-full border border-transparent",
                    isScrolled
                        ? "bg-background/60 backdrop-blur-xl border-border shadow-lg py-1 px-2"
                        : "bg-transparent py-4 px-4"
                )}
            >
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            InvestNova
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-muted",
                                    pathname === item.href
                                        ? "text-primary bg-primary/5"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {loading ? (
                            <div className="w-24 h-9 bg-muted animate-pulse rounded-full" />
                        ) : user ? (
                            <Link href="/dashboard">
                                <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                                    <User className="w-4 h-4" />
                                    Account
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                onClick={() => setShowAuthModal(true)}
                                className="button-primary px-6 h-10 text-xs"
                            >
                                Get Started
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 10 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-2 glass-card p-4 flex flex-col gap-2"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl text-base font-medium hover:bg-muted transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {!user && (
                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setShowAuthModal(true);
                                    }}
                                    className="w-full mt-2 h-12 text-base"
                                >
                                    Start Trading Now
                                </Button>
                            )}
                            {user && (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full mt-2 h-12 text-base">Go to Dashboard</Button>
                                </Link>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
}
