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

            $rawImageBase64 = $request->input('rawImageBase64', null);
            $customPrompt = $request->input('customPrompt', '');

            $domain = $request->input('domain', '');
            if (empty($domain)) {
                $domain = SiteSetting::get('ai_default_domain') ?: 'spsbu.unsmadiun.id';
            }

            // 1. Konsultasi / Pembuatan 4 Prompt Presisi via Gemini 2.5 Flash jika API Key tersedia
            $geminiEnhancedPrompt = null;

            if (!empty($apiKey)) {
                try {
                    $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                    $systemInstruction = "You are a World-Class Commercial Product Photographer and AI Creative Director specializing in high-converting marketplace visual assets (Domain: {$domain}).\n" .
                        "You are analyzing a product named \"{$namaItem}\"" . (!empty($tagline) ? " with tagline \"{$tagline}\"" : "") . " categorized under \"{$kategori}\".\n\n" .
                        "Generate 4 specialized commercial photography prompts in ENGLISH for a 4-photo marketplace product listing:\n\n" .
                        "1. hero_prompt (Foto Utama Marketplace):\n" .
                        "- Eye-level commercial hero photography on a minimalist clean ivory/white studio podium or surface.\n" .
                        "- Soft balanced studio rim lighting, crisp focal point, elegant soft shadows.\n" .
                        "- Strictly preserve original colors, logo, shape, proportions, and brand identity.\n\n" .
                        "2. detail_prompt (Detail & Kualitas):\n" .
                        "- Editorial macro close-up shot showcasing tactile texture, premium materials, craftsmanship, precise finishing, neat seams, and packaging details.\n" .
                        "- Shallow depth of field, sharp macro lens focus.\n\n" .
                        "3. benefit_prompt (Infografis Fitur & Alasan Membeli):\n" .
                        "- Modern clean commercial product infographic layout with universal headline 'KENAPA PRODUK INI LAYAK DIPILIH?' or 'WHY YOU'LL LOVE IT'.\n" .
                        "- Highlighting 3-5 core functional benefits with subtle minimalist aesthetic badges or graphic pointers around the product.\n\n" .
                        "4. lifestyle_prompt (Konteks Penggunaan Nyata):\n" .
                        "- Authentic contextual photography showing the product in genuine real-world usage suited to {$kategori} (e.g., appetizing food serving, wellness desk setup for herbal, modern office/tech workbench for engineering/IoT).\n" .
                        "- Warm natural inviting light, aspirational commercial atmosphere.\n\n" .
                        "CONSISTENT VISUAL IDENTITY: All 4 images must portray the exact same product model, identical colors, branding, scale, and lighting aesthetic.\n" .
                        "Format your response as a strict JSON object with NO extra markdown or text:\n" .
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

            // 2. Susun 4 Prompt Fotografi Marketplace
            $baseSubject = "{$kategori} named \"{$namaItem}\", high quality commercial product photography for {$domain}, clean studio lighting, 8k resolution, photorealistic, sharp focus, 16:9 landscape aspect ratio, premium marketplace catalog showcase";

            $prompts = [
                'hero' => $geminiEnhancedPrompt['hero_prompt'] ?? "Eye-level commercial hero product photography of {$baseSubject}, centered on clean minimalist ivory podium, soft studio lighting, crisp focus, clean white background",
                'detail' => $geminiEnhancedPrompt['detail_prompt'] ?? "Editorial macro close-up photography of {$baseSubject}, capturing fine material craftsmanship, tactile surface textures, precision finishing and premium packaging details, soft studio light, shallow depth of field",
                'benefit' => $geminiEnhancedPrompt['benefit_prompt'] ?? "Modern aesthetic commercial infographic presentation of {$baseSubject}, showcasing key product benefits and reasons to buy with clean minimalist layout, soft lighting, premium marketplace catalog display",
                'lifestyle' => $geminiEnhancedPrompt['lifestyle_prompt'] ?? "Authentic lifestyle product photography of {$baseSubject}, in natural real-world use environment, warm ambient morning light, commercial catalog aesthetic, high quality depth of field",
            ];

            // 3. Generate 4 Foto Dinamis HD Landscape (1280x720) via Turbo Model (No Paywall)
            $seedBase = time();
            $photos = [
                [
                    'id' => 'hero',
                    'title' => '1. Foto Utama (Hero Marketplace)',
                    'angle' => 'Foto Utama',
                    'badge' => 'Hero Product',
                    'desc' => 'Fokus utama, background bersih (putih/ivory), pencahayaan studio lembut, identitas logo & warna presisi.',
                    'prompt' => $prompts['hero'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['hero']) . "?width=1280&height=720&seed=" . ($seedBase + 1) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'detail',
                    'title' => '2. Detail & Kualitas (Macro Shot)',
                    'angle' => 'Meyakinkan Kualitas',
                    'badge' => 'Detail & Quality',
                    'desc' => 'Macro shot tekstur, material, kerapian finishing & kemasan untuk meyakinkan calon pembeli/mitra.',
                    'prompt' => $prompts['detail'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['detail']) . "?width=1280&height=720&seed=" . ($seedBase + 2) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'benefit',
                    'title' => '3. Keunggulan & Fitur (Infografis)',
                    'angle' => 'Alasan Membeli',
                    'badge' => 'Key Features',
                    'desc' => 'Tampilan infografis modern menyajikan poin keunggulan dan alasan mengapa produk ini layak dipilih.',
                    'prompt' => $prompts['benefit'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['benefit']) . "?width=1280&height=720&seed=" . ($seedBase + 3) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'lifestyle',
                    'title' => '4. Konteks Penggunaan (Lifestyle)',
                    'angle' => 'Konteks Real Use',
                    'badge' => 'Real Context',
                    'desc' => 'Fotografi kontekstual penggunaan nyata produk sesuai kategori (meja kerja, lab, konsumsi, atau aktivitas sehari-hari).',
                    'prompt' => $prompts['lifestyle'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['lifestyle']) . "?width=1280&height=720&seed=" . ($seedBase + 4) . "&model=turbo&nologo=true",
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => '4 foto marketplace profesional berhasil diproses.',
                'data' => [
                    'nama_item' => $namaItem,
                    'tagline' => $tagline,
                    'kategori' => $kategori,
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
}
