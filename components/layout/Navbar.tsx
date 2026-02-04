"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, TrendingUp, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

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
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
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
                        <Link href="/dashboard">
                            <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Button>
                        </Link>
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
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg p-4"
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
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full mt-2 h-12 text-base">Go to Dashboard</Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            </>
    );
}
