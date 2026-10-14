<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiCatalogController extends Controller
{
    public const DEFAULT_PROMPT_HERO = "Gunakan foto produk yang diberikan sebagai referensi utama. Identifikasi otomatis jenis produk, bentuk, warna, material, label, kemasan, logo, tulisan, serta karakter visualnya. Buat foto produk marketplace premium dengan komposisi hero product photography.\n\nKetentuan Paten:\n- Pertahankan bentuk, warna, logo, label, tulisan, kemasan, dan proporsi produk secara akurat.\n- Jangan mengubah identitas produk dan jangan menambahkan fitur yang sebenarnya tidak ada.\n- Tampilkan produk dalam angle terbaik sesuai kategorinya.\n- Bila produk memiliki bagian depan dan belakang penting, tampilkan secara proporsional. Bila berupa paket/set, susun semua item dengan rapi.\n- Background: putih bersih, ivory, light grey, atau gradient lembut yang clean dan tidak ramai sesuai tone produk.\n- Lighting: soft studio lighting, natural highlight, realistic soft shadow, detail tajam.\n- Komposisi: produk menjadi focal point utama, center composition atau slightly off-center, whitespace cukup.\n- Mood: premium, trustworthy, professional, clean, modern, commercial, high-end marketplace photography HD.\n- Hindari: background berlebihan, logo/warna/tulisan berubah, bentuk terdistorsi, efek terlalu dramatis.";

    public const DEFAULT_PROMPT_DETAIL = "Gunakan produk yang sama sebagai referensi utama. Buat foto kedua yang fokus pada detail kualitas dan craftsmanship produk.\n\nKetentuan Paten:\n- Identifikasi otomatis elemen paling penting berdasarkan kategori produk (tekstur bahan, detail jahitan, finishing permukaan, material, kemasan, tutup/botol, layar/tombol, konektor, struktur, tekstur makanan, kandungan visual, detail printing, bagian fungsional penting).\n- Tampilkan 3–5 close-up detail dalam layout editorial modern.\n- Tambahkan label singkat yang hanya menyebut karakter yang benar-benar terlihat dari produk: \"Detail Material\", \"Finishing Rapi\", \"Desain Presisi\", \"Tekstur Berkualitas\", \"Kemasan Premium\", \"Detail Fungsional\". Jangan membuat klaim teknis fiktif.\n- Background: putih / light grey / warna netral premium dengan aksen warna menyesuaikan produk.\n- Gaya: premium detail photography, macro product shot, commercial catalog, clean infographic, sharp realistic texture.";

    public const DEFAULT_PROMPT_BENEFIT = "Gunakan produk asli sebagai fokus utama. Buat foto ketiga dalam format modern benefit infographic yang menjelaskan alasan utama calon pembeli memilih produk.\n\nKetentuan Paten:\n- Analisis kategori produk terlebih dahulu, lalu tampilkan maksimal 3–5 benefit atau fitur utama yang relevan dan aman berdasarkan informasi produk yang tersedia.\n- Adaptasi kategori: fashion (nyaman, ringan, fit), elektronik (fungsi utama, konektivitas), makanan (rasa, kemasan, penyajian), alat/mesin (fungsi, efisiensi), pertanian/kimia (cara dan target penggunaan).\n- Jangan mengarang spesifikasi, sertifikasi, klaim kesehatan atau performa yang tidak tersedia.\n- Komposisi: produk besar di tengah atau kanan, feature cards kecil di sekeliling, icon minimalis, teks sangat singkat, hierarchy kuat, mudah dibaca di smartphone.\n- Headline universal: \"KENAPA PRODUK INI LAYAK DIPILIH?\" atau \"WHY YOU'LL LOVE IT\".\n- Gaya: clean product infographic, premium marketplace advertising, modern, concise, trustworthy, visually persuasive.";

    public const DEFAULT_PROMPT_LIFESTYLE = "Gunakan produk asli sebagai referensi dan pertahankan desainnya secara akurat. Buat foto lifestyle profesional yang menunjukkan produk digunakan dalam konteks nyata sesuai kategorinya.\n\nKetentuan Paten:\n- Sistem menentukan konteks penggunaan paling natural: pakaian (dikenakan model), tumbler (meja kerja/gym), skincare (meja vanity), elektronik/teknologi (meja kerja/lab/kantor), makanan (disajikan secara appetizing), pertanian/alat (digunakan di kebun/ruang kerja).\n- Ketentuan: produk tetap identik dengan referensi, skala realistis, penggunaan masuk akal, tidak mengubah fungsi, manusia jika ada terlihat natural dan profesional, tidak terlalu banyak objek.\n- Lighting: natural premium lighting, cinematic ringan realistis, shallow depth of field bila sesuai.\n- Mood: aspirational, premium, authentic, modern lifestyle, professional commercial photography.\n- Tujuan: membuat calon pembeli langsung membayangkan produk digunakan dalam kehidupan nyata.";

    public const DEFAULT_PROMPT_CONSISTENCY = "Gunakan satu visual identity yang konsisten untuk seluruh 4 foto. Pertahankan warna produk yang sama, tone lighting seragam, proporsi produk konsisten, dan kualitas fotografi setara katalog brand profesional. Jangan mengubah logo, label, teks, bentuk, warna, material, jumlah item, atau fitur produk dari referensi asli.";

    /**
     * Generate 4 professional marketplace photos using Gemini 2.5 Flash + HD rendering
     * 1. Hero Product (Foto Utama Marketplace)
     * 2. Detail & Quality (Meyakinkan Kualitas)
     * 3. Benefit & Key Features (Alasan Membeli / Infografis)
     * 4. Lifestyle / Real Use Context (Konteks Penggunaan Nyata)
     */
    public function generatePhotos(Request $request): JsonResponse
    {
        try {
            $apiKey = trim($request->input('apiKey', ''));
            if (empty($apiKey)) {
                $apiKey = SiteSetting::get('gemini_api_key') ?: env('GEMINI_API_KEY', '');
            }

            $namaItem = trim($request->input('namaItem', 'Produk Inovasi Vokasi UNS'));
            if (empty($namaItem)) {
                $namaItem = 'Produk Inovasi Vokasi UNS';
            }

            $tagline = trim($request->input('tagline', ''));

            // Kategori: salah satu dari 6 pilihan resmi
            // (MAKANAN, MINUMAN, OBAT HERBAL, TEKNOLOGI, KIMIA, LAINYA)
            $kategori = trim($request->input('kategori', ''));
            if (empty($kategori)) {
                $subJenis = $request->input('subJenis', 'Makanan');
                $kategori = strtoupper("PRODUK " . $subJenis);
            }

            // Inputan Khusus Foto 2 & Foto 3
            $detailLabels = $request->input('detailLabels', 'Detail Material, Finishing Rapi, Desain Presisi');
            if (is_array($detailLabels)) {
                $detailLabels = implode(', ', $detailLabels);
            }
            $benefitHeadline = trim($request->input('benefitHeadline', 'KENAPA PRODUK INI LAYAK DIPILIH?'));
            if (empty($benefitHeadline)) {
                $benefitHeadline = 'KENAPA PRODUK INI LAYAK DIPILIH?';
            }

            $rawImageBase64 = $request->input('rawImageBase64', null);
            $customPrompt = $request->input('customPrompt', '');

            $domain = $request->input('domain', '');
            if (empty($domain)) {
                $domain = SiteSetting::get('ai_default_domain') ?: 'spsbu.unsmadiun.id';
            }

            // 1. Ambil Template Prompt Paten dari Database (Full CRUD Sinkron)
            $templateHero = SiteSetting::get('ai_prompt_1_hero') ?: self::DEFAULT_PROMPT_HERO;
            $templateDetail = SiteSetting::get('ai_prompt_2_detail') ?: self::DEFAULT_PROMPT_DETAIL;
            $templateBenefit = SiteSetting::get('ai_prompt_3_benefit') ?: self::DEFAULT_PROMPT_BENEFIT;
            $templateLifestyle = SiteSetting::get('ai_prompt_4_lifestyle') ?: self::DEFAULT_PROMPT_LIFESTYLE;
            $templateConsistency = SiteSetting::get('ai_prompt_consistency') ?: self::DEFAULT_PROMPT_CONSISTENCY;

            // 2. Konsultasi / Pembuatan 4 Prompt Presisi via Gemini 2.5 Flash jika API Key tersedia
            $geminiEnhancedPrompt = null;

            if (!empty($apiKey)) {
                try {
                    $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                    $systemInstruction = "You are a World-Class Commercial Product Photographer and AI Creative Director specializing in high-converting marketplace visual assets (Domain: {$domain}).\n" .
                        "You are analyzing a product named \"{$namaItem}\"" . (!empty($tagline) ? " with tagline \"{$tagline}\"" : "") . " categorized under \"{$kategori}\".\n" .
                        (!empty($detailLabels) ? "Verified quality characters to feature on details: {$detailLabels}.\n" : "") .
                        "Infographic headline to feature: \"{$benefitHeadline}\".\n\n" .
                        "=== STRICT GUIDELINES FROM USER SPECIFICATION ===\n" .
                        "MASTER CONSISTENCY RULE:\n{$templateConsistency}\n\n" .
                        "PROMPT 1 (Hero Product / Foto Utama Marketplace):\n{$templateHero}\n\n" .
                        "PROMPT 2 (Detail & Quality / Meyakinkan Kualitas):\n{$templateDetail}\n\n" .
                        "PROMPT 3 (Benefit & Key Features / Alasan Membeli):\n{$templateBenefit}\n\n" .
                        "PROMPT 4 (Lifestyle / Real Use Context):\n{$templateLifestyle}\n\n" .
                        "CRITICAL: Generate 4 specialized, detailed English photography prompts for an image generator (16:9 landscape aspect ratio, 8k resolution, photorealistic commercial photoshoot). Return strictly a JSON object with this exact schema:\n" .
                        "{\n" .
                        "  \"hero_prompt\": \"...\",\n" .
                        "  \"detail_prompt\": \"...\",\n" .
                        "  \"benefit_prompt\": \"...\",\n" .
                        "  \"lifestyle_prompt\": \"...\"\n" .
                        "}";

                    $parts = [
                        ['text' => $systemInstruction . "\n\nInstruksi Pengguna Tambahan: " . ($customPrompt ?: 'Jaga agar produk tampak tajam, profesional, layak jual, konsisten di seluruh 4 foto')]
                    ];

                    if (!empty($rawImageBase64) && str_starts_with($rawImageBase64, 'data:')) {
                        $segments = explode(';base64,', $rawImageBase64);
                        if (count($segments) === 2) {
                            $mimeType = str_replace('data:', '', $segments[0]);
                            $parts[] = [
                                'inlineData' => [
                                    'mimeType' => $mimeType,
                                    'data' => $segments[1],
                                ]
                            ];
                        }
                    }

                    $response = Http::timeout(25)
                        ->withHeaders(['Content-Type' => 'application/json'])
                        ->post($geminiUrl, [
                            'contents' => [
                                ['parts' => $parts]
                            ]
                        ]);

                    if ($response->successful()) {
                        $json = $response->json();
                        $textOut = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';
                        if (preg_match('/\{[\s\S]*\}/', $textOut, $matches)) {
                            $geminiEnhancedPrompt = json_decode($matches[0], true);
                        }
                    } else {
                        Log::warning('Gemini API call returned non-200: ' . $response->body());
                    }
                } catch (\Throwable $geminiErr) {
                    Log::warning('Gemini prompt enhancement warning: ' . $geminiErr->getMessage());
                }
            }

            // 3. Susun 4 Prompt Fotografi Marketplace
            $baseSubject = "{$kategori} named \"{$namaItem}\", high quality commercial product photography for {$domain}, clean studio lighting, 8k resolution, photorealistic, sharp focus, 16:9 landscape aspect ratio, premium marketplace catalog showcase";

            $prompts = [
                'hero' => $geminiEnhancedPrompt['hero_prompt'] ?? "Eye-level commercial hero product photography of {$baseSubject}, centered on clean minimalist ivory podium, soft studio lighting, crisp focus, clean white and light grey background, photorealistic 8k",
                'detail' => $geminiEnhancedPrompt['detail_prompt'] ?? "Editorial macro close-up photography of {$baseSubject}, capturing fine material craftsmanship, tactile surface textures, {$detailLabels}, precision finishing and premium packaging details, soft studio light, shallow depth of field, 8k",
                'benefit' => $geminiEnhancedPrompt['benefit_prompt'] ?? "Modern aesthetic commercial infographic presentation of {$baseSubject}, featuring headline '{$benefitHeadline}', showcasing key product benefits and reasons to buy with clean minimalist layout, soft lighting, premium marketplace catalog display, 8k",
                'lifestyle' => $geminiEnhancedPrompt['lifestyle_prompt'] ?? "Authentic lifestyle product photography of {$baseSubject}, in natural real-world use environment for {$kategori}, warm ambient morning light, commercial catalog aesthetic, high quality depth of field, 8k",
            ];

            // 3. Generate 4 Foto Dinamis HD Landscape (1280x720) via Proxy (Bypasses 402 Referer Paywall)
            $seedBase = time();
            $photos = [
                [
                    'id' => 'hero',
                    'title' => '1. Foto Utama (Hero Marketplace)',
                    'angle' => 'Foto Utama',
                    'badge' => 'Hero Product',
                    'desc' => 'Fokus utama, background bersih (putih/ivory), pencahayaan studio lembut, identitas logo & warna presisi.',
                    'prompt' => $prompts['hero'],
                    'url' => "/api/v1/public/ai/image-proxy?prompt=" . rawurlencode($prompts['hero']) . "&seed=" . ($seedBase + 1) . "&width=1280&height=720",
                    'directUrl' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['hero']) . "?width=1280&height=720&seed=" . ($seedBase + 1) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'detail',
                    'title' => '2. Detail & Kualitas (Macro Shot)',
                    'angle' => 'Meyakinkan Kualitas',
                    'badge' => 'Detail & Quality',
                    'desc' => 'Macro shot tekstur, material, kerapian finishing & kemasan untuk meyakinkan calon pembeli/mitra.',
                    'prompt' => $prompts['detail'],
                    'url' => "/api/v1/public/ai/image-proxy?prompt=" . rawurlencode($prompts['detail']) . "&seed=" . ($seedBase + 2) . "&width=1280&height=720",
                    'directUrl' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['detail']) . "?width=1280&height=720&seed=" . ($seedBase + 2) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'benefit',
                    'title' => '3. Keunggulan & Fitur (Infografis)',
                    'angle' => 'Alasan Membeli',
                    'badge' => 'Key Features',
                    'desc' => 'Tampilan infografis modern menyajikan poin keunggulan dan alasan mengapa produk ini layak dipilih.',
                    'prompt' => $prompts['benefit'],
                    'url' => "/api/v1/public/ai/image-proxy?prompt=" . rawurlencode($prompts['benefit']) . "&seed=" . ($seedBase + 3) . "&width=1280&height=720",
                    'directUrl' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['benefit']) . "?width=1280&height=720&seed=" . ($seedBase + 3) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'lifestyle',
                    'title' => '4. Konteks Penggunaan (Lifestyle)',
                    'angle' => 'Konteks Real Use',
                    'badge' => 'Real Context',
                    'desc' => 'Fotografi kontekstual penggunaan nyata produk sesuai kategori (meja kerja, lab, konsumsi, atau aktivitas sehari-hari).',
                    'prompt' => $prompts['lifestyle'],
                    'url' => "/api/v1/public/ai/image-proxy?prompt=" . rawurlencode($prompts['lifestyle']) . "&seed=" . ($seedBase + 4) . "&width=1280&height=720",
                    'directUrl' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['lifestyle']) . "?width=1280&height=720&seed=" . ($seedBase + 4) . "&model=turbo&nologo=true",
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => '4 foto marketplace profesional berhasil diproses.',
                'data' => [
                    'nama_item' => $namaItem,
                    'tagline' => $tagline,
                    'kategori' => $kategori,
                    'detail_labels' => $detailLabels,
                    'benefit_headline' => $benefitHeadline,
                    'photos' => $photos,
                    'used_gemini' => !empty($geminiEnhancedPrompt),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('AI Catalog error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses AI Studio: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test connection to Gemini 2.5 Flash API
     */
    public function testKey(Request $request): JsonResponse
    {
        try {
            $apiKey = trim($request->input('apiKey', ''));
            if (empty($apiKey)) {
                $apiKey = SiteSetting::get('gemini_api_key') ?: env('GEMINI_API_KEY', '');
            }

            if (empty($apiKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'API Key belum diisi.',
                ], 400);
            }

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
            $payload = [
                'contents' => [
                    ['parts' => [['text' => 'Ping test. Balas dengan: KONEKSI GEMINI AKTIF']]]
                ]
            ];

            $res = Http::timeout(15)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if (!$res->successful()) {
                $err = $res->json();
                $msg = $err['error']['message'] ?? 'Kunci API tidak valid atau limit kuota Google AI tercapai.';
                return response()->json([
                    'success' => false,
                    'message' => $msg,
                ], 400);
            }

            $data = $res->json();
            $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'OK';

            return response()->json([
                'success' => true,
                'message' => 'Koneksi Google Gemini 2.5 Flash Berhasil!',
                'model' => 'gemini-2.5-flash',
                'reply' => trim($reply),
            ]);
        } catch (\Throwable $err) {
            return response()->json([
                'success' => false,
                'message' => 'Kesalahan koneksi: ' . $err->getMessage(),
            ], 500);
        }
    }

    /**
     * Proxy image generator without Referer header to bypass 402 payment wall
     */
    public function proxyImage(Request $request)
    {
        $prompt = $request->query('prompt', 'commercial product photography');
        $seed = $request->query('seed', '42');
        $width = $request->query('width', '1280');
        $height = $request->query('height', '720');

        $encoded = rawurlencode($prompt);
        $fetchUrl = "https://image.pollinations.ai/prompt/{$encoded}?width={$width}&height={$height}&seed={$seed}&model=turbo&nologo=true";

        try {
            $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept' => 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                ])
                ->timeout(30)
                ->get($fetchUrl);

            if ($response->successful() && strlen($response->body()) > 500) {
                return response($response->body(), 200)
                    ->header('Content-Type', $response->header('Content-Type') ?: 'image/jpeg')
                    ->header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200')
                    ->header('Access-Control-Allow-Origin', '*');
            }

            // Fallback without model parameter
            $fallbackUrl = "https://image.pollinations.ai/prompt/{$encoded}?width={$width}&height={$height}&seed={$seed}&nologo=true";
            $fallbackRes = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0',
                    'Accept' => 'image/*',
                ])
                ->timeout(25)
                ->get($fallbackUrl);

            if ($fallbackRes->successful() && strlen($fallbackRes->body()) > 500) {
                return response($fallbackRes->body(), 200)
                    ->header('Content-Type', $fallbackRes->header('Content-Type') ?: 'image/jpeg')
                    ->header('Cache-Control', 'public, max-age=86400')
                    ->header('Access-Control-Allow-Origin', '*');
            }
        } catch (\Throwable $e) {
            Log::warning('Laravel proxyImage error: ' . $e->getMessage());
        }

        // SVG fallback placeholder
        $svg = '<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#07192C"/>
            <circle cx="640" cy="320" r="80" fill="#0F4C81"/>
            <text x="640" y="335" font-family="system-ui, sans-serif" font-size="48" fill="#C5A059" text-anchor="middle">&#128248;</text>
            <text x="640" y="440" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Katalog Foto Marketplace Vokasi UNS</text>
            <text x="640" y="480" font-family="system-ui, sans-serif" font-size="18" fill="#94A3B8" text-anchor="middle">Resolusi HD 1280x720 &bull; Standar Komersial</text>
        </svg>';

        return response($svg, 200)->header('Content-Type', 'image/svg+xml');
    }
}
