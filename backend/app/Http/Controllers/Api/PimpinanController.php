<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;

class PimpinanController extends Controller
{
    public function dashboardStats(): JsonResponse
    {
        $totalItems = CatalogItem::count();
        $totalPublished = CatalogItem::where('status_publikasi', 'published')->count();
        $totalViews = CatalogItem::sum('view_count');
        $totalDemoClicks = CatalogItem::sum('demo_click_count');
        $totalInquiries = Inquiry::count();

        // Distribution by Category
        $byCategory = Category::withCount('catalogItems')->get()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->nama,
                'slug' => $cat->slug,
                'count' => $cat->catalog_items_count,
            ];
        });

        // Distribution by Prodi
        $byProdi = Prodi::withCount('catalogItems')->get()->map(function ($prodi) {
            return [
                'id' => $prodi->id,
                'kode' => $prodi->kode_prodi,
                'name' => $prodi->nama_prodi,
                'count' => $prodi->catalog_items_count,
            ];
        });

        // Top viewed products
        $topViewed = CatalogItem::with(['category', 'prodi'])
            ->orderByDesc('view_count')
            ->limit(5)
            ->get();

        // Top interactive demo products
        $topDemo = CatalogItem::with(['category', 'prodi'])
            ->orderByDesc('demo_click_count')
            ->limit(5)
            ->get();

        // Recent inquiries from DUDI partners
        $recentInquiries = Inquiry::with('catalogItem')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_items' => $totalItems,
                    'total_published' => $totalPublished,
                    'total_views' => $totalViews,
                    'total_demo_clicks' => $totalDemoClicks,
                    'total_inquiries' => $totalInquiries,
                ],
                'distribution' => [
                    'by_category' => $byCategory,
                    'by_prodi' => $byProdi,
                ],
                'rankings' => [
                    'top_viewed' => $topViewed,
                    'top_demo' => $topDemo,
                ],
                'recent_inquiries' => $recentInquiries,
            ],
        ]);
    }

    public function exportReport(): JsonResponse
    {
        $items = CatalogItem::with(['category', 'prodi', 'specs', 'inquiries'])
            ->orderBy('prodi_id')
            ->get();

        return response()->json([
            'success' => true,
            'title' => 'Laporan Rekapitulasi Katalog Inovasi Sekolah Vokasi UNS',
            'generated_at' => now()->toIso8601String(),
            'total_items' => $items->count(),
            'data' => $items,
        ]);
    }
}
