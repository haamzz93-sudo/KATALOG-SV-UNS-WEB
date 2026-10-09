$ErrorActionPreference = "Stop"

$baseDir = "D:\Landing Page\KATALOG UNS"
$stageDir = Join-Path $baseDir "vps_package_stage"
$zipOutput = Join-Path $baseDir "KATALOG-VOKASI-UNS-SIAP-DEPLOY-VPS.zip"

Write-Host ">>> Memulai persiapan paket deployment VPS..." -ForegroundColor Cyan

# Hapus stage lama jika ada
if (Test-Path $stageDir) {
    Remove-Item -Recurse -Force $stageDir
}
if (Test-Path $zipOutput) {
    Remove-Item -Force $zipOutput
}

New-Item -ItemType Directory -Path $stageDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stageDir "frontend") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stageDir "backend") | Out-Null

Write-Host ">>> Menyalin berkas frontend (tanpa node_modules dan .next)..." -ForegroundColor Yellow
$frontendSrc = Join-Path $baseDir "frontend"
$frontendDest = Join-Path $stageDir "frontend"

# Copy specific frontend directories and files
$frontendItems = @("src", "public", "package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs")
foreach ($item in $frontendItems) {
    $srcPath = Join-Path $frontendSrc $item
    if (Test-Path $srcPath) {
        Copy-Item -Recurse -Force $srcPath -Destination (Join-Path $frontendDest $item)
    }
}

# Buat contoh .env.production untuk frontend
$frontendEnvContent = @"
NEXT_PUBLIC_API_URL=http://your-server-ip:8000/api
NEXT_PUBLIC_APP_NAME="Katalog Inovasi Sekolah Vokasi UNS"
NEXT_PUBLIC_APP_ENV=production
"@
Set-Content -Path (Join-Path $frontendDest ".env.production.example") -Value $frontendEnvContent

Write-Host ">>> Menyalin berkas backend Laravel (tanpa vendor dan cache)..." -ForegroundColor Yellow
$backendSrc = Join-Path $baseDir "backend"
$backendDest = Join-Path $stageDir "backend"

$backendItems = @("app", "bootstrap", "config", "database", "public", "resources", "routes", "composer.json", "composer.lock", "artisan")
foreach ($item in $backendItems) {
    $srcPath = Join-Path $backendSrc $item
    if (Test-Path $srcPath) {
        Copy-Item -Recurse -Force $srcPath -Destination (Join-Path $backendDest $item)
    }
}

# Buat storage folder struktur yang bersih
$storageDirs = @(
    "storage\app\public",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\testing",
    "storage\framework\views",
    "storage\logs"
)
foreach ($dir in $storageDirs) {
    $fullPath = Join-Path $backendDest $dir
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Set-Content -Path (Join-Path $fullPath ".gitignore") -Value "*`n!.gitignore"
}

# Contoh .env.production untuk backend
$backendEnvContent = @"
APP_NAME="Katalog Inovasi Vokasi UNS"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY_HERE
APP_DEBUG=false
APP_URL=http://your-server-ip:8000
FRONTEND_URL=http://your-server-ip:3000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=katalog_vokasi_uns
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
"@
Set-Content -Path (Join-Path $backendDest ".env.example") -Value $backendEnvContent

Write-Host ">>> Menyalin SQL Database Dump & Panduan Deploy..." -ForegroundColor Yellow
Copy-Item (Join-Path $baseDir "database_katalog_vokasi_uns.sql") -Destination $stageDir
Copy-Item (Join-Path $baseDir "PANDUAN-DEPLOY-VPS.md") -Destination $stageDir

# Ringkasan isi direktori sebelum di-zip
Get-ChildItem -Recurse $stageDir | Measure-Object -Property Length -Sum | ForEach-Object {
    $totalMB = $_.Sum / 1MB
    Write-Host (">>> Total ukuran berkas staging yang akan di-zip: {0:N2} MB" -f $totalMB) -ForegroundColor Green
}

Write-Host ">>> Mengompresi ke file ZIP: $zipOutput ..." -ForegroundColor Cyan
[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null
[System.IO.Compression.ZipFile]::CreateFromDirectory($stageDir, $zipOutput, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# Hapus staging folder setelah selesai
Remove-Item -Recurse -Force $stageDir

$zipInfo = Get-Item $zipOutput
$zipSizeMB = $zipInfo.Length / 1MB
Write-Host (">>> SELESAI! File ZIP berhasil dibuat:`n    Lokasi: {0}`n    Ukuran: {1:N2} MB" -f $zipInfo.FullName, $zipSizeMB) -ForegroundColor Green
