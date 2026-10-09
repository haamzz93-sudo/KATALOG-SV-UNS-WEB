$html = (Invoke-WebRequest -Uri 'https://katalog.unsmadiun.id' -UseBasicParsing).Content
$matches = [regex]::Matches($html, '/_next/static/[^"]+')
foreach ($m in $matches) {
    $url = "https://katalog.unsmadiun.id" + $m.Value
    try {
        $r = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing
        Write-Host "$($m.Value) -> HTTP $($r.StatusCode) ($($r.Headers['Content-Type']))"
    } catch {
        Write-Host "$($m.Value) -> ERROR: $($_.Exception.Message)"
    }
}
