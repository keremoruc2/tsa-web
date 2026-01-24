"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/join', label: 'Join Us' },
  { href: '/contact', label: 'Contact' },
];

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className={`w-full fixed top-0 z-[60] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white py-4'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
              {/* Logo */}
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                <Image
                  src="/images/logo.jpg"
                  alt="TSA TWENTE"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-turkish-red tracking-tight">TSA TWENTE</span>
                <span className="text-[10px] text-neutral-500 tracking-wider uppercase hidden sm:block">
                  Turkish Student Association
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'text-turkish-red' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-6 h-0.5 bg-neutral-800 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-neutral-800 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-neutral-800 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                    pathname === link.href 
                      ? 'bg-turkish-red/10 text-turkish-red' 
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-[72px]">{children}</main>
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-neutral-900 text-white mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            {/* Footer Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              
              {/* Brand & Description */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src="/images/logo.jpg"
                      alt="TSA TWENTE"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold text-white">TSA TWENTE</span>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Turkish Student Association at University of Twente. Bringing Turkish culture 
                  and community together in the Netherlands.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className="text-neutral-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                  Contact
                </h3>
                <ul className="space-y-3 text-neutral-400 text-sm">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-turkish-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:tsatwente@gmail.com" className="hover:text-white transition-colors">
                      tsatwente@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-turkish-red mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>University of Twente<br />Enschede, Netherlands</span>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-3">
                  <a
                    href="https://instagram.com/tsatwente"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-800 hover:bg-turkish-red rounded-full flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-500 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} TSA TWENTE - Turkish Student Association at University of Twente. All rights reserved.
              </p>
              <p className="text-neutral-600 text-xs mt-2 md:mt-0">
                Hoşgeldiniz - Welcome 🇹🇷
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
