import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#17613A] text-white mt-16 border-t-4 border-[#F47721]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Project Overview */}
          <div>
            <h3 className="text-base font-bold text-white leading-snug">
              {t('header.title')}
            </h3>
            <p className="text-xs font-semibold text-[#F47721] mt-1">
              {t('header.hindiTitle')}
            </p>
            <p className="mt-3 text-sm text-white/85 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/contact"
                aria-label="Facebook"
                className="p-2 bg-[#207747] hover:bg-[#F47721] rounded transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                aria-label="Instagram"
                className="p-2 bg-[#207747] hover:bg-[#F47721] rounded transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                aria-label="YouTube"
                className="p-2 bg-[#207747] hover:bg-[#F47721] rounded transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                aria-label="WhatsApp"
                className="p-2 bg-[#207747] hover:bg-[#F47721] rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F47721] mb-3">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link to="/" className="hover:text-[#F47721] transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F47721] transition-colors">
                  {t('nav.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-[#F47721] transition-colors">
                  {t('nav.eligibilityChecker')}
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-[#F47721] transition-colors">
                  AI Farmer Assistant
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F47721] transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Scheme & Agriculture Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F47721] mb-3">
              {t('footer.schemeLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link to="/schemes" className="hover:text-[#F47721] transition-colors">
                  {t('nav.allSchemes')}
                </Link>
              </li>
              <li>
                <Link to="/schemes?level=Central" className="hover:text-[#F47721] transition-colors">
                  {t('nav.centralSchemes')}
                </Link>
              </li>
              <li>
                <Link to="/schemes?level=Karnataka" className="hover:text-[#F47721] transition-colors">
                  {t('nav.karnatakaSchemes')}
                </Link>
              </li>
              <li>
                <Link to="/agriculture/crop" className="hover:text-[#F47721] transition-colors">
                  {t('nav.crops')} &amp; {t('nav.soilInfo')}
                </Link>
              </li>
              <li>
                <Link to="/agriculture/technology" className="hover:text-[#F47721] transition-colors">
                  {t('nav.technologies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F47721] mb-3">
              {t('footer.contactInfo')}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#F47721] shrink-0 mt-0.5" />
                <span className="tabular-nums">{t('contact.phone')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#F47721] shrink-0 mt-0.5" />
                <span className="break-all">{t('contact.email')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F47721] shrink-0 mt-0.5" />
                <span>College Mini Project Campus, Karnataka, India (Placeholder)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/20">
          <p className="text-xs sm:text-sm text-white/95 bg-[#114B2C] border border-white/15 rounded p-4 leading-relaxed">
            {t('footer.disclaimer')}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/75">
            <span>{t('footer.copyright')}</span>
            <span>English · हिंदी · ಕನ್ನಡ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
