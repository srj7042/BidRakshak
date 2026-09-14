"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { Upload, FileText, Eye, CheckCircle2, X, FileCheck, Trash2 } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [bidders, setBidders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedBidderId, setSelectedBidderId] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("BALANCE_SHEET");
  const [dragActive, setDragActive] = useState(false);
  
  // Document Viewer Modal State
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [docsRes, biddersRes] = await Promise.all([
        fetchApi<any[]>("/documents").catch(() => []),
        fetchApi<any[]>("/bidders").catch(() => []),
      ]);
      setDocuments(docsRes || []);
      setBidders(biddersRes || []);
      if (biddersRes && biddersRes.length > 0) {
        setSelectedBidderId(biddersRes[0].id);
      }
    } catch (e) {
      console.error("Failed to load documents data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", documentType);
      formData.append("bidder_id", selectedBidderId || "bdr-default");

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const newDoc = await res.json();
      setDocuments((prev) => [newDoc, ...prev]);
      if (newDoc.saved_bidders?.length) {
        setBidders((prev) => {
          const byId = new Map(prev.map((bidder) => [bidder.id, bidder]));
          newDoc.saved_bidders.forEach((bidder: any) => byId.set(bidder.id, bidder));
          return Array.from(byId.values());
        });
      }
      const savedCount = newDoc.saved_bidders?.length || 0;
      alert(
        savedCount
          ? `File '${file.name}' processed. ${savedCount} bidder(s) saved and compliance checked.`
          : `File '${file.name}' uploaded and processed successfully!`
      );
    } catch (err: any) {
      alert(`Error uploading file: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (document: any) => {
    if (!confirm(`Delete document ${document.file_name}?`)) return;

    try {
      await fetchApi(`/documents/${document.id}`, { method: "DELETE" });
      setDocuments((prev) => prev.filter((d) => d.id !== document.id));
      if (selectedDoc?.id === document.id) setSelectedDoc(null);
    } catch (err: any) {
      alert(`Error deleting document: ${err.message}`);
    }
  };

  const formatFieldName = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatFieldValue = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString("en-IN");
    }
    if (Array.isArray(value) || typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Document Center & Upload Workspace</h1>
              <p className="text-xs text-secondary">Drag-and-drop document upload, file storage metadata, and OCR field extraction</p>
            </div>
            {bidders.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-secondary">Target Bidder Entity:</label>
                <select
                  value={selectedBidderId}
                  onChange={(e) => setSelectedBidderId(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary text-on-surface"
                >
                  {bidders.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.company_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Upload Settings & Options */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <label className="font-semibold text-secondary">Document Category:</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="bg-surface border border-outline-variant/40 rounded-md px-3 py-1 text-xs focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="BIDDER_SUBMISSION">Bidder Submission PDF / Vendor Dossier</option>
                <option value="BALANCE_SHEET">Audited Balance Sheet & Financials</option>
                <option value="GST_CERTIFICATE">GSTIN Registration Certificate</option>
                <option value="MSME_UDYAM">Udyam MSME Certificate</option>
                <option value="OEM_AUTHORIZATION">OEM Authorization Certificate (MAEF)</option>
                <option value="LOCAL_CONTENT_DECLARATION">Local Content Self-Declaration</option>
                <option value="TECHNICAL_COMPLIANCE">Technical Specification Compliance</option>
              </select>
            </div>
          </div>

          {/* Hidden HTML File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-surface-container-lowest rounded-xl p-8 border-2 border-dashed text-center space-y-4 transition-all cursor-pointer ${
              dragActive ? "border-primary bg-primary-container/10" : "border-outline-variant/60 hover:border-primary"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">
                {uploading ? "Uploading & Extracting Document Fields..." : "Drag & Drop Bidder Submission PDFs / Images here"}
              </p>
              <p className="text-xs text-secondary mt-1">Supports PDF, JPG, PNG up to 25MB. Files stored in document vault.</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={uploading}
              className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/50 text-xs font-semibold hover:bg-surface-container text-on-surface"
            >
              {uploading ? "Uploading..." : "Browse Local Computer Files"}
            </button>
          </div>

          {/* Processed Documents Table */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
            <h2 className="font-bold text-sm text-on-surface">Processed Documents</h2>
            {documents.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-surface rounded-xl border border-outline-variant/30">
                <FileText className="w-8 h-8 text-secondary mx-auto" />
                <h3 className="font-bold text-sm text-on-surface">No Processed Documents Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Drag and drop bidder files above or click 'Browse Local Computer Files' to upload and inspect documents.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="bg-surface border-b border-outline-variant/40 font-bold uppercase text-secondary">
                    <tr>
                      <th className="py-3 px-4">File Name</th>
                      <th className="py-3 px-4">Document Category</th>
                      <th className="py-3 px-4">File Size</th>
                      <th className="py-3 px-4">OCR Status</th>
                      <th className="py-3 px-4">Upload Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {documents.map((d) => (
                      <tr key={d.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{d.file_name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-secondary font-medium">{d.document_type}</td>
                        <td className="py-3.5 px-4 text-secondary font-mono">
                          {d.file_size_bytes ? `${(d.file_size_bytes / 1024).toFixed(1)} KB` : "102 KB"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold text-[10px] uppercase">
                            {d.confidence_score ? `${d.confidence_score}% OCR` : "PROCESSED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-secondary">
                          {d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : "Today"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedDoc(d)}
                            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Open & Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(d)}
                            className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-md text-error hover:bg-error-container transition-colors align-middle"
                            title="Delete document"
                            aria-label={`Delete document ${d.file_name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Document Viewer Modal */}
          {selectedDoc && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest p-6 rounded-2xl max-w-2xl w-full space-y-4 border border-outline-variant/40">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/10 text-primary">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-on-surface">{selectedDoc.file_name}</h2>
                      <p className="text-xs text-secondary font-mono">Document ID: {selectedDoc.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-1 rounded-full hover:bg-surface-container text-secondary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40 space-y-1">
                    <span className="text-secondary font-semibold">Document Category</span>
                    <p className="font-bold text-on-surface">{selectedDoc.document_type}</p>
                  </div>

                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40 space-y-1">
                    <span className="text-secondary font-semibold">MIME / Content Type</span>
                    <p className="font-mono font-bold text-on-surface">{selectedDoc.mime_type || "application/pdf"}</p>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-2">
                  <h3 className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Scanned Bidder Details From Document</span>
                  </h3>
                  {selectedDoc.extracted_fields ? (
                    <div className="space-y-3">
                      {selectedDoc.extracted_fields.bidder_profiles?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-bold text-secondary">Saved Bidder Profiles</p>
                          {selectedDoc.extracted_fields.bidder_profiles.map((profile: any, index: number) => {
                            const compliance = selectedDoc.extracted_fields.compliance_results?.[index];
                            return (
                              <div key={`${profile.gstin || profile.pan || index}`} className="bg-surface-container-lowest p-3 rounded border border-outline-variant/30 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-bold text-on-surface">{profile.company_name || "Extracted Bidder"}</p>
                                  {compliance && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      compliance.risk_level === "LOW" ? "bg-success-container text-success" : "bg-error-container text-error"
                                    }`}>
                                      {compliance.risk_level} RISK - {compliance.overall_score}%
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {Object.entries(profile).map(([key, value]) => (
                                    <div key={key} className="space-y-0.5">
                                      <p className="text-[10px] uppercase font-bold text-secondary">{formatFieldName(key)}</p>
                                      <p className="font-mono text-[11px] text-on-surface break-words">{formatFieldValue(value)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(selectedDoc.extracted_fields)
                          .filter(([key]) => !["raw_text_preview", "extracted_at", "bidder_profiles", "saved_bidders", "compliance_results"].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="bg-surface-container-lowest p-3 rounded border border-outline-variant/30 space-y-1">
                              <p className="text-[10px] uppercase font-bold text-secondary">{formatFieldName(key)}</p>
                              <p className="font-mono text-[11px] text-on-surface break-words">{formatFieldValue(value)}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="font-mono text-[11px] text-on-surface bg-surface-container-lowest p-3 rounded border border-outline-variant/30">
                      No extracted fields found for this document. Upload it again to run the scanner.
                    </div>
                  )}
                  <div className="font-mono text-[11px] text-on-surface space-y-1 bg-surface-container-lowest p-3 rounded border border-outline-variant/30">
                    <p><strong>Storage Path:</strong> {selectedDoc.file_path || `/storage/bid-documents/${selectedDoc.file_name}`}</p>
                    <p><strong>Statutory Compliance Check:</strong> {selectedDoc.extracted_fields ? "SCANNED & PARSED" : "PENDING RESCAN"}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/50 font-semibold text-xs text-on-surface"
                  >
                    Close Viewer
                  </button>
                  <button
                    onClick={() => handleDelete(selectedDoc)}
                    className="px-4 py-2 rounded-lg bg-error text-on-error font-semibold text-xs inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
