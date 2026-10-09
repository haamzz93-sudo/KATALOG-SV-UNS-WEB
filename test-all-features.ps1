Write-Host "=========================================================="
Write-Host "🔍 PENGUJIAN OTOMATIS FITUR SISTEM KATALOG VOKASI UNS 2026"
Write-Host "=========================================================="

$baseUrl = "https://katalog.unsmadiun.id/api/v1"
$localFe = "http://localhost:3000"

# 1. FRONTEND PAGES
Write-Host "`n[1/6] Menguji Rute Halaman Frontend (Next.js Local):"
$pages = @("/", "/katalog", "/login", "/dashboard", "/dashboard/admin", "/dashboard/pimpinan", "/dashboard/prodi", "/dashboard/prodi/create")
foreach ($p in $pages) {
  try {
    $resp = Invoke-WebRequest -Uri "$localFe$p" -UseBasicParsing -TimeoutSec 5
    Write-Host "  ✅ $p -> HTTP $($resp.StatusCode)"
  } catch {
    Write-Host "  ❌ $p -> Error: $($_.Exception.Message)"
  }
}

# 2. PUBLIC API ENDPOINTS
Write-Host "`n[2/6] Menguji API Publik & Katalog:"
$pubEndpoints = @("/public/categories", "/public/prodis", "/public/catalog", "/public/settings", "/public/stats")
foreach ($ep in $pubEndpoints) {
  try {
    $r = Invoke-RestMethod -Uri "$baseUrl$ep" -TimeoutSec 10
    Write-Host "  ✅ $ep -> Success: $($r.success)"
  } catch {
    Write-Host "  ❌ $ep -> Error: $($_.Exception.Message)"
  }
}

# 3. AUTENTIKASI & MULTI-ROLE RBAC
Write-Host "`n[3/6] Menguji Autentikasi 3 Peran Akses (RBAC):"
$accounts = @(
  @{ role = "Super Admin"; email = "admin@vokasi.uns.ac.id"; pass = "admin" },
  @{ role = "Pimpinan SV"; email = "pimpinan@vokasi.uns.ac.id"; pass = "pimpinan_sv_2026" },
  @{ role = "Admin Prodi TIF"; email = "admin.tif@vokasi.uns.ac.id"; pass = "tif_vokasi_2026" }
)

$tokens = @{}
foreach ($acc in $accounts) {
  try {
    $b = @{ email = $acc.email; password = $acc.pass } | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $b -ContentType "application/json"
    $tokens[$acc.role] = $login.data.token
    Write-Host "  ✅ Login $($acc.role) ($($acc.email)) -> Berhasil [Token JWT Didapat]"
  } catch {
    Write-Host "  ❌ Login $($acc.role) -> Gagal: $($_.Exception.Message)"
  }
}

# 4. FITUR SUPER ADMIN (PENGGUNA, MODERASI, CMS LANDING PAGE)
Write-Host "`n[4/6] Menguji Fitur Dashboard Super Admin:"
$adminHeaders = @{ Authorization = "Bearer $($tokens['Super Admin'])"; Accept = "application/json" }

# A. Users
try {
  $users = Invoke-RestMethod -Uri "$baseUrl/admin/users" -Headers $adminHeaders
  Write-Host "  ✅ Kelola Pengguna: $($users.data.users.Count) akun terdaftar di MySQL"
} catch {
  Write-Host "  ❌ Kelola Pengguna -> Error: $($_.Exception.Message)"
}

# B. Moderasi
try {
  $mod = Invoke-RestMethod -Uri "$baseUrl/admin/items/1/status" -Method Patch -Body (@{ status_publikasi = "published" } | ConvertTo-Json) -ContentType "application/json" -Headers $adminHeaders
  Write-Host "  ✅ Moderasi Katalog: Status item #1 -> $($mod.data.status_publikasi)"
} catch {
  Write-Host "  ❌ Moderasi Katalog -> Error: $($_.Exception.Message)"
}

# C. CMS Settings (3 Lini Layanan & Hero)
try {
  $cmsBody = @{
    settings = @{
      services_tagline = "Taksonomi Layanan Vokasi"
      service1_title = "1. Teknologi & SaaS"
      service2_title = "2. Produk Fisik & IoT"
      service3_title = "3. Jasa Software House"
    }
  } | ConvertTo-Json
  $cms = Invoke-RestMethod -Uri "$baseUrl/admin/settings" -Method Post -Body $cmsBody -ContentType "application/json" -Headers $adminHeaders
  Write-Host "  ✅ CMS Landing Page: Simpan pengaturan 3 Lini Layanan -> Berhasil ($($cms.message))"
} catch {
  Write-Host "  ❌ CMS Landing Page -> Error: $($_.Exception.Message)"
}

# 5. FITUR EKSEKUTIF PIMPINAN SV
Write-Host "`n[5/6] Menguji Fitur Dashboard Pimpinan SV:"
$pimpHeaders = @{ Authorization = "Bearer $($tokens['Pimpinan SV'])"; Accept = "application/json" }
try {
  $stats = Invoke-RestMethod -Uri "$baseUrl/pimpinan/dashboard-stats" -Headers $pimpHeaders
  Write-Host "  ✅ Executive Analytics: $($stats.data.summary.total_items) Inovasi, $($stats.data.summary.total_views) Views, $($stats.data.summary.total_demo_clicks) Demo Clicks, $($stats.data.summary.total_inquiries) Inquiries"
} catch {
  Write-Host "  ❌ Executive Analytics -> Error: $($_.Exception.Message)"
}

# 6. FITUR PRODI
Write-Host "`n[6/6] Menguji Fitur Dashboard Administrator Prodi:"
$prodiHeaders = @{ Authorization = "Bearer $($tokens['Admin Prodi TIF'])"; Accept = "application/json" }
try {
  $myItems = Invoke-RestMethod -Uri "$baseUrl/prodi/my-items" -Headers $prodiHeaders
  Write-Host "  ✅ Katalog Prodi: Total $($myItems.data.Count) item inovasi terhubung ke prodi"
} catch {
  Write-Host "  ❌ Katalog Prodi -> Error: $($_.Exception.Message)"
}

Write-Host "`n=========================================================="
Write-Host "🎉 SELURUH PENGUJIAN SELESAI"
Write-Host "=========================================================="
