"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { Trash2 } from "lucide-react";

export default function BiddersPage() {
  const [bidders, setBidders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    legal_status: "Private Limited",
    gstin: "",
    pan: "",
    cin: "",
    udyam_reg_no: "",
    address: "",
    contact_email: "",
    contact_phone: "",
  });

  const loadBidders = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<any[]>("/bidders");
      setBidders(data || []);
    } catch (e) {
      console.error("Failed to load bidders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBidders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/bidders", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({
        company_name: "",
        legal_status: "Private Limited",
        gstin: "",
        pan: "",
        cin: "",
        udyam_reg_no: "",
        address: "",
        contact_email: "",
        contact_phone: "",
      });
      loadBidders();
    } catch (err: any) {
      alert(`Error registering bidder: ${err.message}`);
    }
  };

  const handleDelete = async (bidder: any) => {
    if (!confirm(`Delete bidder ${bidder.company_name}? Related bid and document data for this bidder will also be removed.`)) return;

    try {
      await fetchApi(`/bidders/${bidder.id}`, { method: "DELETE" });
      setBidders((prev) => prev.filter((b) => b.id !== bidder.id));
    } catch (err: any) {
      alert(`Error deleting bidder: ${err.message}`);
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
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Bidder Directory & Profiles</h1>
              <p className="text-xs text-secondary">Verified statutory identifiers, PAN, GSTIN, and central debarment status</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Register New Bidder Entity</span>
            </button>
          </div>

          {/* Modal Form */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest p-6 rounded-2xl max-w-lg w-full space-y-4 border border-outline-variant/40">
                <h2 className="font-bold text-lg text-on-surface">Register New Bidder Entity</h2>
                <form onSubmit={handleCreate} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="TechServe India Pvt Ltd"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      className="w-full p-2 bg-surface rounded border border-outline-variant/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">GSTIN (15 Digits)</label>
                      <input
                        type="text"
                        required
                        placeholder="07AAAAA0000A1Z5"
                        value={form.gstin}
                        onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">PAN (10 Digits)</label>
                      <input
                        type="text"
                        required
                        placeholder="AAAAA0000A"
                        value={form.pan}
                        onChange={(e) => setForm({ ...form, pan: e.target.value })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Legal Status</label>
                      <select
                        value={form.legal_status}
                        onChange={(e) => setForm({ ...form, legal_status: e.target.value })}
                        className="w-full p-2 bg-surface rounded border border-outline-variant/50"
                      >
                        <option value="Private Limited">Private Limited</option>
                        <option value="LLP">LLP</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Public Limited">Public Limited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Udyam Reg No</label>
                      <input
                        type="text"
                        placeholder="UDYAM-DL-03-0019283"
                        value={form.udyam_reg_no}
                        onChange={(e) => setForm({ ...form, udyam_reg_no: e.target.value })}
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
                      Save Bidder to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table or Empty State */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
            {bidders.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-secondary">corporate_fare</span>
                <h3 className="font-bold text-base text-on-surface">No Bidders Registered Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Click 'Register New Bidder Entity' to insert a company profile into the platform database.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Register First Bidder</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="bg-surface border-b border-outline-variant/40 font-bold uppercase text-secondary">
                    <tr>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Legal Status</th>
                      <th className="py-3 px-4">GSTIN</th>
                      <th className="py-3 px-4">PAN</th>
                      <th className="py-3 px-4">Udyam No</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {bidders.map((b) => (
                      <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3.5 px-4 font-bold text-on-surface">{b.company_name}</td>
                        <td className="py-3.5 px-4 text-secondary">{b.legal_status}</td>
                        <td className="py-3.5 px-4 font-mono">{b.gstin || "N/A"}</td>
                        <td className="py-3.5 px-4 font-mono">{b.pan || "N/A"}</td>
                        <td className="py-3.5 px-4 font-mono text-secondary">{b.udyam_reg_no || "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold text-[10px]">
                            {b.risk_level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(b)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-error hover:bg-error-container transition-colors"
                            title="Delete bidder"
                            aria-label={`Delete bidder ${b.company_name}`}
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
