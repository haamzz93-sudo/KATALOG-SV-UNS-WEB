$content = (Invoke-WebRequest -Uri "https://katalog.unsmadiun.id/" -UseBasicParsing).Content
$idx = $content.IndexOf("Service 1")
if ($idx -lt 0) { $idx = $content.IndexOf("Layanan 1") }
if ($idx -ge 0) {
    Write-Host ("Found at index " + $idx)
    Write-Host $content.Substring($idx - 50, 400)
} else {
    Write-Host "Neither Service 1 nor Layanan 1 found in HTML"
}
