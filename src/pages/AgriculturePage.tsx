import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sprout, Layers, PawPrint, Leaf, FlaskConical, Cpu } from 'lucide-react';
import { fetchAgricultureItems } from '../services/api';
import type { AgricultureItem } from '../types';

const SECTIONS = [
  { key: 'crop', label: 'Crops', icon: Sprout, desc: 'Climate, soil, seasonal timing, and field management for major Indian crops.' },
  { key: 'soil', label: 'Soil Information', icon: Layers, desc: 'Characteristics, water retention, suitable crops, and soil health practices.' },
  { key: 'animal', label: 'Farm Animals', icon: PawPrint, desc: 'Cattle, buffalo, goat, sheep, and backyard poultry housing and care.' },
  { key: 'organic', label: 'Organic Farming', icon: Leaf, desc: 'Composting, vermicompost, green manuring, and natural farming practices.' },
  { key: 'inorganic', label: 'Inorganic Farming', icon: FlaskConical, desc: 'Balanced NPK fertilizer stewardship and safe agrochemical handling.' },
  { key: 'technology', label: 'Modern Technologies', icon: Cpu, desc: 'Drip irrigation, sprinklers, greenhouse farming, and agricultural machinery.' },
];

export const AgriculturePage: React.FC = () => {
  const { section = 'crop' } = useParams<{ section: string }>();
  const activeMeta = SECTIONS.find((s) => s.key === section) || SECTIONS[0];

  const [items, setItems] = useState<AgricultureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAgricultureItems(activeMeta.key)
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeMeta.key]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Agricultural Education Module
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          {activeMeta.label}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#303030]/85 max-w-3xl">
          {activeMeta.desc}
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E5E7EB] pb-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isCurrent = s.key === activeMeta.key;
          return (
            <Link
              key={s.key}
              to={`/agriculture/${s.key}`}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded border transition-colors whitespace-nowrap ${
                isCurrent
                  ? 'bg-[#17613A] text-white border-[#17613A]'
                  : 'bg-white text-[#303030] border-[#E5E7EB] hover:border-[#17613A]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{s.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#E5E7EB] rounded-md p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-[#F47721]">
                  {item.subtitle}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#17613A]">
                  {item.title}
                </h2>
                <p className="mt-2.5 text-sm text-[#303030] leading-relaxed">
                  {item.summary}
                </p>

                <dl className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2 text-sm">
                  {Object.entries(item.details).map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-semibold text-[#17613A] inline">{k}: </dt>
                      <dd className="text-[#303030] inline">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {item.highlights && item.highlights.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-xs font-medium text-[#207747]">
                  {item.highlights.join(' · ')}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
