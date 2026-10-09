import urllib.request
import json

url = "https://katalog.unsmadiun.id/api/v1/settings"
payload = {
    "footer_address_caruban": "",
    "footer_address_surakarta": "Kampus Tirtomoyo, Universitas Sebelas Maret\nJalan Kolonel Sutarto 150 K, Jebres, Surakarta – Indonesia",
    "bg_building_left_url": "/images/backgrounds/gedung-vokasi-pusat-left.png",
    "bg_building_right_url": "/images/backgrounds/gedung-vokasi-pusat-right.png",
    "bg_campus_landscape_url": "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp",
    "bg_hero_url": "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp",
    "brand_site_title": "SEKOLAH VOKASI",
    "brand_site_subtitle": "UNIVERSITAS SEBELAS MARET",
    "brand_tagline": "Pusat Hilirisasi Riset Terapan & Inovasi Unggulan Sekolah Vokasi UNS"
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", "Accept": "application/json"})

try:
    with urllib.request.urlopen(req) as resp:
        print("Status:", resp.status)
        print("Response:", resp.read().decode("utf-8"))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
