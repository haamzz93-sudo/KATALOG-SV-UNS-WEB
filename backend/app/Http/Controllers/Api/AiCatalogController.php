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
     * Generate 3 multi-angle product photos using Gemini 2.5 Flash + HD rendering
     */
    public function generatePhotos(Request $request): JsonResponse
    {
        try {
            $apiKey = trim($request->input('apiKey', ''));
            if (empty($apiKey)) {
                $apiKey = SiteSetting::get('gemini_api_key') ?: env('GEMINI_API_KEY', '');
            }

            $jenis = $request->input('jenis', 'produk');
            $subJenis = $request->input('subJenis', 'Makanan');
            $rawImageBase64 = $request->input('rawImageBase64', null);
            $customPrompt = $request->input('customPrompt', '');
            $namaItem = trim($request->input('namaItem', 'Produk Inovasi Vokasi UNS'));
            if (empty($namaItem)) {
                $namaItem = 'Produk Inovasi Vokasi UNS';
            }

            $domain = $request->input('domain', '');
            if (empty($domain)) {
                $domain = SiteSetting::get('ai_default_domain') ?: 'katalog.unsmadiun.id';
            }

            // 1. Konsultasi / Pembuatan Prompt Presisi via Gemini 2.5 Flash jika API Key tersedia
            $geminiEnhancedPrompt = null;

            if (!empty($apiKey)) {
                try {
                    $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

                    $systemInstruction = "Kamu adalah AI Creative Director spesialis fotografi komersial marketplace profesional untuk Sekolah Vokasi UNS (Domain: {$domain}). " .
                        "Tugasmu adalah menganalisis nama produk \"{$namaItem}\", jenis \"{$jenis}\", dan sub-jenis \"{$subJenis}\", lalu buatkan 3 deskripsi visual fotografi produk dalam Bahasa Inggris yang sangat fotorealistis, studio lighting, clean background, 8k resolution, landscape aspect ratio 16:9, layak jual di marketplace premium. " .
                        "Format respon HANYA berupa JSON valid dengan struktur: {\"front_prompt\": \"...\", \"side_prompt\": \"...\", \"display_prompt\": \"...\"}";

                    $parts = [
                        ['text' => $systemInstruction . "\n\nInstruksi Pengguna: " . ($customPrompt ?: 'Buat foto produk studio clean tanpa teks berlebihan')]
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

            // 2. Susun 3 Prompt Fotografi Multi-Sudut (Tampak Depan, Tampak Samping, Display Marketplace)
            $baseSubject = "{$subJenis} {$jenis} named \"{$namaItem}\", high quality product photography, commercial marketplace display for {$domain}, clean studio lighting, 8k resolution, photorealistic, sharp focus, 16:9 landscape aspect ratio, no heavy typography, aesthetic modern catalog showcase";

            $prompts = [
                'tampak_depan' => $geminiEnhancedPrompt['front_prompt'] ?? "Straight-on eye-level front view of {$baseSubject}, white and soft grey minimal studio podium background",
                'tampak_samping' => $geminiEnhancedPrompt['side_prompt'] ?? "45-degree isometric side view of {$baseSubject}, showing depth and fine details, soft studio shadow, professional commercial product angle",
                'tampak_display' => $geminiEnhancedPrompt['display_prompt'] ?? "Dynamic aesthetic marketplace lifestyle hero display of {$baseSubject}, modern presentation setup, premium commercial showcase",
            ];

            // 3. Generate 3 Foto Dinamis HD Landscape (1280x720) via Turbo Model (No Paywall)
            $seedBase = time();
            $photos = [
                [
                    'id' => 'front',
                    'title' => 'Tampak Depan (Front View)',
                    'angle' => 'Sudut Depan Presisi',
                    'prompt' => $prompts['tampak_depan'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['tampak_depan']) . "?width=1280&height=720&seed=" . ($seedBase + 1) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'side',
                    'title' => 'Tampak Samping (Isometric / Side Angle)',
                    'angle' => 'Sudut Samping 45°',
                    'prompt' => $prompts['tampak_samping'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['tampak_samping']) . "?width=1280&height=720&seed=" . ($seedBase + 2) . "&model=turbo&nologo=true",
                ],
                [
                    'id' => 'display',
                    'title' => 'Display Marketplace (Hero Showcase)',
                    'angle' => 'Display Komersial HD',
                    'prompt' => $prompts['tampak_display'],
                    'url' => "https://image.pollinations.ai/prompt/" . rawurlencode($prompts['tampak_display']) . "?width=1280&height=720&seed=" . ($seedBase + 3) . "&model=turbo&nologo=true",
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Foto katalog multi-angle berhasil diproses.',
                'data' => [
                    'nama_item' => $namaItem,
                    'jenis' => $jenis,
                    'sub_jenis' => $subJenis,
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
