import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/about#contact" },
    { name: "Careers", href: "/about#careers" },
    { name: "Press", href: "/about#press" },
  ],
  destinations: [
    { name: "Male Atoll", href: "/destinations/male-atoll" },
    { name: "Ari Atoll", href: "/destinations/ari-atoll" },
    { name: "Baa Atoll", href: "/destinations/baa-atoll" },
    { name: "All Destinations", href: "/destinations" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Booking Help", href: "/faq#booking" },
    { name: "Cancellation Policy", href: "/faq#cancellation" },
    { name: "Travel Tips", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-stix text-2xl font-bold text-gray-900">Stay Updated</h3>
              <p className="mt-2 text-muted-foreground">Get exclusive travel deals and inspiration delivered to your inbox.</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
              />
              <Button className="rounded-xl px-6 shadow-md hover:shadow-lg">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-stix text-2xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                  MV Travel
                </span>
              </Link>
              <p className="mt-5 text-sm text-gray-600 max-w-sm leading-relaxed">
                Your gateway to paradise. Experience the Maldives like never before
                with our curated selection of luxury resorts and overwater villas.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span>hello@mvtravel.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span>+960 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>Male, Maldives</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5">Destinations</h3>
              <ul className="space-y-3">
                {footerLinks.destinations.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} MV Travel. Made with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in Maldives
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-primary hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200"
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-primary hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-200/80 hover:bg-primary hover:text-white text-gray-600 flex items-center justify-center transition-all duration-200"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
          <div className="flex items-center gap-5">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-gray-500 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
