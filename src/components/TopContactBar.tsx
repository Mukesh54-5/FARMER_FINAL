import React from 'react';
import { Phone, Mail, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const TopContactBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[#17613A] text-white border-b border-white/15 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href="tel:+918000000000"
            className="inline-flex items-center gap-1.5 text-white/95 hover:text-[#F47721] transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">{t('contact.phone')}</span>
          </a>
          <a
            href="mailto:support@farmerschemeportal.edu.in"
            className="inline-flex items-center gap-1.5 text-white/95 hover:text-[#F47721] transition-colors whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[230px] sm:max-w-none">{t('contact.email')}</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            aria-label="Facebook community info"
            title="Facebook (Placeholder Social Link)"
            className="p-1 rounded hover:bg-[#207747] hover:text-[#F47721] transition-colors"
          >
            <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            aria-label="X Twitter updates"
            title="X / Twitter (Placeholder Social Link)"
            className="p-1 rounded hover:bg-[#207747] hover:text-[#F47721] transition-colors font-semibold leading-none text-[11px] w-5 h-5 flex items-center justify-center"
          >
            𝕏
          </Link>
          <Link
            to="/contact"
            aria-label="Instagram agricultural gallery"
            title="Instagram (Placeholder Social Link)"
            className="p-1 rounded hover:bg-[#207747] hover:text-[#F47721] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            aria-label="YouTube farming tutorials"
            title="YouTube (Placeholder Social Link)"
            className="p-1 rounded hover:bg-[#207747] hover:text-[#F47721] transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            aria-label="WhatsApp farmer helpdesk"
            title="WhatsApp (Placeholder Social Link)"
            className="p-1 rounded hover:bg-[#207747] hover:text-[#F47721] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};
