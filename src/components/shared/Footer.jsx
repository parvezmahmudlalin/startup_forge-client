"use client";

import Link from "next/link";
import React from "react";
import { RocketIcon } from "@gravity-ui/icons";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          
          {/* 1. Logo & Short Bio */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <RocketIcon className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Startup<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Connecting visionaries, startup founders, and talented collaborators to build the next generation of revolutionary products.
            </p>
            
            {/* 3. Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-3">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500"
                  aria-label="Facebook"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
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

          {/* Additional Platform Links */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
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

          {/* 5. Contact Information */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
              Contact Info
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaEnvelope className="h-4 w-4 mt-1 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <a href="mailto:support@startupforge.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                  support@startupforge.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="h-4 w-4 mt-1 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="h-4 w-4 mt-1 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Innovation Hub, Silicon Valley, CA</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. Copyright & Bottom Section */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
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