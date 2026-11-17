import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trash2, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AgricultureItem, Scheme } from '../types';

interface AdminFarmerRow {
  id: number;
  email: string;
  fullName: string;
  mobileNumber?: string | null;
  role: string;
  state?: string | null;
  district?: string | null;
  farmerCategory?: string | null;
  mainCrop?: string | null;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<'schemes' | 'farmers' | 'agriculture'>('schemes');
  const [farmers, setFarmers] = useState<AdminFarmerRow[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [agriItems, setAgriItems] = useState<AgricultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Scheme Form
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [governmentLevel, setGovernmentLevel] = useState<'Central' | 'Karnataka'>('Central');
  const [category, setCategory] = useState('Income Support');
  const [overview, setOverview] = useState('');
  const [benefits, setBenefits] = useState('');
  const [officialUrl, setOfficialUrl] = useState('https://www.myscheme.gov.in/');

  // Add Agriculture Form
  const [agriSection, setAgriSection] = useState('crop');
  const [agriTitle, setAgriTitle] = useState('');
  const [agriSubtitle, setAgriSubtitle] = useState('');
  const [agriSummary, setAgriSummary] = useState('');

  const loadAdmin = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load admin overview.');
      setFarmers(data.farmers || []);
      setSchemes(data.schemes || []);
      setAgriItems(data.agricultureItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadAdmin(token);
    }
  }, [token, user]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
      </div>
    );
  }

  if (!user || !token) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#17613A]">Admin Access Required</h1>
        <p className="mt-2 text-sm text-[#303030]/80">
          This dashboard is restricted to platform administrators.
        </p>
      </div>
    );
  }

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          shortName,
          governmentLevel,
          category,
          overview,
          benefits,
          officialUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to add scheme');
      }
      setName('');
      setShortName('');
      setOverview('');
      setBenefits('');
      await loadAdmin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scheme.');
    }
  };

  const handleDeleteScheme = async (id: number) => {
    await fetch(`/api/admin/schemes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdmin(token);
  };

  const handleAddAgri = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/agriculture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: agriSection,
          title: agriTitle,
          subtitle: agriSubtitle,
          summary: agriSummary,
        }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      setAgriTitle('');
      setAgriSubtitle('');
      setAgriSummary('');
      await loadAdmin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item.');
    }
  };

  const handleDeleteAgri = async (id: number) => {
    await fetch(`/api/admin/agriculture/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdmin(token);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F47721]">
            <ShieldCheck className="w-4 h-4" />
            Protected Administration
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
            Platform Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab('schemes')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded border ${
              tab === 'schemes'
                ? 'bg-[#17613A] text-white border-[#17613A]'
                : 'bg-white text-[#303030] border-[#E5E7EB]'
            }`}
          >
            Schemes ({schemes.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('farmers')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded border ${
              tab === 'farmers'
                ? 'bg-[#17613A] text-white border-[#17613A]'
                : 'bg-white text-[#303030] border-[#E5E7EB]'
            }`}
          >
            Registered Users ({farmers.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('agriculture')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded border ${
              tab === 'agriculture'
                ? 'bg-[#17613A] text-white border-[#17613A]'
                : 'bg-white text-[#303030] border-[#E5E7EB]'
            }`}
          >
            Agriculture Guides ({agriItems.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
      ) : tab === 'schemes' ? (
        <div className="space-y-6">
          <form
            onSubmit={handleAddScheme}
            className="bg-white border border-[#E5E7EB] rounded-md p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-[#17613A] flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Government Scheme</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="Full Scheme Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded sm:col-span-2"
              />
              <input
                type="text"
                required
                placeholder="Short Name (e.g., PM-KISAN)"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
              <select
                value={governmentLevel}
                onChange={(e) =>
                  setGovernmentLevel(e.target.value as 'Central' | 'Karnataka')
                }
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
              >
                <option value="Central">Central</option>
                <option value="Karnataka">Karnataka</option>
              </select>
              <input
                type="text"
                required
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
              <input
                type="url"
                required
                placeholder="Official Portal URL"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded sm:col-span-3"
              />
              <textarea
                required
                rows={2}
                placeholder="Verified Scheme Overview"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded sm:col-span-2"
              />
              <textarea
                required
                rows={2}
                placeholder="Verified Scheme Benefits"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded sm:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F47721] hover:bg-[#d96312] text-white text-sm font-semibold rounded"
            >
              Publish Scheme Record
            </button>
          </form>

          <div className="bg-white border border-[#E5E7EB] rounded-md overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8F5] border-b border-[#E5E7EB] text-xs uppercase text-[#17613A]">
                <tr>
                  <th className="p-3.5">Scheme</th>
                  <th className="p-3.5">Level</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Verified</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {schemes.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3.5 font-semibold text-[#17613A]">{s.name}</td>
                    <td className="p-3.5">{s.governmentLevel}</td>
                    <td className="p-3.5">{s.category}</td>
                    <td className="p-3.5 tabular-nums">{s.lastVerifiedDate}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteScheme(s.id)}
                        aria-label={`Delete ${s.shortName}`}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'farmers' ? (
        <div className="bg-white border border-[#E5E7EB] rounded-md overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F8F5] border-b border-[#E5E7EB] text-xs uppercase text-[#17613A]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">State / District</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Main Crop</th>
                <th className="p-3.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {farmers.map((f) => (
                <tr key={f.id}>
                  <td className="p-3.5 font-semibold">{f.fullName}</td>
                  <td className="p-3.5">{f.email}</td>
                  <td className="p-3.5">
                    {f.state || '—'} {f.district ? `/ ${f.district}` : ''}
                  </td>
                  <td className="p-3.5">{f.farmerCategory || '—'}</td>
                  <td className="p-3.5">{f.mainCrop || '—'}</td>
                  <td className="p-3.5 font-semibold text-[#17613A]">{f.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <form
            onSubmit={handleAddAgri}
            className="bg-white border border-[#E5E7EB] rounded-md p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-[#17613A]">
              Add Agriculture Knowledge Item
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={agriSection}
                onChange={(e) => setAgriSection(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
              >
                <option value="crop">Crops</option>
                <option value="soil">Soil Information</option>
                <option value="animal">Farm Animals</option>
                <option value="organic">Organic Farming</option>
                <option value="inorganic">Inorganic Farming</option>
                <option value="technology">Modern Technologies</option>
              </select>
              <input
                type="text"
                required
                placeholder="Title"
                value={agriTitle}
                onChange={(e) => setAgriTitle(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
              <input
                type="text"
                required
                placeholder="Subtitle"
                value={agriSubtitle}
                onChange={(e) => setAgriSubtitle(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded"
              />
              <textarea
                required
                rows={2}
                placeholder="Educational summary"
                value={agriSummary}
                onChange={(e) => setAgriSummary(e.target.value)}
                className="px-3 py-2 text-sm border border-[#E5E7EB] rounded sm:col-span-3"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#17613A] hover:bg-[#207747] text-white text-sm font-semibold rounded"
            >
              Add Knowledge Item
            </button>
          </form>

          <div className="bg-white border border-[#E5E7EB] rounded-md overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8F5] border-b border-[#E5E7EB] text-xs uppercase text-[#17613A]">
                <tr>
                  <th className="p-3.5">Section</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Subtitle</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {agriItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3.5 uppercase text-xs font-bold text-[#207747]">
                      {item.section}
                    </td>
                    <td className="p-3.5 font-semibold">{item.title}</td>
                    <td className="p-3.5">{item.subtitle}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteAgri(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
