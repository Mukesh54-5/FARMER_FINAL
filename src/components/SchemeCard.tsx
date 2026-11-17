import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useTranslation();

  return (
    <article className="bg-white border border-[#E5E7EB] rounded-md p-5 flex flex-col justify-between hover:border-[#207747]/60 transition-colors">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#207747]">
          <span>{scheme.governmentLevel} Government</span>
          <span aria-hidden="true">·</span>
          <span>{scheme.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#303030]/70">{scheme.stateName}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-[#17613A] leading-snug">
          {scheme.name}
        </h3>

        <p className="mt-2 text-sm text-[#303030] leading-relaxed line-clamp-3">
          {scheme.overview}
        </p>

        <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-2 text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-[#17613A]">Benefits: </span>
            <span className="text-[#303030]">{scheme.benefits}</span>
          </div>
          <div>
            <span className="font-semibold text-[#17613A]">Eligibility: </span>
            <span className="text-[#303030]/90">{scheme.eligibilitySummary}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/schemes/${scheme.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17613A] hover:bg-[#207747] text-white text-xs sm:text-sm font-semibold rounded transition-colors whitespace-nowrap"
        >
          <span>{t('home.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#F47721] hover:underline whitespace-nowrap"
        >
          <span>{t('home.officialWebsite')}</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};
