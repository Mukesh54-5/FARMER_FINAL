import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Landmark,
  CheckCircle2,
  Sparkles,
  Sprout,
  Cpu,
  Bot,
  Layers,
  PawPrint,
  Leaf,
  FlaskConical,
  Droplets,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { SchemeCard } from '../components/SchemeCard';
import { fetchSchemes } from '../services/api';
import type { Scheme } from '../types';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [popularSchemes, setPopularSchemes] = useState<Scheme[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  useEffect(() => {
    let active = true;
    fetchSchemes()
      .then((list) => {
        if (active) {
          const popular = list.filter((s) => s.isPopular);
          setPopularSchemes((popular.length > 0 ? popular : list).slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingSchemes(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (searchQuery.trim()) qs.set('search', searchQuery.trim());
    if (levelFilter !== 'All') qs.set('level', levelFilter);
    navigate(`/schemes?${qs.toString()}`);
  };

  const services = [
    {
      icon: Landmark,
      title: t('services.schemesTitle'),
      desc: t('services.schemesDesc'),
      to: '/schemes',
    },
    {
      icon: CheckCircle2,
      title: t('services.eligibilityTitle'),
      desc: t('services.eligibilityDesc'),
      to: '/eligibility',
    },
    {
      icon: Sparkles,
      title: t('services.recommendTitle'),
      desc: t('services.recommendDesc'),
      to: '/dashboard',
    },
    {
      icon: Sprout,
      title: t('services.agriTitle'),
      desc: t('services.agriDesc'),
      to: '/agriculture/crop',
    },
    {
      icon: Cpu,
      title: t('services.techTitle'),
      desc: t('services.techDesc'),
      to: '/agriculture/technology',
    },
    {
      icon: Bot,
      title: t('services.chatTitle'),
      desc: t('services.chatDesc'),
      to: '/chatbot',
    },
  ];

  const agriModules = [
    {
      icon: Sprout,
      title: t('nav.crops'),
      desc: 'Climate, soil needs, sowing seasons, and practical crop management.',
      to: '/agriculture/crop',
    },
    {
      icon: Layers,
      title: t('nav.soilInfo'),
      desc: 'Red, Black Cotton, Alluvial, and Laterite soil profiles and health tips.',
      to: '/agriculture/soil',
    },
    {
      icon: PawPrint,
      title: t('nav.farmAnimals'),
      desc: 'Care, nutrition, and shelter guidance for cattle, buffalo, goats, sheep, and poultry.',
      to: '/agriculture/animal',
    },
    {
      icon: Leaf,
      title: t('nav.organicFarming'),
      desc: 'Vermicomposting, farmyard manure, mulching, and natural Jeevamrutha methods.',
      to: '/agriculture/organic',
    },
    {
      icon: FlaskConical,
      title: t('nav.inorganicFarming'),
      desc: 'Balanced NPK fertilizer dosage guided by Soil Health Cards and safe handling.',
      to: '/agriculture/inorganic',
    },
    {
      icon: Droplets,
      title: t('nav.modernFarming'),
      desc: 'Drip irrigation, sprinklers, greenhouse farming, and modern farm machinery.',
      to: '/agriculture/technology',
    },
  ];

  const steps = [
    'Register or Login',
    'Complete Farmer Profile',
    'Enter Location & Farming Details',
    'Explore Government Schemes',
    'Check Preliminary Eligibility',
    'View Recommended Schemes',
    'Read Benefits & Required Documents',
    'Visit Official Application Website',
  ];

  const reasons = [
    'Centralized scheme information across Central and Karnataka portals',
    'Easy preliminary eligibility checking with transparent rule explanations',
    'Personalized scheme recommendations based on crop, landholding, and state',
    'Multilingual accessibility in English, Hindi, and Kannada',
    'Verified agricultural learning resources for crops, soils, and livestock',
    'Grounded AI chatbot assistance linked to official portal guidance',
  ];

  return (
    <div>
      {/* Hero Slider immediately below Navbar */}
      <HeroSlider />

      {i18n.language !== 'en' && (
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-[#17613A]">
            {t('common.translationNotice')}
          </div>
        </div>
      )}

      {/* 1. Welcome to the Platform */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
                Independent Educational Platform
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#17613A] leading-tight text-balance">
                {t('home.welcomeHeading')}
              </h2>
              <p className="mt-4 text-base text-[#303030] leading-relaxed">
                {t('home.welcomeBody1')}
              </p>
              <p className="mt-3 text-base text-[#303030]/90 leading-relaxed">
                {t('home.welcomeBody2')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/schemes"
                  className="px-5 py-2.5 bg-[#17613A] hover:bg-[#207747] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap"
                >
                  {t('hero.exploreSchemes')}
                </Link>
                <Link
                  to="/eligibility"
                  className="px-5 py-2.5 border border-[#17613A] text-[#17613A] hover:bg-[#F5F8F5] text-sm font-semibold rounded transition-colors whitespace-nowrap"
                >
                  {t('nav.eligibilityChecker')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] rounded-md overflow-hidden border border-[#E5E7EB] bg-[#F5F8F5]">
                <img
                  src="/src/assets/images/welcome_farmer_portal_1794853262979.jpg"
                  alt="Indian farmer examining thriving green crops in sunlit field"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search Government Schemes */}
      <section className="bg-[#F5F8F5] py-10 border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17613A]">
            {t('home.searchHeading')}
          </h2>
          <p className="mt-1.5 text-sm text-[#303030]/85">
            {t('home.searchSubheading')}
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-5 bg-white p-2 sm:p-2.5 rounded-md border border-[#E5E7EB] flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#303030]/50 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 text-sm text-[#303030] border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
              />
            </div>

            <select
              aria-label="Filter by Government Level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2.5 text-sm text-[#303030] border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#17613A]"
            >
              <option value="All">All Levels (Central &amp; State)</option>
              <option value="Central">Central Government</option>
              <option value="Karnataka">Karnataka State</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F47721] hover:bg-[#d96312] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap"
            >
              {t('home.searchButton')}
            </button>
          </form>
        </div>
      </section>

      {/* 3. Popular Government Schemes */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
                Verified Scheme Directory
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
                {t('home.popularHeading')}
              </h2>
              <p className="mt-1.5 text-sm text-[#303030]/85">
                {t('home.popularSubheading')}
              </p>
            </div>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#17613A] hover:text-[#F47721] transition-colors whitespace-nowrap"
            >
              <span>{t('home.viewAllSchemes')}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {loadingSchemes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-64 bg-[#F5F8F5] border border-[#E5E7EB] rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Platform Services */}
      <section className="bg-[#F5F8F5] py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
              Core Capabilities
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
              {t('home.servicesHeading')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#303030]/85">
              {t('home.servicesSubheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="bg-white border border-[#E5E7EB] rounded-md p-6 flex flex-col justify-between hover:border-[#17613A]/60 transition-colors"
                >
                  <div>
                    <div className="w-11 h-11 rounded bg-[#F5F8F5] border border-[#E5E7EB] flex items-center justify-center text-[#17613A]">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#17613A]">
                      {srv.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#303030]/90 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      to={srv.to}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F47721] hover:text-[#17613A] transition-colors"
                    >
                      <span>{t('services.explore')}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Agricultural Information */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
                Knowledge Center
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
                {t('home.agriHeading')}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#303030]/85 leading-relaxed">
                {t('home.agriSubheading')} Explore dedicated modules for seasonal crops, Indian soil profiles, farm animal care, organic composting, balanced fertilizer stewardship, and precision irrigation.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="h-44 sm:h-48 rounded-md overflow-hidden border border-[#E5E7EB]">
                <img
                  src="/src/assets/images/agri_crops_soil_showcase_1794853262144.jpg"
                  alt="Hands holding fertile dark agricultural soil with young green sprouts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agriModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.to + mod.title}
                  to={mod.to}
                  className="group bg-[#F5F8F5] hover:bg-white border border-[#E5E7EB] hover:border-[#207747] rounded-md p-5 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white border border-[#E5E7EB] flex items-center justify-center text-[#207747] group-hover:bg-[#17613A] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold text-[#17613A]">
                        {mod.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-[#303030]/90 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#F47721]">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. How the Platform Works & Why Choose Us */}
      <section className="bg-[#F5F8F5] py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
                Step-by-Step Workflow
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
                {t('home.howItWorksHeading')}
              </h2>
              <p className="mt-1.5 text-sm text-[#303030]/85">
                {t('home.howItWorksSubheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((label, idx) => (
                <div
                  key={label}
                  className="bg-white border border-[#E5E7EB] rounded-md p-4 flex items-start gap-3"
                >
                  <span className="w-8 h-8 shrink-0 rounded bg-[#17613A] text-white text-xs font-bold flex items-center justify-center tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#303030] leading-snug pt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#17613A]">
              {t('home.whyChooseHeading')}
            </h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reasons.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-[#303030]">
                  <CheckCircle2
                    className="w-4 h-4 text-[#207747] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. AI Chatbot Preview */}
      <section className="bg-[#17613A] text-white py-12 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
              Grounded AI Support
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              {t('home.chatbotHeading')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/85 max-w-2xl">
              {t('home.chatbotDesc')}
            </p>
          </div>
          <Link
            to="/chatbot"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#F47721] hover:bg-[#d96312] text-white font-semibold rounded transition-colors whitespace-nowrap"
          >
            <Bot className="w-5 h-5" aria-hidden="true" />
            <span>{t('home.chatbotCta')}</span>
          </Link>
        </div>
      </section>

      {/* 8. About Project & Contact Summary */}
      <section className="bg-white py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[#E5E7EB] rounded-md p-6 bg-[#F5F8F5]">
            <h2 className="text-xl font-extrabold text-[#17613A]">
              {t('home.aboutHeading')}
            </h2>
            <p className="mt-3 text-sm text-[#303030] leading-relaxed">
              The Farmer Scheme Assistance &amp; Information Platform is an academic student initiative designed to simplify access to Central and Karnataka agricultural schemes, verified eligibility rules, and modern cultivation resources.
            </p>
            <Link
              to="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#F47721] hover:text-[#17613A]"
            >
              <span>Read Objectives &amp; Project Details</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="border border-[#E5E7EB] rounded-md p-6 bg-[#F5F8F5]">
            <h2 className="text-xl font-extrabold text-[#17613A]">
              {t('home.contactHeading')}
            </h2>
            <p className="mt-3 text-sm text-[#303030] leading-relaxed">
              Have feedback about a scheme listing, translation, or platform feature? Reach out through our project support form.
            </p>
            <div className="mt-4 space-y-2 text-sm text-[#303030]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#17613A]" aria-hidden="true" />
                <span className="tabular-nums">{t('contact.phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#17613A]" aria-hidden="true" />
                <span>{t('contact.email')}</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#F47721] hover:text-[#17613A]"
            >
              <span>Open Contact Form</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
