import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { SchemeCard } from '../components/SchemeCard';
import { fetchSchemes } from '../services/api';
import type { Scheme } from '../types';

export const SchemesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || 'All');
  const [farmerCategory, setFarmerCategory] = useState(searchParams.get('farmerCategory') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paramLevel = searchParams.get('level');
    if (paramLevel) setLevel(paramLevel);
    const paramSearch = searchParams.get('search');
    if (paramSearch !== null) setSearch(paramSearch);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchSchemes({
      search,
      level,
      category,
      state: stateFilter,
      farmerCategory,
      sort,
    })
      .then((rows) => {
        if (active) setSchemes(rows);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load schemes.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, level, category, stateFilter, farmerCategory, sort]);

  const resetFilters = () => {
    setSearch('');
    setLevel('All');
    setCategory('All');
    setStateFilter('All');
    setFarmerCategory('All');
    setSort('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Central &amp; State Agricultural Programmes
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          Government Schemes Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#303030]/85 max-w-3xl">
          Search and filter verified Central Government and Karnataka State agricultural schemes. Click any scheme to inspect full eligibility rules, required documents, and official application links.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-md p-4 sm:p-5 mb-8">
        <div className="flex items-center gap-2 text-sm font-bold text-[#17613A] mb-3">
          <Filter className="w-4 h-4" aria-hidden="true" />
          <span>Search &amp; Filter Schemes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative lg:col-span-2">
            <Search
              className="w-4 h-4 text-[#303030]/50 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scheme name or keyword..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded focus:outline-none focus:border-[#17613A]"
            />
          </div>

          <select
            aria-label="Government Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#17613A]"
          >
            <option value="All">All Governments</option>
            <option value="Central">Central Government</option>
            <option value="Karnataka">Karnataka Government</option>
          </select>

          <select
            aria-label="Scheme Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#17613A]"
          >
            <option value="All">All Categories</option>
            <option value="Income Support">Income Support</option>
            <option value="Crop Insurance">Crop Insurance</option>
            <option value="Agricultural Credit">Agricultural Credit</option>
            <option value="Soil Management">Soil Management</option>
            <option value="Solar & Irrigation">Solar &amp; Irrigation</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Irrigation & Soil Conservation">Irrigation &amp; Soil Conservation</option>
            <option value="Farm Mechanization">Farm Mechanization</option>
          </select>

          <select
            aria-label="State"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#17613A]"
          >
            <option value="All">All States</option>
            <option value="All India">All India (Central)</option>
            <option value="Karnataka">Karnataka</option>
          </select>

          <select
            aria-label="Farmer Category"
            value={farmerCategory}
            onChange={(e) => setFarmerCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white focus:outline-none focus:border-[#17613A]"
          >
            <option value="All">All Farmer Categories</option>
            <option value="Marginal (< 1 ha)">Marginal (&lt; 1 ha)</option>
            <option value="Small (1-2 ha)">Small (1-2 ha)</option>
            <option value="Semi-Medium (2-4 ha)">Semi-Medium (2-4 ha)</option>
            <option value="Medium (4-10 ha)">Medium (4-10 ha)</option>
            <option value="Landless / Tenant">Landless / Tenant</option>
          </select>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#303030]/80 tabular-nums">
            Showing {schemes.length} scheme{schemes.length === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-3">
            <select
              aria-label="Sort schemes"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded bg-white"
            >
              <option value="popular">Sort: Popular First</option>
              <option value="name_asc">Sort: Name (A–Z)</option>
              <option value="name_desc">Sort: Name (Z–A)</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#F47721] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-md p-10 text-center">
          <p className="text-base font-semibold text-[#17613A]">
            No schemes matched your current search or filter criteria.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 px-5 py-2 bg-[#17613A] text-white text-sm font-semibold rounded"
          >
            Show All Schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};
