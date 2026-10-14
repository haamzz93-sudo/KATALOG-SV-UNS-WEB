# -*- coding: utf-8 -*-
"""
Script Generator PDF: Laporan Implementasi Sistem AI Katalog Vokasi UNS
Font: Times New Roman (Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic)
Dokumen 7 Halaman Terstruktur Rapi Sesuai Kaidah Akademik & Standar Institusi UNS
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class AcademicNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(AcademicNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(AcademicNumberedCanvas, self).showPage()
        super(AcademicNumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            return  # Jangan cetak header & footer di cover

        self.saveState()
        self.setFont("Times-Roman", 8.5)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (Atas)
        self.drawString(54, 802, "Laporan Implementasi Teknis AI Catalog Studio | Sekolah Vokasi UNS")
        self.drawRightString(541, 802, "https://spsbu.unsmadiun.id")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 796, 541, 796)
        
        # Footer (Bawah)
        self.line(54, 46, 541, 46)
        self.drawString(54, 34, "Dokumen Resmi Hilirisasi Riset Terapan D3 Teknik Informatika - UNS Kampus Madiun")
        page_text = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(541, 34, page_text)
        self.restoreState()

def generate_academic_pdf(output_path):
    # Setup Dokumen A4 dengan Margin Standar Akademik (Top/Bottom 54pt, Left/Right 54pt ~ 1.9 cm)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Skema Warna Institusi Resmi UNS
    NAVY = colors.HexColor("#0F4C81")       # UNS Signature Navy
    GOLD = colors.HexColor("#C5A059")       # UNS Signature Gold
    DARK = colors.HexColor("#1E293B")       # Dark Charcoal
    SLATE = colors.HexColor("#475569")      # Muted Slate
    LIGHT_BG = colors.HexColor("#F8FAFC")   # Crisp Light Background
    BORDER_CLR = colors.HexColor("#CBD5E1") # Clean Border

    # Definisi Gaya Teks Berbasis Times New Roman
    title_cover = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=18,
        leading=23,
        textColor=NAVY,
        alignment=1,
        spaceAfter=12
    )

    subtitle_cover = ParagraphStyle(
        'CoverSubTitle',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=16,
        textColor=SLATE,
        alignment=1,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=13,
        leading=17,
        textColor=NAVY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10.5,
        leading=14,
        textColor=DARK,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=13.8,
        textColor=DARK,
        alignment=4, # Justified
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9,
        leading=13,
        textColor=DARK,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=2
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8,
        leading=11,
        textColor=DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Times-Bold'
    )

    story = []

    # ==================== HALAMAN 1: COVER DOKUMEN ====================
    story.append(Spacer(1, 25))
    story.append(Paragraph("UNIVERSITAS SEBELAS MARET", ParagraphStyle('UnivHeader', fontName='Times-Bold', fontSize=14, leading=18, alignment=1, textColor=NAVY)))
    story.append(Paragraph("SEKOLAH VOKASI - KAMPUS MADIUN", ParagraphStyle('FacultyHeader', fontName='Times-Bold', fontSize=11, leading=15, alignment=1, textColor=GOLD)))
    story.append(Paragraph("PROGRAM STUDI D3 TEKNIK INFORMATIKA", ParagraphStyle('ProdiHeader', fontName='Times-Roman', fontSize=10, leading=14, alignment=1, textColor=SLATE)))
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=2, color=GOLD, spaceBefore=4, spaceAfter=20))

    story.append(Spacer(1, 25))
    story.append(Paragraph("DOKUMEN IMPLEMENTASI TEKNIS & PANDUAN PEMAHAMAN SISTEM", title_cover))
    story.append(Paragraph("SISTEM GENERATOR 4 FOTO MARKETPLACE BERBASIS MULTIMODAL ARTIFICIAL INTELLIGENCE DENGAN MASTER CONSISTENCY RULE UNTUK KATALOG PRODUK INOVASI HILIRISASI", subtitle_cover))
    story.append(Spacer(1, 20))

    meta_data = [
        [Paragraph("<b>Status Sistem:</b>", table_cell), Paragraph("<font color='#059669'><b>Aktif / Live Production (100% Terverifikasi)</b></font>", table_cell)],
        [Paragraph("<b>Domain Produksi Resmi:</b>", table_cell), Paragraph("<b>https://spsbu.unsmadiun.id</b>", table_cell)],
        [Paragraph("<b>Aplikasi / Platform:</b>", table_cell), Paragraph("Aplikasi Cosco (Katalog Inovasi Hilirisasi Sekolah Vokasi UNS)", table_cell)],
        [Paragraph("<b>Model Kecerdasan Buatan:</b>", table_cell), Paragraph("Google Gemini 2.5 Flash Multimodal Reasoning + Pollinations Turbo HD", table_cell)],
        [Paragraph("<b>Dosen Pembimbing:</b>", table_cell), Paragraph("<b>Darmawan Lahru Riatma, S.Kom., M.MT.</b><br/>NIP. 198904242019031012", table_cell)],
        [Paragraph("<b>Disusun Oleh:</b>", table_cell), Paragraph("<b>Tim Teknis Pengembang Aplikasi Cosco</b><br/>Tim Administrator & Pengembang TI", table_cell)],
        [Paragraph("<b>Unit Pengelola:</b>", table_cell), Paragraph("Unit Sistem Informasi & Transformasi Digital<br/>Sekolah Vokasi UNS Kampus Madiun", table_cell)],
        [Paragraph("<b>Tanggal Penerbitan:</b>", table_cell), Paragraph("Rabu, 14 Oktober 2026", table_cell)],
    ]
    t_meta = Table(meta_data, colWidths=[140, 347])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, BORDER_CLR),
    ]))
    story.append(t_meta)

    story.append(Spacer(1, 35))
    story.append(Paragraph(
        "<i>\"Dokumen ini disusun sebagai wujud pertanggungjawaban ilmiah dan rekayasa perangkat lunak dalam menghadirkan standardisasi visual komersial pada produk hilirisasi 39 Program Studi Sekolah Vokasi UNS guna menarik kemitraan Dunia Usaha dan Dunia Industri (DUDI).\"</i>",
        ParagraphStyle('CalloutCover', fontName='Times-Italic', fontSize=9, leading=13.5, alignment=1, textColor=NAVY)
    ))
    story.append(PageBreak())

    # ==================== HALAMAN 2: BAB I PENDAHULUAN ====================
    story.append(Paragraph("BAB I: PENDAHULUAN & LATAR BELAKANG", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("<b>1.1 Urgensi Standardisasi Visual Inovasi Vokasi</b>", h2_style))
    story.append(Paragraph(
        "Sekolah Vokasi Universitas Sebelas Maret (UNS) menaungi 39 Program Studi yang aktif memproduksi inovasi riset terapan unggulan di berbagai lini, mulai dari perangkat lunak cerdas, mesin robotika, olahan pangan fungsional, formulasi obat herbal, hingga bahan kimia industri. Namun, dalam proses hilirisasi ke mitra industri (DUDI), muncul kendala nyata: <b>kualitas dokumentasi visual produk yang belum memenuhi standar etalase profesional</b>. Mayoritas foto produk yang diunggah masih berupa foto mentah kamera ponsel pintar berlatar meja praktikum atau lantai laboratorium.",
        body_style
    ))
    story.append(Paragraph(
        "Berdasarkan riset perilaku konsumen pasar digital modern (e-commerce), lebih dari 90% ketertarikan awal dan keputusan calon pembeli dipengaruhi oleh impresi visual pertama. Foto yang buram, sudut pengambilan yang tidak tepat, dan pencahayaan minim langsung menurunkan persepsi nilai inovasi (<i>perceived value</i>), meskipun produk tersebut memiliki keunggulan riset yang sangat tinggi.",
        body_style
    ))

    story.append(Paragraph("<b>1.2 Kesenjangan (Gap) Teknis yang Diselesaikan</b>", h2_style))
    story.append(Paragraph(
        "Sebelum adanya subsistem ini, setiap prodi memiliki kendala anggaran dan keahlian fotografi komersial untuk membuat aset visual berstandar katalog brand ternama. Menyewa fotografer profesional dan desainer grafis untuk ratusan produk riset mahasiswa/dosen memerlukan biaya besar dan waktu lama. Dibutuhkan suatu sistem otomasi cerdas yang dapat menghasilkan paket foto visual berkualitas tinggi secara instan, konsisten, dan mudah digunakan langsung dari ponsel atau komputer kerja.",
        body_style
    ))

    story.append(Paragraph("<b>1.3 Solusi: Studio Foto Visual Katalog Berbasis Multimodal AI</b>", h2_style))
    story.append(Paragraph(
        "Platform <code>spsbu.unsmadiun.id</code> menghadirkan modul <b>AI Studio Foto Visual</b> yang mengintegrasikan kecerdasan multimodal Google Gemini 2.5 Flash dan mesin sintesis visual berkecepatan tinggi. Sistem ini mengonversi satu foto produk mentah menjadi <b>1 paket komplit berisi 4 foto standar marketplace komersial</b> (Foto Utama, Detail Material, Infografis Fitur, dan Konteks Lifestyle) yang memiliki identitas visual seragam tanpa mengubah bentuk, warna, atau logo asli produk.",
        body_style
    ))

    story.append(Paragraph("<b>1.4 Keamanan Identitas Produk (Prinsip Zero-Hallucination)</b>", h2_style))
    story.append(Paragraph(
        "Kelemahan umum penggunaan AI generatif adalah kecenderungan 'berhalusinasi' (mengubah logo kampus/prodi, mengganti warna kemasan, atau menambahkan tombol/tombol fiktif). Melalui formulasi instruksi terstruktur dan <i>Master Consistency Rule</i>, sistem ini mengunci seluruh parameter penting produk asli sehingga foto yang dihasilkan tetap setia 100% pada wujud fisik aslinya.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== HALAMAN 3: BAB II ARSITEKTUR 4 FOTO ====================
    story.append(Paragraph("BAB II: FORMULA 4 FOTO MARKETPLACE & KETENTUAN PATEN", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "Format 4 foto disusun secara sistematis mengikuti hierarki psikologis pengambilan keputusan pembeli (<i>Consumer Buying Decision Journey</i>): <b>1. Menarik Perhatian → 2. Meyakinkan Kualitas → 3. Memahami Keunggulan → 4. Membayangkan Penggunaan Nyata</b>.",
        body_style
    ))

    # Tabel 4 Foto Matriks
    photo_matrix = [
        [Paragraph("Tipe Foto", table_header), Paragraph("Fokus & Komposisi Visual", table_header), Paragraph("Input Pengguna & Ketentuan Paten", table_header)],
        [
            Paragraph("<b>FOTO 1<br/>Hero Product<br/>(Foto Utama)</b>", table_cell_bold),
            Paragraph("Focal point utama di atas podium minimalis (ivory/light grey), soft studio rim lighting, bayangan lembut alami, whitespace cukup.", table_cell),
            Paragraph("<b>Input:</b> Nama Produk, Tagline, dan 6 Kategori Resmi.<br/><b>Paten:</b> Menjaga 100% bentuk, warna, logo, label, tulisan, dan kemasan asli tanpa distorsi.", table_cell)
        ],
        [
            Paragraph("<b>FOTO 2<br/>Detail & Quality<br/>(Craftsmanship)</b>", table_cell_bold),
            Paragraph("Tampilan editorial makro close-up (3–5 titik) yang memperlihatkan tekstur material, kerapian finishing, dan bagian fungsional.", table_cell),
            Paragraph("<b>Input:</b> Multi-select tag terverifikasi (<i>Detail Material, Finishing Rapi, Desain Presisi, Tekstur Berkualitas, Kemasan Premium, Detail Fungsional</i>).<br/><b>Paten:</b> Tanpa klaim fiktif.", table_cell)
        ],
        [
            Paragraph("<b>FOTO 3<br/>Benefit & Features<br/>(Alasan Membeli)</b>", table_cell_bold),
            Paragraph("Format infografis modern beresolusi HD: produk utama besar di tengah/kanan, dikelilingi kartu keunggulan ringkas dan ikon minimalis.", table_cell),
            Paragraph("<b>Input:</b> Headline universal (<i>'KENAPA PRODUK INI LAYAK DIPILIH?'</i> atau <i>'WHY YOU'LL LOVE IT'</i>).<br/><b>Paten:</b> 3–5 benefit faktual sesuai kategori.", table_cell)
        ],
        [
            Paragraph("<b>FOTO 4<br/>Lifestyle & Context<br/>(Penggunaan Nyata)</b>", table_cell_bold),
            Paragraph("Fotografi kontekstual natural yang memperlihatkan produk saat digunakan secara nyata sesuai industrinya.", table_cell),
            Paragraph("<b>Otomatis:</b> Makanan disajikan lezat, perangkat IoT di meja kerja/lab, tumbler di kantor/gym, formulasi riset di ruang uji.<br/><b>Paten:</b> Manusia natural dan skala realistis.", table_cell)
        ],
    ]
    t_photo = Table(photo_matrix, colWidths=[90, 185, 212])
    t_photo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_photo)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>2.5 Master Consistency Rule (Klausul Konsistensi Paten)</b>", h2_style))
    story.append(Paragraph(
        "Klausul paten wajib yang secara otomatis diinjeksi ke seluruh 4 prompt fotografi guna menjaga konsistensi identitas merek:",
        body_style
    ))

    rule_box = [
        [Paragraph(
            "<b>KLAUSUL PATEN KONSISTENSI VISUAL:</b><br/>"
            "<i>\"Gunakan satu visual identity yang konsisten untuk seluruh 4 foto. Pertahankan warna produk yang sama, tone lighting seragam, proporsi produk konsisten, dan kualitas fotografi setara katalog brand profesional. Jangan mengubah logo, label, teks, bentuk, warna, material, jumlah item, atau fitur produk dari referensi asli.\"</i>",
            ParagraphStyle('RuleBoxText', fontName='Times-Roman', fontSize=9, leading=13.5, textColor=NAVY)
        )]
    ]
    t_rule = Table(rule_box, colWidths=[487])
    t_rule.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_rule)
    story.append(PageBreak())

    # ==================== HALAMAN 4: BAB III IMPLEMENTASI TEKNIS ====================
    story.append(Paragraph("BAB III: IMPLEMENTASI TEKNIS & ALUR DATA", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("<b>3.1 Tumpukan Teknologi Teruji (Technology Stack)</b>", h2_style))
    story.append(Paragraph(
        "Sistem dibangun menggunakan standar industri perangkat lunak modern guna menjamin stabilitas tinggi:",
        body_style
    ))
    story.append(Paragraph("• <b>Frontend:</b> Next.js 16 (React 19) dengan Turbopack, App Router, Tailwind CSS, dan Lucide Icons.", bullet_style))
    story.append(Paragraph("• <b>Backend API:</b> Laravel 11 RESTful Controller (PHP 8.2), Eloquent ORM, dan Sanctum Token Security.", bullet_style))
    story.append(Paragraph("• <b>AI Reasoning Pipeline:</b> Google Gemini 2.5 Flash API (model mutakhir dengan multimodal token reasoning).", bullet_style))
    story.append(Paragraph("• <b>Image Generation Engine:</b> Pollinations Turbo Engine (Landscape 1280x720 16:9, bebas watermark, waktu proses < 5 detik).", bullet_style))
    story.append(Paragraph("• <b>Basis Data:</b> MySQL 8.0 dengan tabel <code>site_settings</code> penyimpanan dinamis berbasis pasangan key-value.", bullet_style))
    story.append(Paragraph("• <b>Server Linux:</b> Ubuntu 22.04 LTS, Nginx Reverse Proxy (SSL Let's Encrypt), dan PM2 Process Orchestrator.", bullet_style))

    story.append(Paragraph("<b>3.2 Alur Pemrosesan Data (Data Flow Pipeline)</b>", h2_style))

    pipeline_steps = [
        [Paragraph("Tahap", table_header), Paragraph("Komponen", table_header), Paragraph("Aktivitas & Alur Logika Teknis", table_header)],
        [
            Paragraph("1. Pengunggahan", table_cell_bold),
            Paragraph("Formulir Prodi<br/>(Client)", table_cell),
            Paragraph("Pengguna mengunggah foto produk mentah (Base64), memilih kategori produk (misal: <i>PRODUK TEKNOLOGI</i>), menandai tag karakteristik fisik, dan memilih headline infografis.", table_cell)
        ],
        [
            Paragraph("2. Dispatch API", table_cell_bold),
            Paragraph("Next.js Proxy /<br/>Laravel Route", table_cell),
            Paragraph("Payload dikirim ke <code>/api/v1/public/ai/catalog-photo</code>. Sistem membaca template prompt paten aktif yang tersimpan di tabel <code>site_settings</code> MySQL.", table_cell)
        ],
        [
            Paragraph("3. Multimodal Reasoning", table_cell_bold),
            Paragraph("Google Gemini<br/>2.5 Flash", table_cell),
            Paragraph("Model AI menganalisis gambar referensi asli bersama instruksi paten. Gemini menghasilkan output terstruktur JSON berisi 4 prompt bahasa Inggris presisi (<code>hero_prompt</code>, <code>detail_prompt</code>, <code>benefit_prompt</code>, <code>lifestyle_prompt</code>).", table_cell)
        ],
        [
            Paragraph("4. Visual Rendering", table_cell_bold),
            Paragraph("Image Turbo<br/>Engine", table_cell),
            Paragraph("Prompt dirender secara simultan menghasilkan 4 gambar landscape HD 1280x720 dengan seed visual terkontrol guna menjaga keseragaman warna dan lighting.", table_cell)
        ],
        [
            Paragraph("5. Adopsi 1-Klik", table_cell_bold),
            Paragraph("Katalog UI", table_cell),
            Paragraph("Hasil 4 foto ditampilkan di galeri responsif. Admin prodi dapat mengunduh file HD atau mengklik <b>'Gunakan'</b> untuk menjadikannya foto thumbnail resmi inovasi.", table_cell)
        ],
    ]
    t_pipe = Table(pipeline_steps, colWidths=[65, 105, 317])
    t_pipe.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pipe)

    story.append(Paragraph("<b>3.3 Skema Penyimpanan Dinamis (Database Key-Value)</b>", h2_style))
    story.append(Paragraph(
        "Kunci pengaturan yang disimpan pada tabel <code>site_settings</code> mencakup: <code>ai_prompt_1_hero</code>, <code>ai_prompt_2_detail</code>, <code>ai_prompt_3_benefit</code>, <code>ai_prompt_4_lifestyle</code>, <code>ai_prompt_consistency</code>, <code>gemini_api_key</code>, dan <code>ai_default_domain</code>.",
        body_style
    ))
    story.append(PageBreak())

    # ==================== HALAMAN 5: BAB IV MANAJEMEN SISTEM ====================
    story.append(Paragraph("BAB IV: MANAJEMEN SISTEM LENGKAP (FULL CRUD)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("<b>4.1 Panel Super Admin: Kontrol & Kustomisasi 100%</b>", h2_style))
    story.append(Paragraph(
        "Tersedia pada tab <b>Prompt Studio Visual</b> di Dashboard Super Admin (<code>/dashboard/admin?tab=ai_prompt</code>), memberikan kewenangan penuh pengelolaan tanpa menyentuh kode sumber (source code):",
        body_style
    ))
    story.append(Paragraph("1. <b>Read (Membaca):</b> Menampilkan teks prompt aktif yang sedang digunakan sistem secara real-time dari basis data.", bullet_style))
    story.append(Paragraph("2. <b>Update (Mengubah):</b> Setiap prompt (Foto 1, 2, 3, 4, dan Master Consistency Rule) memiliki textarea terpisah yang dapat diedit sewaktu-waktu sesuai kebutuhan regulasi visual universitas.", bullet_style))
    story.append(Paragraph("3. <b>Simpan Permanen:</b> Tombol <i>'Simpan Semua Pengaturan Prompt'</i> yang langsung menyimpan pembaruan ke MySQL dalam 1 transaksi aman.", bullet_style))
    story.append(Paragraph("4. <b>Reset ke Standar Paten:</b> Tombol <i>'Reset ke Standar Paten'</i> untuk mengembalikan seluruh formula ke acuan paten resmi Sekolah Vokasi UNS jika terjadi kesalahan konfigurasi.", bullet_style))
    story.append(Paragraph("5. <b>Uji Koneksi Gemini API:</b> Tombol uji diagnostik untuk memvalidasi token Google AI Studio dan memastikan kuota model <code>gemini-2.5-flash</code> aktif.", bullet_style))

    story.append(Paragraph("<b>4.2 Panel Program Studi: Alur Kerja Cepat & Bebas Hambatan</b>", h2_style))
    story.append(Paragraph(
        "Pada formulir Tambah Inovasi (<code>/dashboard/prodi/create</code>), admin dari seluruh 39 Program Studi menikmati kemudahan operasional:",
        body_style
    ))
    story.append(Paragraph("• <b>Laci Studio Foto Multi-Angle:</b> Dapat dibuka-tutup dengan animasi mulus tanpa mengganggu pengisian data formulir lainnya.", bullet_style))
    story.append(Paragraph("• <b>Pemilihan Kategori Otomatis:</b> Tersedia 6 tombol kategori (`PRODUK MAKANAN`, `MINUMAN`, `OBAT HERBAL`, `TEKNOLOGI`, `KIMIA`, `LAINYA`).", bullet_style))
    story.append(Paragraph("• <b>Pemilihan Karakteristik Detail (Foto 2):</b> Tombol multi-pilih praktis untuk menandai atribut fisik yang benar-benar ada pada produk.", bullet_style))
    story.append(Paragraph("• <b>Pemilihan Headline Infografis (Foto 3):</b> Pilihan langsung antara <i>'KENAPA PRODUK INI LAYAK DIPILIH?'</i> dan <i>'WHY YOU'LL LOVE IT'</i>.", bullet_style))
    story.append(Paragraph("• <b>Tombol Aksi Cepat:</b> Menghasilkan 4 foto dalam hitungan detik. Setiap kartu foto dilengkapi tombol <b>'Gunakan'</b> (otomatis mengisi kolom mockup utama) dan tombol <b>'Unduh'</b> resolusi HD.", bullet_style))

    story.append(Paragraph("<b>4.3 Sinkronisasi Real-Time Dua Arah</b>", h2_style))
    story.append(Paragraph(
        "Setiap kali Super Admin memperbarui instruksi prompt di panel admin, formulir pembuatan produk di seluruh akun Program Studi langsung menggunakan aturan baru tersebut secara instan tanpa perlu memuat ulang server (zero downtime).",
        body_style
    ))
    story.append(PageBreak())

    # ==================== HALAMAN 6: BAB V PANDUAN TANYA JAWAB ====================
    story.append(Paragraph("BAB V: PANDUAN KONSULTASI & TANYA-JAWAB DOSEN (FAQ)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "Panduan tanya-jawab teknis berikut disusun untuk mendampingi mahasiswa (Hamzah) dalam mempresentasikan sistem dan menjawab pertanyaan mendalam dari Dosen Pembimbing (Pak Darmawan):",
        body_style
    ))

    faq_items = [
        (
            "Q1: \"Ham, bagaimana sistem menjamin AI tidak mengubah logo, tulisan kemasan, atau bentuk produk asli riset kita?\"",
            "Jawaban: \"Sistem mengunci identitas visual melalui dua lapis perlindungan: pertama, foto mentah diunggah dan dianalisis langsung sebagai data multimodal oleh Gemini 2.5 Flash sebagai jangkar referensi (anchor). Kedua, kami menanamkan 'Master Consistency Rule' dan 'Negative Constraint' yang secara eksplisit melarang AI mengubah logo, warna, teks kemasan, atau menambah tombol fiktif. Hasilnya tetap setia pada produk fisik aslinya.\""
        ),
        (
            "Q2: \"Apakah instruksi prompt ini kaku, atau bisa kita ubah jika ada masukan dari pimpinan Fakultas Vokasi?\"",
            "Jawaban: \"Sistem kami sudah 100% Full CRUD, Pak. Seluruh template prompt (Foto 1 sampai Foto 4 beserta aturan konsistensi) disimpan di tabel database MySQL. Pimpinan atau Super Admin dapat mengubah redaksi prompt, menambah parameter baru, atau meresetnya kembali ke paten resmi kapan saja langsung dari menu Admin tanpa perlu koding ulang.\""
        ),
        (
            "Q3: \"Bagaimana sistem melayani 39 Program Studi yang jenis inovasinya sangat beragam (TI, Mesin, Tata Boga, Herbal)?\"",
            "Jawaban: \"Di formulir prodi, terdapat selektor 6 Kategori Resmi dan tag karakteristik fisik. Logika adaptif Gemini akan menyesuaikan konteks: jika kategori Pangan/Boga, Foto 4 otomatis menyajikan hidangan secara lezat di meja makan. Jika Mesin/Robotika/IoT, produk diletakkan di lab atau ruang kerja modern. Dengan demikian, visualisasi tetap masuk akal dan relevan dengan bidang keilmuan prodi.\""
        ),
        (
            "Q4: \"Kenapa memilih integrasi Google Gemini 2.5 Flash dan Pollinations Turbo Engine?\"",
            "Jawaban: \"Gemini 2.5 Flash unggul dalam pemahaman visual multimodal (bisa membaca foto dan teks bersamaan) dengan kecepatan sub-detik dan efisiensi biaya tertinggi di kelasnya. Untuk perenderan visual, mesin Turbo menghasilkan format landscape 16:9 HD (1280x720) tanpa watermark dan tanpa antrean lisensi yang membebani anggaran universitas.\""
        ),
        (
            "Q5: \"Apakah sistem ini sudah diuji di server publik dan siap didemokan ke pihak pimpinan kampus?\"",
            "Jawaban: \"Sudah 100% aktif dan berjalan di server produksi https://spsbu.unsmadiun.id. Kami telah memverifikasi build Next.js 16, backend Laravel 11, koneksi database, dan PM2 service. Pengujian generate 4 foto secara live dari domain publik telah berhasil dengan respon sempurna.\""
        ),
    ]

    for q, a in faq_items:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 2))
    story.append(PageBreak())

    # ==================== HALAMAN 7: BAB VI KESIMPULAN & PENGESAHAN ====================
    story.append(Paragraph("BAB VI: KESIMPULAN & LEMBAR PENGESAHAN", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=NAVY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("<b>6.1 Kesimpulan Implementasi</b>", h2_style))
    story.append(Paragraph(
        "Pengembangan subsistem <b>AI Studio Foto Visual Marketplace</b> pada Platform Katalog Inovasi Sekolah Vokasi Universitas Sebelas Maret telah terselesaikan secara tuntas dan memenuhi seluruh spesifikasi yang dipersyaratkan. Inovasi ini membuktikan bahwa teknologi kecerdasan buatan multimodal dapat dimanfaatkan secara tepat guna untuk menyelesaikan masalah riil di dunia pendidikan tinggi vokasi, yaitu standardisasi kualitas dokumentasi etalase hilirisasi tanpa membebani biaya jasa fotografer eksternal.",
        body_style
    ))
    story.append(Paragraph(
        "Kombinasi formula 4 foto terstruktur (Hero, Detail, Benefit, dan Lifestyle) yang dikunci dengan <i>Master Consistency Rule</i> berhasil menyajikan tampilan produk yang kredibel, berdaya pikat komersial tinggi, dan siap memikat mitra industri DUDI.",
        body_style
    ))

    story.append(Paragraph("<b>6.2 Status Operasional Server Produksi</b>", h2_style))
    story.append(Paragraph("• <b>Alamat URL Publik:</b> <code>https://spsbu.unsmadiun.id</code>", bullet_style))
    story.append(Paragraph("• <b>Panel Admin Prompt:</b> <code>https://spsbu.unsmadiun.id/dashboard/admin?tab=ai_prompt</code>", bullet_style))
    story.append(Paragraph("• <b>Formulir Pembuatan Produk:</b> <code>https://spsbu.unsmadiun.id/dashboard/prodi/create</code>", bullet_style))
    story.append(Paragraph("• <b>Status Operasional:</b> <i>Online, Zero Error, SSL Active, Database Synced</i>.", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>LEMBAR VERIFIKASI & PERSETUJUAN (ACC) PENGEMBANGAN</b>", ParagraphStyle('SignTitle', fontName='Times-Bold', fontSize=10, leading=13, alignment=1, textColor=NAVY)))
    story.append(Spacer(1, 6))

    # Box Checkbox Persetujuan Dosen
    acc_box = [
        [
            Paragraph(
                "<b>STATUS PERSETUJUAN DOSEN PEMBIMBING:</b><br/>"
                "<font size=10><b>[ &nbsp; ] &nbsp; DISETUJUI (ACC) UNTUK LANGSUNG DIKERJAKAN</b></font><br/>"
                "<font size=10><b>[ &nbsp; ] &nbsp; REVISI DENGAN CATATAN TAMBAHAN</b></font><br/><br/>"
                "<i>Catatan / Arahan Tambahan:</i><br/>"
                ".................................................................................................................................................................<br/>"
                ".................................................................................................................................................................",
                ParagraphStyle('AccBoxText', fontName='Times-Roman', fontSize=8.5, leading=12.5, textColor=DARK)
            )
        ]
    ]
    t_acc = Table(acc_box, colWidths=[487])
    t_acc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_acc)
    story.append(Spacer(1, 10))

    sign_matrix = [
        [
            Paragraph("Mengetahui / Menyetujui:<br/><b>Dosen Pembimbing,</b><br/><br/><br/><br/><b><u>Darmawan Lahru Riatma, S.Kom., M.MT.</u></b><br/>NIP. 198904242019031012", table_cell),
            Paragraph("Madiun, 14 Oktober 2026<br/>Disusun oleh,<br/><b>Tim Teknis Pengembang Aplikasi Cosco</b><br/>Sekolah Vokasi UNS Kampus Madiun<br/><br/><br/><b><u>Tim Administrator & Pengembang TI</u></b>", table_cell)
        ]
    ]
    t_sign = Table(sign_matrix, colWidths=[240, 247])
    t_sign.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(KeepTogether(t_sign))

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Unit Sistem Informasi & Transformasi Digital</b><br/>Sekolah Vokasi Universitas Sebelas Maret - Kampus Madiun", ParagraphStyle('UnitFooter', fontName='Times-Bold', fontSize=8.5, leading=11, alignment=1, textColor=SLATE)))

    # Eksekusi Render PDF Dokumen
    doc.build(story, canvasmaker=AcademicNumberedCanvas)
    print(f"Laporan PDF Akademik berhasil digenerate di: {output_path}")

if __name__ == "__main__":
    out_dir = r"D:\Landing Page\KATALOG UNS"
    pdf_file = os.path.join(out_dir, "Laporan_Implementasi_Sistem_AI_Katalog_Vokasi_UNS.pdf")
    generate_academic_pdf(pdf_file)
