-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: katalog_vokasi_uns
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog_items`
--

DROP TABLE IF EXISTS `catalog_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `prodi_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `nama_item` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `deskripsi_singkat` text NOT NULL,
  `deskripsi_lengkap` longtext NOT NULL,
  `live_demo_url` varchar(500) DEFAULT NULL,
  `model_3d_url` varchar(500) DEFAULT NULL,
  `thumbnail_url` varchar(500) NOT NULL,
  `status_publikasi` enum('draft','published','archived') NOT NULL DEFAULT 'published',
  `harga_tipe` enum('fixed','starting_at','contact_us') NOT NULL DEFAULT 'starting_at',
  `harga_nominal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `pic_nama` varchar(150) NOT NULL,
  `pic_kontak` varchar(50) NOT NULL,
  `pic_laboratorium` varchar(150) DEFAULT NULL,
  `view_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `demo_click_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `inquiry_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `catalog_items_slug_unique` (`slug`),
  KEY `catalog_items_category_id_status_publikasi_index` (`category_id`,`status_publikasi`),
  KEY `catalog_items_prodi_id_status_publikasi_index` (`prodi_id`,`status_publikasi`),
  CONSTRAINT `catalog_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catalog_items_prodi_id_foreign` FOREIGN KEY (`prodi_id`) REFERENCES `prodis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_items`
--

LOCK TABLES `catalog_items` WRITE;
/*!40000 ALTER TABLE `catalog_items` DISABLE KEYS */;
INSERT INTO `catalog_items` VALUES (1,1,1,'Rintisku - SaaS Inkubasi Bisnis Mahasiswa','rintisku-saas-inkubasi-bisnis','Platform All-in-One Manajemen Portofolio & Pitching Startup Kampus','Software as a Service untuk memantau perkembangan validasi produk rintisan mahasiswa vokasi.','Rintisku menyediakan modul lean canvas terintegrasi, tracker milestone keuangan, dan penjadwalan pitching mitra industri DUDI secara otomatis.','https://rintisku-demo.vokasi.uns.ac.id',NULL,'/images/catalog/rintisku-saas-showcase.jpg','published','starting_at',2500000.00,'Dr. Darmawan, M.T. & Tim Riset TIF','6281234567890','Lab Software Engineering & AI',1240,384,14,'2026-09-26 10:14:51','2026-09-26 12:34:28'),(2,1,2,'Robot Patroli Otonom','robot-patroli-otonom','Robot Keamanan Indoor-Outdoor dengan Sensor LiDAR 360° & Edge AI Vision','Robot otonom patroli cerdas untuk pengawasan area gedung, deteksi intrusi, dan pelaporan anomali.','Robot patroli otonom ini dirancang dengan konstruksi aluminium kokoh, kemampuan navigasi SLAM mandiri tanpa kabel, dan transmisi streaming video terenkripsi.',NULL,'https://my.spline.design/arvinrobot-embed/','/images/sequence/robot-frame-01.jpg','published','fixed',45000000.00,'Tim Riset Mahasiswa & Lab Embedded Vokasi','6281234567892','Laboratorium IoT & Robotika Cerdas',2890,0,32,'2026-09-26 10:14:51','2026-09-26 10:46:00'),(3,1,3,'Vokasi Software House - Jasa Pengembangan Sistem Web & Mobile','vokasi-software-house-web-mobile','Solusi Digitalisasi Industri, Sistem Informasi Manajemen, & Custom ERP','Layanan pembuatan software teruji industri yang dibina oleh dosen pakar dan mahasiswa berprestasi.','Paket layanan mencakup tahapan Product Requirement Document (PRD), perancangan UI/UX Figma, pengembangan kode standar CI/CD, pengujian penetrasi (Pentest), dan pemeliharaan server.',NULL,NULL,'/images/catalog/software-house-showcase.jpg','published','starting_at',15000000.00,'Unit Bisnis Mahasiswa TIF UNS','6281234567893','Studio Digital Terapan Vokasi',950,0,19,'2026-09-26 10:14:51','2026-09-26 10:14:51');
/*!40000 ALTER TABLE `catalog_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog_media`
--

DROP TABLE IF EXISTS `catalog_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_item_id` bigint(20) unsigned NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `media_type` enum('image','video','glb') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `caption` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catalog_media_catalog_item_id_foreign` (`catalog_item_id`),
  CONSTRAINT `catalog_media_catalog_item_id_foreign` FOREIGN KEY (`catalog_item_id`) REFERENCES `catalog_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_media`
--

LOCK TABLES `catalog_media` WRITE;
/*!40000 ALTER TABLE `catalog_media` DISABLE KEYS */;
INSERT INTO `catalog_media` VALUES (1,1,'/images/catalog/rintisku-saas-showcase.jpg','image',1,'Mockup Antarmuka SaaS Rintisku','2026-09-26 10:14:51','2026-09-26 10:14:51'),(2,2,'/images/sequence/robot-frame-01.jpg','image',1,'Frame 01: Tampak Depan','2026-09-26 10:14:51','2026-09-26 10:14:51'),(3,2,'/images/sequence/robot-frame-02.jpg','image',0,'Frame 02: Sudut Tiga Perempat','2026-09-26 10:14:51','2026-09-26 10:14:51'),(4,2,'/images/sequence/robot-frame-03.jpg','image',0,'Frame 03: Profil Samping Penuh','2026-09-26 10:14:51','2026-09-26 10:14:51'),(5,3,'/images/catalog/software-house-showcase.jpg','image',1,'Portofolio Layanan Vokasi Software House','2026-09-26 10:14:51','2026-09-26 10:14:51');
/*!40000 ALTER TABLE `catalog_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog_specs`
--

DROP TABLE IF EXISTS `catalog_specs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalog_specs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_item_id` bigint(20) unsigned NOT NULL,
  `group_name` varchar(100) NOT NULL DEFAULT 'General',
  `spec_key` varchar(100) NOT NULL,
  `spec_value` text NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catalog_specs_catalog_item_id_foreign` (`catalog_item_id`),
  CONSTRAINT `catalog_specs_catalog_item_id_foreign` FOREIGN KEY (`catalog_item_id`) REFERENCES `catalog_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_specs`
--

LOCK TABLES `catalog_specs` WRITE;
/*!40000 ALTER TABLE `catalog_specs` DISABLE KEYS */;
INSERT INTO `catalog_specs` VALUES (1,1,'Tech Stack','Frontend','Next.js 14 App Router, Tailwind CSS',1,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(2,1,'Tech Stack','Backend API','Laravel 11 RESTful API + Redis Caching',2,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(3,1,'Deployment','Infrastruktur','Dockerized on Cloudflare & AWS RDS',3,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(4,1,'Fitur Utama','Modul Terpadu','Lean Canvas Builder, Milestone Tracker, DUDI Pitching Scheduler',4,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(5,2,'Hardware','Prosesor Edge','NVIDIA Jetson Orin Nano 8GB',1,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(6,2,'Hardware','Sensor Navigasi','RPLiDAR A2M8 360° + Depth Camera Intel RealSense',2,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(7,2,'Daya','Baterai & Daya Tahan','LiFePO4 24V 20Ah (Operasional 6-8 Jam Mandiri)',3,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(8,2,'Mobilitas','Sistem Roda','Mecanum Omni-wheel 4WD Presisi Tinggi',4,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(9,3,'Layanan','Deliverables','Source Code Git, Lisensi Penuh, Dokumentasi API',1,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(10,3,'Layanan','Estimasi Pengerjaan','30 - 60 Hari Kerja per Sprint',2,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(11,3,'Garansi','Masa Pemeliharaan','Free Bug Fixing 3 Bulan Pasca Rilis',3,'2026-09-26 10:14:51','2026-09-26 10:14:51'),(12,3,'Alur Kerja','Metodologi','Agile Scrum, PRD, Desain UI/UX Figma, Pentest',4,'2026-09-26 10:14:51','2026-09-26 10:14:51');
/*!40000 ALTER TABLE `catalog_specs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `icon_name` varchar(50) NOT NULL DEFAULT 'Box',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'teknologi','Teknologi & SaaS','Perangkat lunak, aplikasi web, platform SaaS, dan solusi AI kampus dengan akses live demo interaktif.','Laptop','2026-09-26 10:14:51','2026-09-26 10:14:51'),(2,'produk','Produk Fisik & IoT','Alat robotika, manufaktur mekatronika, perangkat embedded IoT karya laboratorium terapan.','Cpu','2026-09-26 10:14:51','2026-09-26 10:14:51'),(3,'jasa','Jasa & Konsultasi','Jasa pengembangan sistem perangkat lunak, permesinan presisi, pengujian lab, dan konsultasi industri.','Wrench','2026-09-26 10:14:51','2026-09-26 10:14:51');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inquiries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catalog_item_id` bigint(20) unsigned NOT NULL,
  `nama_pengunjung` varchar(150) NOT NULL,
  `instansi` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `no_wa` varchar(50) NOT NULL,
  `pesan` text NOT NULL,
  `status` enum('unread','responded','deal') NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inquiries_catalog_item_id_foreign` (`catalog_item_id`),
  CONSTRAINT `inquiries_catalog_item_id_foreign` FOREIGN KEY (`catalog_item_id`) REFERENCES `catalog_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (1,1,'Budi Santoso','PT Solusi Teknologi Nusantara','budi@solusitek.co.id','6281122334455','Tertarik untuk mengadopsi platform SaaS Rintisku untuk program inkubasi startup internal perusahaan kami.','responded','2026-09-23 10:14:51','2026-09-25 10:14:51'),(2,2,'Hendro Wijaya','PT Manufaktur Presisi Cikarang','hendro@presisi.com','6281199887766','Mohon penawaran harga pengadaan 2 unit Robot Patroli Otonom untuk keamanan pergudangan.','deal','2026-09-21 10:14:51','2026-09-26 10:46:09'),(3,3,'Siti Rahmawati','Dinas Koperasi & UMKM Madiun','siti@madiunkab.go.id','6281344556677','Kami membutuhkan sistem informasi pendataan UMKM terintegrasi mobile dan web.','unread','2026-09-25 22:14:51','2026-09-25 22:14:51');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_26_000002_create_catalog_tables',1),(5,'2026_09_26_171254_create_personal_access_tokens_table',1),(6,'2026_09_28_103058_create_site_settings_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',3,'auth_token','2489bafc588b7ae65122752aec8e90cf8ed3fd7a8365c0a4b966f1bfb102c397','[\"*\"]',NULL,NULL,'2026-09-26 10:16:21','2026-09-26 10:16:21'),(2,'App\\Models\\User',4,'auth_token','2235b785c77677d8b672af469e17fa8de582d86ab58ec66cf70d848d205dd342','[\"*\"]',NULL,NULL,'2026-09-26 10:39:17','2026-09-26 10:39:17'),(3,'App\\Models\\User',4,'auth_token','20ff30b97aa5bb14c93f03937b09e7913b96b7c047ca277a3e88259ce5db0776','[\"*\"]','2026-09-27 20:18:42',NULL,'2026-09-26 10:44:20','2026-09-27 20:18:42'),(4,'App\\Models\\User',4,'auth_token','9070a83bfc57f88add68695494c60ef2ccfd0a1474c7ead441002d53ede7b600','[\"*\"]','2026-09-27 20:36:17',NULL,'2026-09-27 20:35:54','2026-09-27 20:36:17'),(5,'App\\Models\\User',4,'auth_token','e56aeb167d3b8b97008e80644024799e598b13d8205bc3ce6e9b3a35e517af10','[\"*\"]','2026-09-28 00:33:41',NULL,'2026-09-27 23:43:01','2026-09-28 00:33:41'),(6,'App\\Models\\User',4,'auth_token','159d30cc88cd185488aa122a006c104553c02ab1ec96c378092ed21a78e3003f','[\"*\"]','2026-09-28 03:25:12',NULL,'2026-09-28 00:40:19','2026-09-28 03:25:12'),(7,'App\\Models\\User',4,'auth_token','307c0b008f55edf7166dfea53d6befd31a7533ab21de2148431d63e0d0b1a6f4','[\"*\"]','2026-09-28 03:25:20',NULL,'2026-09-28 03:25:17','2026-09-28 03:25:20'),(8,'App\\Models\\User',4,'auth_token','c24fd9e34c268576ca1640ff1f9873eb8662d27393cbf6de7e54b4021f81365e','[\"*\"]','2026-09-28 03:28:53',NULL,'2026-09-28 03:28:43','2026-09-28 03:28:53'),(9,'App\\Models\\User',2,'auth_token','76f22d03f184f6ba2e6eccf5cef9efde39c0f3dc361d3ea824a9a7cbae262d51','[\"*\"]',NULL,NULL,'2026-09-28 03:30:14','2026-09-28 03:30:14'),(10,'App\\Models\\User',3,'auth_token','28574dd5e1398a62373ee4d9c70f68966decc78ca6e13abd3a4c8eeb7da69396','[\"*\"]',NULL,NULL,'2026-09-28 03:30:25','2026-09-28 03:30:25'),(11,'App\\Models\\User',4,'auth_token','aa587cb75238de6df0c97af079d90981be20d9eff24a0cdf2876403975765117','[\"*\"]','2026-09-28 03:45:25',NULL,'2026-09-28 03:45:22','2026-09-28 03:45:25'),(12,'App\\Models\\User',4,'auth_token','ecdd8455cd34d4dec3914366e05b2e71570a5a4fc3e726815d350127979121eb','[\"*\"]','2026-09-28 03:48:00',NULL,'2026-09-28 03:48:00','2026-09-28 03:48:00'),(13,'App\\Models\\User',4,'auth_token','519f9820b1e1183b2b5209b41a31c91c6f626072d6b307d353557ba024fa8929','[\"*\"]',NULL,NULL,'2026-09-28 03:53:17','2026-09-28 03:53:17'),(14,'App\\Models\\User',2,'auth_token','60a5e8cec8636595b982d8d63d9dd1e29eee9014c4741cd2b155d94c084123c8','[\"*\"]',NULL,NULL,'2026-09-28 03:53:19','2026-09-28 03:53:19'),(15,'App\\Models\\User',3,'auth_token','ed3367bc8ce3ffd82afafb067fd0fb19829b891b11e4aba0d60a35e8fffed46e','[\"*\"]',NULL,NULL,'2026-09-28 03:53:21','2026-09-28 03:53:21'),(16,'App\\Models\\User',4,'auth_token','72b658c5df20a5b5ea7bb2c525d5bf5d804c4b1d6739610b623adcf48f80938a','[\"*\"]','2026-09-28 03:53:51',NULL,'2026-09-28 03:53:50','2026-09-28 03:53:51'),(17,'App\\Models\\User',4,'auth_token','8884100476d8ebc8996b691db69efe1c6e2b575ff14da6863f232920809d68aa','[\"*\"]','2026-09-28 03:54:07',NULL,'2026-09-28 03:54:06','2026-09-28 03:54:07'),(18,'App\\Models\\User',4,'auth_token','dcd5b95614cd3b9fb80bd245fb9f662c889e8aeb205b099b25599efe3c79c854','[\"*\"]','2026-09-28 03:55:35',NULL,'2026-09-28 03:55:19','2026-09-28 03:55:35'),(19,'App\\Models\\User',4,'auth_token','e83c7a233f65f292319b5b1a22501a18517d2ea9ed1e3a93890b5a4c374270a3','[\"*\"]','2026-09-28 04:05:43',NULL,'2026-09-28 03:56:18','2026-09-28 04:05:43'),(20,'App\\Models\\User',4,'auth_token','ad3f8ca46f0ad5b4cd78202245d66f748f1793bb0d21a55bbde243893d28d691','[\"*\"]','2026-09-28 04:00:05',NULL,'2026-09-28 04:00:04','2026-09-28 04:00:05'),(21,'App\\Models\\User',4,'auth_token','9956e18570279d11684d7554ecf99f5df7646343e94fe00f43ef74877c5474bd','[\"*\"]',NULL,NULL,'2026-09-28 07:13:51','2026-09-28 07:13:51'),(22,'App\\Models\\User',4,'auth_token','9b8f2eb3076212a3e8a731d13eba1d2660dcd73deeea7a619af54935be266fa9','[\"*\"]',NULL,NULL,'2026-10-06 21:20:19','2026-10-06 21:20:19'),(23,'App\\Models\\User',4,'auth_token','5bbd3220cd18ab55137895109f186ed98462a390b78d1cf5289146480be926dd','[\"*\"]','2026-10-06 21:23:34',NULL,'2026-10-06 21:23:32','2026-10-06 21:23:34');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prodis`
--

DROP TABLE IF EXISTS `prodis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prodis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `kode_prodi` varchar(20) NOT NULL,
  `nama_prodi` varchar(150) NOT NULL,
  `jenjang` varchar(50) DEFAULT 'D3',
  `fakultas_sekolah` varchar(100) NOT NULL DEFAULT 'Sekolah Vokasi',
  `kontak_email` varchar(100) DEFAULT NULL,
  `kontak_wa` varchar(30) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prodis_kode_prodi_unique` (`kode_prodi`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodis`
--

LOCK TABLES `prodis` WRITE;
/*!40000 ALTER TABLE `prodis` DISABLE KEYS */;
INSERT INTO `prodis` VALUES (1,'D3-TIF','D3 Teknik Informatika','D3','Sekolah Vokasi UNS','tif@vokasi.uns.ac.id','6281234567890','/images/brand/logo-sv-uns-official-color.png','2026-09-26 10:56:43','2026-09-26 10:56:43'),(3,'D3-AKT','D3 Akuntansi','D3','Sekolah Vokasi UNS','akuntansi@vokasi.uns.ac.id','6281234567801','/images/brand/logo-sv-uns-official-color.png','2026-09-26 10:56:43','2026-09-26 10:56:43'),(4,'D4-TRP','Sarjana Terapan Teknologi Rekayasa Pangan','Sarjana Terapan','Sekolah Vokasi UNS','trp@vokasi.uns.ac.id','6281234567802','/images/brand/logo-sv-uns-official-color.png','2026-09-26 10:56:43','2026-09-26 10:56:43'),(5,'D4-K3','Sarjana Terapan Kesehatan dan Keselamatan Kerja','Sarjana Terapan','Sekolah Vokasi UNS','k3@vokasi.uns.ac.id','6281234567803','/images/brand/logo-sv-uns-official-color.png','2026-09-26 10:56:43','2026-09-26 10:56:43'),(6,'D4-TIKA','Sarjana Terapan Teknologi Informasi dan Kecerdasan Artifisial','Sarjana Terapan','Sekolah Vokasi UNS','tika@vokasi.uns.ac.id','6281234567804','/images/brand/logo-sv-uns-official-color.png','2026-09-26 10:56:43','2026-09-26 10:56:43');
/*!40000 ALTER TABLE `prodis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super_admin','Super Administrator SV','2026-09-26 10:14:50','2026-09-26 10:14:50'),(2,'pimpinan_sv','Pimpinan Sekolah Vokasi (View Only)','2026-09-26 10:14:50','2026-09-26 10:14:50'),(3,'prodi','Administrator Program Studi','2026-09-26 10:14:50','2026-09-26 10:14:50');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` longtext DEFAULT NULL,
  `group` varchar(50) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'brand_logo_url','/images/brand/logo-sv-uns-official-white.png','brand','2026-09-28 03:32:36','2026-09-28 03:32:36'),(2,'brand_logo_color_url','/images/brand/logo-sv-uns-official-color.png','brand','2026-09-28 03:32:36','2026-09-28 03:32:36'),(3,'brand_site_title','SEKOLAH VOKASI','brand','2026-09-28 03:32:36','2026-09-28 03:32:36'),(4,'brand_site_subtitle','UNS KAMPUS MADIUN','brand','2026-09-28 03:32:36','2026-09-28 03:32:36'),(5,'brand_tagline','Pusat Hilirisasi Riset Terapan & Inovasi Unggulan Kampus Madiun','brand','2026-09-28 03:32:36','2026-09-28 03:32:36'),(6,'hero_badge','Katalog Resmi Inovasi Terapan 2026','hero','2026-09-28 03:32:36','2026-09-28 03:32:36'),(7,'hero_title_p1','Bisnis & Inovasi Terapan','hero','2026-09-28 03:32:36','2026-09-28 03:32:36'),(8,'hero_title_p2','Sekolah Vokasi UNS Madiun','hero','2026-09-28 03:32:36','2026-09-28 03:32:36'),(9,'hero_subtitle','Hilirisasi riset aplikatif, produk perangkat lunak SaaS, instrumen robotika IoT, dan jasa software house siap kemitraan Dunia Usaha & Dunia Industri (DUDI).','hero','2026-09-28 03:32:36','2026-09-28 03:32:36'),(10,'login_title','Portal Autentikasi Pengguna','login','2026-09-28 03:32:36','2026-09-28 03:32:36'),(11,'login_subtitle','Masuk sebagai Super Admin, Pimpinan SV, atau Administrator Prodi.','login','2026-09-28 03:32:36','2026-09-28 03:32:36'),(12,'login_logo_url','/images/brand/logo-sv-uns-official-white.png','login','2026-09-28 03:32:36','2026-09-28 03:32:36'),(13,'login_bg_silhouette_url','/images/backgrounds/uns-login-silhouette-blue.webp','login','2026-09-28 03:32:36','2026-09-28 03:32:36'),(14,'footer_address','Jl. Imam Bonjol, Pandean, Kec. Mejayan, Kabupaten Madiun, Jawa Timur 63153','footer','2026-09-28 03:32:36','2026-09-28 03:32:36'),(15,'footer_email','vokasi@unit.uns.ac.id','footer','2026-09-28 03:32:36','2026-09-28 03:32:36'),(16,'footer_phone','(0271) 664178 / Humas SV','footer','2026-09-28 03:32:36','2026-09-28 03:32:36'),(17,'footer_copyright','© 2026 Sekolah Vokasi Universitas Sebelas Maret (UNS). Seluruh Hak Cipta Dilindungi.','footer','2026-09-28 03:32:36','2026-09-28 03:32:36'),(18,'footer_description','Platform etalase resmi karya inovasi, riset terapan, produk teknologi siap komersialisasi, dan layanan jasa industri civitas akademika Sekolah Vokasi UNS Kampus Madiun.','footer','2026-09-28 03:32:36','2026-09-28 03:32:36');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned NOT NULL,
  `prodi_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_prodi_id_foreign` (`prodi_id`),
  CONSTRAINT `users_prodi_id_foreign` FOREIGN KEY (`prodi_id`) REFERENCES `prodis` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,2,NULL,'Pimpinan Sekolah Vokasi','pimpinan@vokasi.uns.ac.id',NULL,'$2y$12$GAXMdVP19iN6U5Zjr8vCC.3Zi9XKUFCmeGCxI/rWdQkHXCL/yNDo.',1,NULL,'2026-09-26 10:14:51','2026-09-28 03:58:27'),(3,3,1,'Admin Prodi TIF','admin.tif@vokasi.uns.ac.id',NULL,'$2y$12$3j3XZH54nQ2pdcTg//dPduQkxYuEfuIqagjbPheQHGLBj8xtfkUFm',1,NULL,'2026-09-26 10:56:44','2026-09-28 03:58:28'),(4,1,NULL,'Super Administrator SV','admin@vokasi.uns.ac.id',NULL,'$2y$12$MHTYTRFQHjvyujJQDde1DeAMT/gIJboaAgc8XBPegVEigI3xLmbZG',1,NULL,'2026-09-26 10:39:12','2026-09-28 03:58:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 11:24:51
