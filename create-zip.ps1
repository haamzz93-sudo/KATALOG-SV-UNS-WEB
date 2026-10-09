$zipPath = "D:\Landing Page\KATALOG UNS\frontend-siap-upload-ke-katalog.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

$tempDir = "D:\Landing Page\KATALOG UNS\temp_frontend_pack"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path "$tempDir\frontend" -Force | Out-Null

$itemsToCopy = @(
  'src',
  'public',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  '.env.local'
)

foreach ($item in $itemsToCopy) {
  $src = "D:\Landing Page\KATALOG UNS\frontend\$item"
  if (Test-Path $src) {
    Copy-Item -Path $src -Destination "$tempDir\frontend" -Recurse -Force
  }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath)
Remove-Item -Recurse -Force $tempDir

$zipItem = Get-Item $zipPath
Write-Host "Zip created successfully:" $zipItem.FullName "Size:" ([math]::Round($zipItem.Length / 1MB, 2)) "MB"
