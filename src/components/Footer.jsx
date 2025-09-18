// src/components/Footer.jsx
import { Github, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        
        {/* Left: Copy + tagline */}
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold">JanSetu</span> ·
          <span className="ml-1">Built for Smart India Hackathon</span>
        </div>

        {/* Center: Quick Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <a href="/about" className="hover:text-blue-600 transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </a>
          <a href="/credits" className="hover:text-blue-600 transition-colors">
            Hackathon Credits
          </a>
        </nav>

        {/* Right: Socials */}
        <div className="flex gap-4">
          <a
            href="https://github.com/jansetu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-900"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com/jansetu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-500"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/company/jansetu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-700"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
