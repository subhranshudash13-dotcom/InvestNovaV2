'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';

type Theme = 'light' | 'dark' | 'sunset' | 'ocean';

const themes = {
    light: {
        name: 'Light',
        icon: Sun,
        colors: {
            bg: '#ffffff',
            text: '#0a0a0a',
            primary: '#3B82F6',
            secondary: '#8B5CF6',
        }
    },
    dark: {
        name: 'Dark',
        icon: Moon,
        colors: {
            bg: '#0a0a0a',
            text: '#ededed',
            primary: '#60A5FA',
            secondary: '#A78BFA',
        }
    },
    sunset: {
        name: 'Sunset',
        icon: Palette,
        colors: {
            bg: '#1a0a0a',
            text: '#fff5f5',
            primary: '#FF5757',
            secondary: '#FF8C42',
        }
    },
    ocean: {
        name: 'Ocean',
        icon: Palette,
        colors: {
            bg: '#0a1a2a',
            text: '#e0f2ff',
            primary: '#06B6D4',
            secondary: '#3B82F6',
        }
    },
};

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<Theme>('light');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('theme') as Theme;
        if (saved && themes[saved]) {
            setCurrentTheme(saved);
            applyTheme(saved);
        }
    }, []);

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;
        const colors = themes[theme].colors;

        // Apply CSS variables
        root.style.setProperty('--background', colors.bg);
        root.style.setProperty('--foreground', colors.text);

        // Set data-theme attribute for Tailwind
        root.setAttribute('data-theme', theme);

        // Apply dark class for dark-based themes
        if (theme === 'dark' || theme === 'sunset' || theme === 'ocean') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const changeTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        setShowPicker(false);
    };

    if (!mounted) return null;

    const CurrentIcon = themes[currentTheme].icon;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="relative">
                {/* Theme Picker */}
                {showPicker && (
                    <div className="absolute bottom-16 right-0 glass-card p-3 space-y-2 min-w-[200px]">
                        {Object.entries(themes).map(([key, theme]) => {
                            const Icon = theme.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => changeTheme(key as Theme)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentTheme === key
                                            ? 'bg-primary-100 dark:bg-primary-900'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{theme.name}</span>
                                    {currentTheme === key && (
                                        <span className="ml-auto text-xs">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="glass-card p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    title="Change theme"
                >
                    <CurrentIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
