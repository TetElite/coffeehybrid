/**
 * Footer Component
 * Site-wide footer with branding, links, and info
 */

import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-black text-lg">
              <Coffee className="w-5 h-5 text-primary" />
              <span>CoffeeHybrid</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Smart coffee ordering system designed for modern cafes.
            </p>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-tight">Customer</h4>
            <nav className="space-y-2">
              <Link
                href="/menu"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/checkout"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/login"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>

          {/* Staff */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-tight">Operations</h4>
            <nav className="space-y-2">
              <Link
                href="/staff"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Staff Portal
              </Link>
              <Link
                href="/staff/scan"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                QR Scanner
              </Link>
              <Link
                href="/admin"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-tight">Legal</h4>
            <nav className="space-y-2">
              <a
                href="#privacy"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#contact"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} CoffeeHybrid. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using{' '}
              <span className="text-primary font-semibold">Next.js</span> &{' '}
              <span className="text-primary font-semibold">MongoDB</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
