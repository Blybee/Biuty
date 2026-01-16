"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { useCart } from "@/features/cart";
import { useAuth } from "@/features/auth";
import { siteConfig } from "@/shared/config";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  Search,
  Heart,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/" },
  {
    label: "Tienda",
    href: "/shop",
    children: [
      { label: "Suplementos", href: "/shop?category=suplementos" },
      { label: "Productos Naturales", href: "/shop?category=naturales" },
      { label: "Fitness", href: "/shop?category=fitness" },
      { label: "Bienestar", href: "/shop?category=bienestar" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Nosotros", href: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { itemCount, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sage/10">
      <div className="container-biuty">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-display font-bold text-forest"
          >
            <span className="text-primary">●</span>
            {siteConfig.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 text-forest/80 hover:text-primary transition-colors font-medium",
                    link.children && "cursor-pointer"
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-2 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-lg border border-sage/10 py-2 min-w-[200px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-forest/80 hover:text-primary hover:bg-background transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              className="p-2 text-forest/70 hover:text-primary transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-forest/70 hover:text-primary transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-2 text-forest/70 hover:text-primary transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{user?.displayName?.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 text-forest/70 hover:text-primary transition-colors"
                aria-label="Iniciar sesión"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={openCart}
              className="relative p-2 text-forest/70 hover:text-primary transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-forest/70"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-forest"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-sage/10 animate-slide-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-3 px-4 text-forest font-medium hover:bg-background rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 px-4 text-sage-dark text-sm hover:text-primary transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-sage/10 mt-2 pt-4">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-2 py-3 px-4 text-forest font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 py-3 px-4 text-forest font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
