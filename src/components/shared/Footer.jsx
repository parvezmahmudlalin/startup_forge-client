"use client";

import Link from "next/link";
import React from "react";
import { Rocket } from "@gravity-ui/icons";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt 
} from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          
          {/* 1. Logo & Short Bio */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="group flex w-fit items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Startup<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Connecting visionaries, startup founders, and talented collaborators to build the next generation of revolutionary products.
            </p>
            
            {/* Social Links */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-500"
                  aria-label="Facebook"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/startups" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Platform Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Contact Info
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <a href="mailto:support@startupforge.com" className="truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                  support@startupforge.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>+880 01727594503</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>Mymensingh, Bangladesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 5. Copyright & Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>© {currentYear} StartupForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;