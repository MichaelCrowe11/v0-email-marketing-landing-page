"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Globe, MapPin, Phone, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-16 md:py-20 overflow-hidden border-t border-border/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-muted/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Company Info & Credibility */}
          <div className="text-center md:text-left md:col-span-2">
            <div className="flex flex-col items-center md:items-start gap-4 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Image
                  src="/crowe-avatar.png"
                  alt="Michael Crowe - Founder & Mycology Expert"
                  width={80}
                  height={80}
                  className="relative h-16 w-16 md:h-20 md:w-20 rounded-full ring-4 ring-border shadow-xl hover:ring-primary/20 transition-all duration-300"
                />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-foreground mb-1">
                  Crowe Logic AI
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  Powered by Southwest Mushrooms
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              20+ years of professional mycology expertise, distilled into an AI that thinks like Michael Crowe.
              Trusted by cultivators worldwide for contamination analysis, yield optimization, and expert guidance.
            </p>

            {/* Credibility Indicators */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 border border-border/50">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Professional Since 2003</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 border border-border/50">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>Trusted by Cultivators</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 border border-border/50">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI-Powered Expertise</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Try Free Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/gpts"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  GPT Modules
                </Link>
              </li>
              <li>
                <Link
                  href="/species-library"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Species Library
                </Link>
              </li>
              <li>
                <Link
                  href="/knowledge-base"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Knowledge Base
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-foreground mb-4">Get in Touch</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="mailto:michael@crowelogic.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  aria-label="Email Michael Crowe"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">michael@crowelogic.com</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@crowelogic.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  aria-label="Email support team"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">support@crowelogic.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1-555-CROWE-AI"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  aria-label="Call Crowe Logic AI"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+1 (555) CROWE-AI</span>
                </a>
              </li>
              <li>
                <a
                  href="https://southwestmushrooms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  aria-label="Visit Southwest Mushrooms website"
                >
                  <Globe className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Southwest Mushrooms</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>

            {/* Physical Location - Enhanced */}
            <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/50">
              <div className="text-sm text-muted-foreground inline-flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Southwest Mushrooms</div>
                  <div className="text-xs leading-relaxed">
                    <div>Phoenix, Arizona, USA</div>
                    <div className="mt-1 text-muted-foreground/80">Professional Cultivation Facility</div>
                    <div className="mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Operating Since 2003</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Links & Social Proof - Enhanced */}
        <div className="mb-8 pb-8 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-4 text-center md:text-left">
            Part of the Crowe Ecosystem
          </h4>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-all px-3 py-2 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 inline-flex items-center gap-2 group"
            >
              <Globe className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Southwest Mushrooms</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
            <a
              href="/crowe-vision"
              className="text-xs text-muted-foreground hover:text-primary transition-all px-3 py-2 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 inline-flex items-center gap-2 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Crowe Vision AI</span>
            </a>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground hover:text-primary transition-all px-3 py-2 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 inline-flex items-center gap-2 group"
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Contact Us</span>
            </Link>
            <Link
              href="/forum"
              className="text-xs text-muted-foreground hover:text-primary transition-all px-3 py-2 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 inline-flex items-center gap-2 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="font-medium">Community Forum</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="text-2xl font-bold text-primary">20+</div>
              <div className="text-xs text-muted-foreground mt-1">Years Experience</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="text-2xl font-bold text-cyan-500">1000+</div>
              <div className="text-xs text-muted-foreground mt-1">Cultivators Helped</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="text-2xl font-bold text-pink-500">50K+</div>
              <div className="text-xs text-muted-foreground mt-1">Analyses Performed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="text-2xl font-bold text-purple-500">24/7</div>
              <div className="text-xs text-muted-foreground mt-1">AI Availability</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Legal & Copyright - Enhanced */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              <div className="mb-2 font-medium text-foreground">© 2025 Crowe Logic AI. All Rights Reserved.</div>
              <div className="text-xs leading-relaxed">
                Built with expertise from 20+ years of professional mycology
              </div>
              <div className="text-xs mt-1 text-muted-foreground/70">
                A product of Southwest Mushrooms, Phoenix, AZ
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Terms of Service
              </Link>
              <Link
                href="/refund-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refund Policy
              </Link>
              <a
                href="mailto:support@crowelogic.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Security & Trust Badges */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
