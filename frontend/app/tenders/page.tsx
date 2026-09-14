"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { Trash2 } from "lucide-react";

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    gem_reference_no: "",
    title: "",
    category: "IT & Server Hardware",
    estimated_value: 5000000,
    closing_date: "2025-04-30T18:00:00",
    min_turnover_required: 1500000,
    msme_exemption_allowed: true,
    local_content_min_percentage: 50.0,
  });

  const loadTenders = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<any[]>("/tenders");
      setTenders(data || []);
    } catch (e) {
      console.error("Failed to load tenders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/tenders", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({
        gem_reference_no: "",
        title: "",
        category: "IT & Server Hardware",
        estimated_value: 5000000,
        closing_date: "2025-04-30T18:00:00",
        min_turnover_required: 1500000,
        msme_exemption_allowed: true,
        local_content_min_percentage: 50.0,
      });
      loadTenders();
    } catch (err: any) {
      alert(`Error creating tender: ${err.message}`);
    }
  };

  const handleDelete = async (tender: any) => {
    if (!confirm(`Delete tender ${tender.gem_reference_no}? Related bid data for this tender will also be removed.`)) return;

    try {
      await fetchApi(`/tenders/${tender.id}`, { method: "DELETE" });
      setTenders((prev) => prev.filter((t) => t.id !== tender.id));
    } catch (err: any) {
      alert(`Error deleting tender: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Tenders & Solicitations</h1>
              <p className="text-xs text-secondary">Active GeM solicitations and statutory compliance requirements</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Register New Tender</span>
            </button>
          </div>

          {/* Create Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest p-6 rounded-2xl max-w-lg w-full space-y-4 border border-outline-variant/40">
                <h2 className="font-bold text-lg text-on-surface">Register New GeM Solicitations</h2>
                <form onSubmit={handleCreate} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">GeM Reference Number</label>
                    <input
                      type="text"
                      required
                      placeholder="GEM/2025/B/99001"
                      value={form.gem_reference_no}
                      onChange={(e) => setForm({ ...form, gem_reference_no: e.target.value })}
                      className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Solicitation Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Procurement of High Performance Computing Nodes"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-2 bg-surface rounded border border-outline-variant/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Estimated Value (₹)</label>
                      <input
                        type="number"
                        required
                        value={form.estimated_value}
                        onChange={(e) => setForm({ ...form, estimated_value: Number(e.target.value) })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Min Turnover Required (₹)</label>
                      <input
                        type="number"
                        required
                        value={form.min_turnover_required}
                        onChange={(e) => setForm({ ...form, min_turnover_required: Number(e.target.value) })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Min Local Content (%)</label>
                      <input
                        type="number"
                        required
                        value={form.local_content_min_percentage}
                        onChange={(e) => setForm({ ...form, local_content_min_percentage: Number(e.target.value) })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded bg-surface border border-outline-variant/50 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-primary text-on-primary font-semibold"
                    >
                      Save Tender to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table or Empty State */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
            {tenders.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-secondary">gavel</span>
                <h3 className="font-bold text-base text-on-surface">No Tenders Registered Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Click 'Register New Tender' to create your first GeM solicitation record in PostgreSQL.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Register First Tender</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="bg-surface border-b border-outline-variant/40 font-bold uppercase text-secondary">
                    <tr>
                      <th className="py-3 px-4">Tender Ref ID</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Min Turnover</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {tenders.map((t) => (
                      <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold">{t.gem_reference_no}</td>
                        <td className="py-3.5 px-4 font-medium">{t.title}</td>
                        <td className="py-3.5 px-4 text-secondary">{t.category}</td>
                        <td className="py-3.5 px-4 font-mono">₹{t.estimated_value.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 font-mono">₹{t.min_turnover_required.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-container/20 text-primary">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(t)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-error hover:bg-error-container transition-colors"
                            title="Delete tender"
                            aria-label={`Delete tender ${t.gem_reference_no}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
