$baseUrl = "https://katalog.unsmadiun.id/api/v1"
$b = @{ email = "admin@vokasi.uns.ac.id"; password = "admin" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $b -ContentType "application/json"
$token = $login.data.token
$headers = @{ Authorization = "Bearer $token"; Accept = "application/json" }

# 1. Create Test Item as Super Admin
$createBody = @{
  category_id = 1
  prodi_id = 1
  nama_item = "Test Inovasi Super Admin CRUD"
  tagline = "Testing CRUD Super Admin Otomatis"
  deskripsi_singkat = "Uji coba CRUD Super Admin via API"
  deskripsi_lengkap = "Deskripsi lengkap uji coba kelola inovasi oleh Super Admin."
  thumbnail_url = "/images/brand/slogan-poster-vokasi.jpg"
  status_publikasi = "draft"
  harga_tipe = "starting_at"
  harga_nominal = 3500000
  pic_nama = "Pak Darmawan Dosen"
  pic_kontak = "6281234567890"
  pic_laboratorium = "Lab RPL Terapan"
  specs = @(
    @{ group_name = "Tech Stack"; spec_key = "Framework"; spec_value = "Next.js + Laravel" }
  )
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "$baseUrl/prodi/items" -Method Post -Body $createBody -ContentType "application/json" -Headers $headers
Write-Host "✅ Created Item ID:" $created.data.id "Name:" $created.data.nama_item

# 2. Update the Item
$updateBody = @{
  nama_item = "Test Inovasi Super Admin (Updated)"
  deskripsi_singkat = "Deskripsi setelah di-update Super Admin"
  harga_nominal = 4000000
} | ConvertTo-Json
$updated = Invoke-RestMethod -Uri "$baseUrl/prodi/items/$($created.data.id)" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
Write-Host "✅ Updated Item ID:" $updated.data.id "Updated Name:" $updated.data.nama_item

# 3. Delete the Item
$deleted = Invoke-RestMethod -Uri "$baseUrl/prodi/items/$($created.data.id)" -Method Delete -Headers $headers
Write-Host "✅ Deleted Item Response:" $deleted.message
