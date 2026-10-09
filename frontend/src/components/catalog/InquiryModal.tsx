"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Building, Mail, Phone, User, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api";
import { CatalogItem } from "../../types/catalog";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItem;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, item }) => {
  const [formData, setFormData] = useState({
    nama_pengunjung: "",
    instansi: "",
    email: "",
    no_wa: "",
    pesan: `Halo Admin ${item.prodi?.nama_prodi || "Sekolah Vokasi"}, kami tertarik untuk bekerja sama / pengadaan produk "${item.nama_item}". Mohon informasi penawaran teknis dan kerja samanya.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.sendInquiry({
        catalog_item_id: item.id,
        nama_pengunjung: formData.nama_pengunjung,
        instansi: formData.instansi,
        email: formData.email,
        no_wa: formData.no_wa,
        pesan: formData.pesan,
      });
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-[#C5A059]/40 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-[#0F4C81] dark:text-[#C5A059] uppercase tracking-wider">
                Kerja Sama DUDI & Kemitraan
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Formulir Minat: {item.nama_item}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Pesan Kemitraan Terkirim!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 leading-relaxed">
                PIC dari {item.prodi?.nama_prodi || "Sekolah Vokasi UNS"} akan segera menghubungi instansi Anda via WhatsApp/Email.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-7 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#0A2540] text-white text-xs font-bold transition cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap / PIC Mitra
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.nama_pengunjung}
                    onChange={(e) => setFormData({ ...formData, nama_pengunjung: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instansi / Perusahaan / Industri
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.instansi}
                    onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                    placeholder="Contoh: PT Teknologi Inovasi Nusantara"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Kerja
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@perusahaan.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.no_wa}
                      onChange={(e) => setFormData({ ...formData, no_wa: e.target.value })}
                      placeholder="081234567890"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kebutuhan / Rencana Kerja Sama
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-[#0F4C81] hover:bg-[#0A2540] dark:bg-[#C5A059] dark:hover:bg-[#d4af37] text-white dark:text-[#0A2540] font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Mengirim Permohonan..." : "Kirim Pengajuan Kemitraan"}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
