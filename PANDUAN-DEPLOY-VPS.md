# PANDUAN LENGKAP DEPLOY KATALOG INOVASI SEKOLAH VOKASI UNS KE VPS UBUNTU / DEBIAN

Dokumen ini berisi panduan langkah demi langkah untuk melakukan deploy aplikasi **Katalog Inovasi Sekolah Vokasi UNS (Next.js 16 Frontend + Laravel 11 Backend API + MySQL Database)** di server VPS (Ubuntu 22.04 / 24.04 LTS).

---

## 1. Persyaratan Server (Server Prerequisites)
- **OS:** Ubuntu 22.04 LTS atau 24.04 LTS
- **Web Server:** Nginx
- **Node.js:** v20.x atau v22.x LTS + PM2 (Process Manager)
- **PHP:** PHP 8.2 atau PHP 8.3-FPM beserta ekstensi (`php8.2-fpm`, `php8.2-mysql`, `php8.2-mbstring`, `php8.2-xml`, `php8.2-curl`, `php8.2-zip`, `php8.2-bcmath`)
- **Database:** MySQL 8.0 atau MariaDB 10.11
- **Composer:** v2.x
- **SSL:** Certbot (Let's Encrypt Free SSL)

---

## 2. Instalasi Dependensi Dasar di VPS

Jalankan perintah berikut di terminal VPS:

```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Install Nginx, Git, Unzip, Curl
sudo apt install -y nginx git unzip curl software-properties-common

# Install MySQL Server
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install PHP 8.2 / 8.3 & Ekstensi Laravel
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-bcmath php8.2-intl php8.2-redis
sudo systemctl enable php8.2-fpm
sudo systemctl start php8.2-fpm

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20 LTS & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

---

## 3. Ekstrak Berkas Proyek di VPS

Buat direktori proyek di `/var/www/katalog-uns`:

```bash
sudo mkdir -p /var/www/katalog-uns
sudo chown -R $USER:$USER /var/www/katalog-uns

# Upload KATALOG-VOKASI-UNS-PRODUKSI-VPS.zip ke VPS via SCP/FileZilla, lalu ekstrak:
cd /var/www/katalog-uns
unzip KATALOG-VOKASI-UNS-PRODUKSI-VPS.zip
```

---

## 4. Setup Database MySQL

1. Masuk ke MySQL console:
```bash
sudo mysql -u root -p
```

2. Jalankan perintah SQL berikut:
```sql
CREATE DATABASE katalog_vokasi_uns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vokasi_user'@'localhost' IDENTIFIED BY 'PasswordKuatVokasi2026!';
GRANT ALL PRIVILEGES ON katalog_vokasi_uns.* TO 'vokasi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. Import database dump yang sudah disediakan:
```bash
mysql -u vokasi_user -p katalog_vokasi_uns < /var/www/katalog-uns/database_katalog_vokasi_uns.sql
```

---

## 5. Konfigurasi Backend (Laravel 11)

```bash
cd /var/www/katalog-uns/backend

# Copy .env
cp .env.example .env

# Edit .env sesuai konfigurasi database VPS
nano .env
```

Sesuaikan baris berikut di file `.env`:
```env
APP_NAME="Katalog Inovasi SV UNS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domain-anda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=katalog_vokasi_uns
DB_USERNAME=vokasi_user
DB_PASSWORD=PasswordKuatVokasi2026!

SESSION_DRIVER=database
CACHE_STORE=database
```

Jalankan instalasi dependensi & generate key:
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permission storage & bootstrap cache
sudo chown -R www-data:www-data /var/www/katalog-uns/backend/storage /var/www/katalog-uns/backend/bootstrap/cache
sudo chmod -R 775 /var/www/katalog-uns/backend/storage /var/www/katalog-uns/backend/bootstrap/cache
```

---

## 6. Konfigurasi Frontend (Next.js 16 App Router)

```bash
cd /var/www/katalog-uns/frontend

# Edit .env.local untuk menghubungkan Frontend ke Backend API VPS
nano .env.local
```

Isi dengan:
```env
NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api/v1
```

Build Next.js untuk produksi:
```bash
npm install
npm run build

# Jalankan Frontend dengan PM2 agar aktif 24/7 dan auto-restart saat reboot
pm2 start npm --name "katalog-frontend" -- start -- -p 3000
pm2 save
pm2 startup
```

---

## 7. Konfigurasi Nginx Reverse Proxy & SSL

### A. Konfigurasi Nginx untuk Frontend (domain utama, misal: `katalog.vokasi.uns.ac.id`)
Buat file `/etc/nginx/sites-available/katalog-frontend`:
```bash
sudo nano /etc/nginx/sites-available/katalog-frontend
```

Isi konfigurasi:
```nginx
server {
    server_name katalog.domain-anda.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}
```

### B. Konfigurasi Nginx untuk Backend API (misal: `api.katalog.domain-anda.com`)
```bash
sudo nano /etc/nginx/sites-available/katalog-backend
```

Isi konfigurasi:
```nginx
server {
    server_name api.domain-anda.com;
    root /var/www/katalog-uns/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 50M;
}
```

Aktifkan konfigurasi Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/katalog-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/katalog-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### C. Pasang Gratis SSL Let's Encrypt (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d katalog.domain-anda.com -d api.domain-anda.com
```

---

## 8. Akun Login Default Bawaan Institusi
- **Super Administrator SV:** `admin@vokasi.uns.ac.id` / `admin`
- **Pimpinan Sekolah Vokasi (Executive Analytics):** `pimpinan@vokasi.uns.ac.id` / `pimpinan_sv_2026`
- **Admin Prodi TIF:** `admin.tif@vokasi.uns.ac.id` / `admin`
- **Admin Prodi Akuntansi:** `admin.akuntansi@vokasi.uns.ac.id` / `admin`
