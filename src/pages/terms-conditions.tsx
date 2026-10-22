import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FileText,
  LogIn,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Twitter,
  Linkedin,
  User,
  Calendar
} from 'lucide-react';
import { useFetchAppSettings } from '@/hooks/useSettingsApi';
import { toast } from 'react-toastify';

export default function TermsConditionsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // App settings for dynamic contact/whatsapp information
  const { data: appSettings } = useFetchAppSettings();

  // Enquiry Modal state (Opened via "Inquiry Now" side button)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    mobileNumber: '',
    message: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleRegisterClick = () => {
    router.push('/auth/register');
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = enquiryForm.fullName.trim();
    const phone = enquiryForm.mobileNumber.trim();
    const msg = enquiryForm.message.trim();

    if (!name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!phone) {
      toast.error('Please enter your mobile number');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!msg) {
      toast.error('Please enter your message');
      return;
    }

    const rawTargetPhone = (appSettings?.whatsapp_number || appSettings?.mobile_number || '8866779008').toString().trim();
    const targetDigits = rawTargetPhone.replace(/\D/g, '');
    const targetWhatsApp = targetDigits.length === 10 ? `91${targetDigits}` : targetDigits;

    const waText = `*New Inquiry via Website*\n\n*Full Name:* ${name}\n*Mobile Number:* ${phone}\n*Message:* ${msg}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsApp}&text=${encodeURIComponent(waText)}`;

    toast.success('Redirecting to WhatsApp...');
    window.open(whatsappUrl, '_blank');
    setEnquiryForm({ fullName: '', mobileNumber: '', message: '' });
    setEnquiryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-800 font-sans antialiased selection:bg-[#2D3591] selection:text-white flex flex-col justify-between">
      <Head>
        <title>Terms &amp; Conditions - Insuraa Insurance Management Platform</title>
        <meta
          name="description"
          content="Please read these Terms & Conditions carefully before using our services or website."
        />
        <link rel="icon" href="/favicon_img.png" />
      </Head>

      {/* Main Sticky Navbar (Exact match to index.tsx) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Insuraa Logo"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-600">
            <Link href="/#software-features" className="hover:text-[#2D3591] transition-colors">
              Features
            </Link>
            <Link href="/#solutions" className="hover:text-[#2D3591] transition-colors">
              Solutions
            </Link>
            <Link href="/#pricing" className="hover:text-[#2D3591] transition-colors">
              Pricing
            </Link>
            <Link href="/#contact" className="hover:text-[#2D3591] transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleDashboardClick}
                id="navbar-dashboard-btn"
                className="inline-flex items-center gap-2 bg-[#2D3591] hover:bg-[#222870] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  id="navbar-login-btn"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#2D3591] bg-indigo-50 hover:bg-[#2D3591] hover:text-white border border-[#2D3591]/25 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#2D3591] group-hover:text-white transition-colors" />
                  <span>Login</span>
                </button>

                <button
                  onClick={handleRegisterClick}
                  id="navbar-demo-btn"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#2BBF8C] to-[#1EA376] hover:from-[#24aa7c] hover:to-[#1a8e67] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span>Start Free Trial</span>
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              About Insuraa
            </Link>
            <Link
              href="/#software-features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Features
            </Link>
            <Link
              href="/#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Insurance Solutions
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Contact Us
            </Link>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleLoginClick}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-[#2D3591] hover:bg-[#222870] shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </button>
              <button
                onClick={handleRegisterClick}
                className="w-full flex items-center justify-center py-2.5 rounded-xl font-medium text-[#2D3591] bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Register Agency</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Professional Header Banner with Landing Terms Image */}
        <section className="bg-gradient-to-b from-white via-indigo-50/25 to-white border-b border-slate-200/80 py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Heading & Badges */}
              <div className="md:col-span-7 space-y-4 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
                  Terms &amp; Conditions
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Please read these Terms &amp; Conditions carefully before using our services or website.
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-[13px] text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100/80 px-3 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-[#2D3591]" /> Last Updated: October 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-[#2D3591] px-3 py-1 rounded-lg border border-indigo-200/60">
                    <FileText className="w-3.5 h-3.5 text-[#2D3591]" /> Standard User Agreement
                  </span>
                </div>
              </div>

              {/* Right Column: User Added /landing/terms.png Image */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl -z-10 transform group-hover:scale-110 transition-transform duration-500" />
                  <img
                    src="/landing/terms.png"
                    alt="Insuraa Terms and Conditions"
                    className="w-56 sm:w-64 md:w-72 lg:w-80 h-auto object-contain drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean, Normal Document Container with Exact Content from Reference */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-7 text-slate-700 text-[15px] sm:text-base leading-relaxed font-normal">

            {/* Introduction (Matching Screenshot) */}
            <div className="border-b border-slate-100 pb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Terms and Conditions
              </h2>
              <p>
                Welcome to JD Insuraa Insurance Software. These terms and conditions outline the rules and regulations for the use of our platform.
              </p>
            </div>

            {/* 1. Acceptance of Terms (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using our website and services, you agree to be bound by these terms. If you disagree with any part of the terms, please do not use our services.
              </p>
            </section>

            {/* 2. Services Offered (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                2. Services Offered
              </h3>
              <p>
                Our platform provides tools for insurance management, policy tracking, and digital operations for agents, brokers, and insurance businesses. We do not directly sell or issue insurance policies.
              </p>
            </section>

            {/* 3. User Responsibilities (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                3. User Responsibilities
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p>
                Any activity under your account will be considered your responsibility.
              </p>
              <p>
                You agree not to misuse the platform or attempt to gain unauthorized access to other accounts or systems.
              </p>
            </section>

            {/* 5. Intellectual Property (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                5. Intellectual Property
              </h3>
              <p>
                All content, trademarks, logos, and software are the property of JD Insuraa unless otherwise stated. Unauthorized use is strictly prohibited.
              </p>
            </section>

            {/* 6. Limitations of Liability (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                6. Limitations of Liability
              </h3>
              <p>
                We are not liable for any indirect or consequential loss or damage arising from the use of this software or services provided through it.
              </p>
            </section>

            {/* 7. Termination (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                7. Termination
              </h3>
              <p>
                We reserve the right to terminate or suspend your access at any time without notice if you breach any of these terms.
              </p>
            </section>

            {/* 8. Changes to Terms (Exact Match) */}
            <section className="space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                8. Changes to Terms
              </h3>
              <p>
                We may revise these terms at any time. Continued use of the platform after changes implies acceptance of the updated terms.
              </p>
            </section>

            {/* 9. Contact Us (Exact Match) */}
            <section className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                9. Contact Us
              </h3>
              <p>
                If you have any questions about these Terms &amp; Conditions, please contact us at{' '}
                <a href="mailto:support@insuraa.in" className="text-[#2D3591] hover:underline font-semibold">
                  support@insuraa.in
                </a>
                .
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* "INSURANCE" BALLOONS BANNER IN CONTAINER TOUCHING THE FOOTER (Exact Match to index.tsx) */}
      <div className="w-full relative z-10 -mb-[2px] flex justify-center pointer-events-none select-none overflow-hidden !bg-[#ffffff]">
        <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 flex justify-center items-end">
          <img
            src="/images/landing/footer_imgs.png"
            alt="Insuraa Insurance"
            className="w-full h-auto object-contain block align-bottom"
          />
        </div>
      </div>

      {/* FOOTER (Exact Match to index.tsx) */}
      <footer className="relative bg-[#070B18] text-slate-300 overflow-hidden pt-14 sm:pt-16 pb-8 border-t border-slate-800">
        {/* Ambient Top Light Beam in Brand #27439C */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#27439C] to-transparent" />

        {/* Clean Luxury Dark Footer Background with Ambient Color Glows */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#27439C]/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#2BBF8C]/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 3 Balanced Main Columns: Brand (Left), Quick Links (Center), Contact (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Column 1: Brand & Authority (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-block">
                <img src="/white_logo.png" alt="Insuraa" className="h-10 sm:h-11 w-auto object-contain" />
              </Link>

              <p className="text-sm sm:text-[14.5px] text-slate-300 leading-relaxed font-normal max-w-sm">
                Digitalks, Located In Surat, Gujarat, Specializes In Top-Tier Insurance Agency Management Software &amp; CRM, Ensuring A Seamless Online Shopping &amp; Agency Experience For Your Customers.
              </p>

              {/* 4 Circular Social Icon Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://api.whatsapp.com/send?phone=918866779008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-200 hover:text-white hover:border-[#27439C] hover:bg-[#27439C] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Header Navigation Links (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-6 tracking-wide">
                Quick Links
              </h4>

              <div className="flex flex-col space-y-3 text-sm sm:text-[15px]">
                <Link href="/#solutions" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Solutions
                </Link>
                <Link href="/#pricing" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Pricing
                </Link>
                <Link href="/#software-features" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Features
                </Link>
                <Link href="/#contact" className="text-slate-300 hover:text-[#5275e6] transition-colors">
                  Contact Us
                </Link>
              </div>

              {/* Portal Login Button in Brand #27439C */}
              <div className="pt-2">
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 bg-[#27439C] hover:bg-[#1e347b] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-indigo-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Login to Agency Portal</span>
                  <LogIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Column 3: Contact Details in Brand #27439C (4 cols) */}
            <div className="lg:col-span-4">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-6 tracking-wide">
                Contact
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Phone className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="tel:+918866779008" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] tracking-wide transition-colors">
                    +91 88667 79008
                  </a>
                </div>

                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Phone className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="tel:+917016268071" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] tracking-wide transition-colors">
                    +91 70162 68071
                  </a>
                </div>

                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <Mail className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <a href="mailto:Contact@Shopno.In" className="text-slate-200 hover:text-white font-medium text-sm sm:text-[15px] transition-colors">
                    Contact@Shopno.In
                  </a>
                </div>

                <a
                  href="https://maps.app.goo.gl/KYFUtLChkxdEScUq7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group cursor-pointer"
                  title="Open location in Google Maps"
                >
                  <div className="w-10 h-10 rounded-full border border-[#27439C] bg-[#27439C]/20 flex items-center justify-center text-white shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-[#27439C] transition-all shadow-xs">
                    <MapPin className="w-4 h-4 text-[#5275e6] group-hover:text-white" />
                  </div>
                  <span className="text-slate-300 group-hover:text-white text-xs sm:text-[13.5px] leading-relaxed transition-colors">
                    2nd Floor, C1, Above Adarsh Farsan Mart, Baroda Prestige, Ganesh Colony, Varachha, Surat, Gujarat 395010
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Strip */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
            <p className="text-center md:text-left">
              Copyright © 2026 <span className="font-semibold text-white">Digitalks</span> Designed By{' '}
              <span className="text-[#5275e6] font-semibold">All Rights Reserved</span>
            </p>
            <div className="flex items-center gap-6 text-slate-300 text-xs sm:text-sm flex-wrap justify-center">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors text-white font-semibold">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Vertical Inquiry Now Tab on Left Screen Edge */}
        <button
          type="button"
          onClick={() => setEnquiryModalOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-[#2D3591] via-[#24357D] to-[#1E2568] hover:from-[#353ea8] hover:to-[#242c78] text-white font-semibold text-[13px] tracking-wide px-2.5 py-4 rounded-r-xl shadow-[3px_6px_20px_rgba(45,53,145,0.4)] hover:shadow-[4px_8px_26px_rgba(45,53,145,0.55)] border-y border-r border-white/20 transition-all hover:translate-x-0.5 cursor-pointer flex flex-col items-center gap-2.5 group"
          aria-label="Inquiry Now"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-[#2BBF8C] group-hover:bg-[#2BBF8C] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
            <MessageCircle className="w-3 h-3" />
          </div>
          <span className="[writing-mode:vertical-lr] rotate-180 select-none">
            Inquiry Now
          </span>
        </button>

        {/* Floating WhatsApp Quick Connect Button */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center group/whatsapp">
          <span className="absolute -inset-2.5 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />

          <div className="absolute right-full mr-3.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold rounded-xl shadow-lg opacity-0 group-hover/whatsapp:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp (+91 88667 79008)</span>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=918866779008&text=${encodeURIComponent('Hi Bhavik, I have an inquiry regarding Insuraa.')}`}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Chat with Bhavik Vala on WhatsApp (+91 88667 79008)"
            aria-label="Chat with Bhavik Vala on WhatsApp"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>
      </footer>

      {/* ENQUIRY MODAL (Matching index.tsx) */}
      {enquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setEnquiryModalOpen(false)}
        >
          <div
            className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200/90 my-auto text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="mb-6">
              <span className="text-xs font-bold text-[#2BBF8C] uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp Connect
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2.5">Send Us a Message</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Fill in your details below and we will connect with you directly on WhatsApp.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="terms-modal-enquiry-fullname" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="terms-modal-enquiry-fullname"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={enquiryForm.fullName}
                    onChange={(e) => setEnquiryForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="terms-modal-enquiry-mobile" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="terms-modal-enquiry-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={enquiryForm.mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setEnquiryForm((prev) => ({ ...prev, mobileNumber: val }));
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="terms-modal-enquiry-message" className="block text-sm font-bold text-slate-700 tracking-wider mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="terms-modal-enquiry-message"
                  required
                  rows={4}
                  placeholder="Write your message or inquiry here..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-50 text-sm font-medium text-slate-800 rounded-xl border border-slate-200 focus:border-[#2D3591] focus:bg-white focus:ring-4 focus:ring-[#2D3591]/10 outline-none transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="terms-modal-enquiry-submit-btn"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2BBF8C] to-[#1EA376] hover:from-[#24aa7c] hover:to-[#1a8e67] shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Message via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
