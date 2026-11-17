import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  ListChecks,
  ShieldAlert,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchSchemeBySlugOrId, recordSchemeView } from '../services/api';
import type { Scheme } from '../types';

export const SchemeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { token } = useAuth();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    fetchSchemeBySlugOrId(slug)
      .then((item) => {
        if (active) {
          setScheme(item);
          if (token) {
            recordSchemeView(item.id, token);
          }
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Scheme not found');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, token]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-72 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#17613A]">Scheme Not Found</h1>
        <p className="mt-2 text-sm text-[#303030]/80">{error}</p>
        <Link
          to="/schemes"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#17613A] text-white text-sm font-semibold rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/schemes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#17613A] hover:text-[#F47721] mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Government Schemes</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-md p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#207747]">
          <span>{scheme.governmentLevel} Government</span>
          <span aria-hidden="true">·</span>
          <span>{scheme.stateName}</span>
          <span aria-hidden="true">·</span>
          <span>{scheme.category}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-[#303030]/75 tabular-nums">
            <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Last verified: {scheme.lastVerifiedDate}
          </span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#17613A] leading-tight">
          {scheme.name}
        </h1>

        <p className="mt-4 text-base text-[#303030] leading-relaxed">
          {scheme.overview}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F47721] hover:bg-[#d96312] text-white text-sm font-semibold rounded transition-colors"
          >
            <span>Visit Official Application Portal</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>

          <Link
            to={`/eligibility?schemeId=${scheme.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#17613A] hover:bg-[#207747] text-white text-sm font-semibold rounded transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Check Preliminary Eligibility</span>
          </Link>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <section className="bg-white border border-[#E5E7EB] rounded-md p-6">
          <h2 className="text-lg font-bold text-[#17613A] mb-3">Objectives</h2>
          <ul className="space-y-2.5 text-sm text-[#303030]">
            {scheme.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#207747] shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Benefits */}
        <section className="bg-white border border-[#E5E7EB] rounded-md p-6">
          <h2 className="text-lg font-bold text-[#17613A] mb-3">Key Benefits</h2>
          <p className="text-sm text-[#303030] leading-relaxed">{scheme.benefits}</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <h3 className="text-sm font-bold text-[#17613A] mb-1.5">Eligibility Summary</h3>
            <p className="text-sm text-[#303030]/90 leading-relaxed">
              {scheme.eligibilitySummary}
            </p>
            {scheme.eligibilityRules?.notes?.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-xs text-[#303030]/80 list-disc pl-4">
                {scheme.eligibilityRules.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Required Documents */}
        <section className="bg-white border border-[#E5E7EB] rounded-md p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#17613A]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#17613A]">Required Documents</h2>
          </div>
          <ul className="space-y-2 text-sm text-[#303030]">
            {scheme.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-[#F5F8F5] border border-[#E5E7EB] text-xs font-bold text-[#17613A] flex items-center justify-center shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Application Procedure */}
        <section className="bg-white border border-[#E5E7EB] rounded-md p-6">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-5 h-5 text-[#17613A]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#17613A]">Application Procedure</h2>
          </div>
          <ol className="space-y-3 text-sm text-[#303030]">
            {scheme.applicationProcedure.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#17613A] text-white text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-md p-4 flex items-start gap-3 text-xs sm:text-sm text-[#303030]/90">
        <ShieldAlert className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          This summary is provided for educational awareness. Always confirm latest seasonal notifications, deadlines, and application forms directly on{' '}
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#17613A] font-semibold underline"
          >
            {scheme.officialUrl}
          </a>
          .
        </p>
      </div>
    </div>
  );
};
