<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\Prodi;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function users(): JsonResponse
    {
        $users = User::with(['role', 'prodi'])->latest()->get();
        $roles = Role::all();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users,
                'roles' => $roles,
            ],
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'prodi_id' => 'nullable|exists:prodis,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'prodi_id' => $validated['prodi_id'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun pengguna berhasil didaftarkan.',
            'data' => $user->load(['role', 'prodi']),
        ], 201);
    }

    public function toggleUserStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Status aktif pengguna berhasil diubah.',
            'is_active' => $user->is_active,
        ]);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'prodi_id' => 'nullable|exists:prodis,id',
            'is_active' => 'nullable|boolean',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role_id = $validated['role_id'];
        $user->prodi_id = $validated['role_id'] == 3 ? ($validated['prodi_id'] ?? null) : null;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if (isset($validated['is_active'])) {
            $user->is_active = (bool) $validated['is_active'];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Akun pengguna berhasil diperbarui.',
            'data' => $user->load(['role', 'prodi']),
        ]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === 1 || $user->id === 4) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.',
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun pengguna berhasil dihapus.',
        ]);
    }

    public function updateItemStatus(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status_publikasi' => 'required|in:draft,published,archived',
        ]);

        $item = CatalogItem::findOrFail($id);
        $item->status_publikasi = $validated['status_publikasi'];
        $item->save();

        return response()->json([
            'success' => true,
            'message' => "Status publikasi item berhasil diubah menjadi {$item->status_publikasi}.",
            'data' => $item,
        ]);
    }

    public function prodis(): JsonResponse
    {
        $prodis = Prodi::withCount(['catalogItems'])->get();

        return response()->json([
            'success' => true,
            'data' => $prodis,
        ]);
    }

    public function storeProdi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode_prodi' => 'required|string|max:50|unique:prodis,kode_prodi',
            'nama_prodi' => 'required|string|max:200',
            'jenjang' => 'required|string|max:50',
            'fakultas_sekolah' => 'nullable|string|max:150',
            'kontak_email' => 'nullable|email|max:150',
            'kontak_wa' => 'nullable|string|max:50',
            'logo_url' => 'nullable|string|max:255',
        ]);

        $prodi = Prodi::create([
            'kode_prodi' => strtoupper($validated['kode_prodi']),
            'nama_prodi' => $validated['nama_prodi'],
            'jenjang' => $validated['jenjang'],
            'fakultas_sekolah' => $validated['fakultas_sekolah'] ?? 'Sekolah Vokasi UNS',
            'kontak_email' => $validated['kontak_email'] ?? null,
            'kontak_wa' => $validated['kontak_wa'] ?? null,
            'logo_url' => $validated['logo_url'] ?? '/images/brand/logo-sv-uns-official-color.png',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Program studi berhasil didaftarkan.',
            'data' => $prodi,
        ], 201);
    }

    public function updateProdi(Request $request, int $id): JsonResponse
    {
        $prodi = Prodi::findOrFail($id);

        $validated = $request->validate([
            'kode_prodi' => 'required|string|max:50|unique:prodis,kode_prodi,' . $id,
            'nama_prodi' => 'required|string|max:200',
            'jenjang' => 'required|string|max:50',
            'fakultas_sekolah' => 'nullable|string|max:150',
            'kontak_email' => 'nullable|email|max:150',
            'kontak_wa' => 'nullable|string|max:50',
            'logo_url' => 'nullable|string|max:255',
        ]);

        $prodi->update([
            'kode_prodi' => strtoupper($validated['kode_prodi']),
            'nama_prodi' => $validated['nama_prodi'],
            'jenjang' => $validated['jenjang'],
            'fakultas_sekolah' => $validated['fakultas_sekolah'] ?? $prodi->fakultas_sekolah,
            'kontak_email' => $validated['kontak_email'] ?? $prodi->kontak_email,
            'kontak_wa' => $validated['kontak_wa'] ?? $prodi->kontak_wa,
            'logo_url' => $validated['logo_url'] ?? $prodi->logo_url,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Program studi berhasil diperbarui.',
            'data' => $prodi,
        ]);
    }

    public function deleteProdi(int $id): JsonResponse
    {
        $prodi = Prodi::findOrFail($id);
        $prodi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Program studi berhasil dihapus.',
        ]);
    }
}
