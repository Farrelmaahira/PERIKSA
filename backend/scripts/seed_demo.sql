-- Akun demo yang tampil di halaman login (frontend/src/data/auth.ts seedAccounts).
-- Kata sandi semua akun: periksa123 (hash bcrypt cost 10 asli, tanpa bypass di kode).
-- Prasyarat: PERIKSA.sql dan seed_villages.sql sudah dijalankan.
-- Idempoten: INSERT ... ON CONFLICT DO NOTHING / WHERE NOT EXISTS; tidak pernah menimpa sandi.
-- Satu-satunya UPDATE adalah koreksi alamat lama (lihat di bawah), bukan perubahan data akun.
-- Bila email sudah ada dengan data lain, baris itu dibiarkan apa adanya (sandinya tidak ditimpa).
-- Jalankan: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/scripts/seed_demo.sql

BEGIN;

-- Koreksi alamat lama: sempat tersimpan sebagai budi.santoso@warga.id, sementara
-- daftar akun demo di frontend memakai domain @periksa.id. Tanpa ini login demo
-- Budi Santoso selalu 401 di deployment yang sudah pernah ter-seed.
UPDATE users SET email = 'budi.santoso@periksa.id'
WHERE email = 'budi.santoso@warga.id'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'budi.santoso@periksa.id');

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM villages WHERE nama = 'Desa Sukamaju') THEN
    RAISE EXCEPTION 'Desa Sukamaju belum ada: jalankan seed_villages.sql dulu';
  END IF;
END $$;

-- Wilayah kedua untuk akun inspektorat ("Punya 2 wilayah"). Wilayah pertama = wilayah Desa Sukamaju.
INSERT INTO regions (nama, jenis, provinsi)
SELECT 'Kabupaten Purbalingga', 'kabupaten', 'Jawa Tengah'
WHERE NOT EXISTS (SELECT 1 FROM regions WHERE nama = 'Kabupaten Purbalingga');

INSERT INTO users (nama, email, password_hash, status) VALUES
  ('Tester PERIKSA Multi-Peran', 'tester@periksa.id',  '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Hendra Wijaya',      'kades@periksa.id',        '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Rina Kartika',       'penyedia@periksa.id',     '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Asep Saepudin',      'bpd@periksa.id',          '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Dewi Lestari',       'inspektorat@periksa.id',  '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Siti Rahma',         'warga@periksa.id',        '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif'),
  ('Budi Santoso Warga', 'budi.santoso@periksa.id',   '$2a$10$bQ5ukg9P6bGG63LP/pGH6.FFcHV4ynYxI9LbKFBJnZyYprUxH9d6e', 'aktif')
ON CONFLICT (email) DO NOTHING;

-- Peran berbasis desa (kades, bpd, warga) di Desa Sukamaju.
INSERT INTO user_roles (user_id, role, village_id)
SELECT u.id, x.role::user_roles_role_enum, v.id
FROM (VALUES ('tester@periksa.id', 'kades'), ('tester@periksa.id', 'bpd'), ('tester@periksa.id', 'warga'),
             ('kades@periksa.id', 'kades'), ('bpd@periksa.id', 'bpd'),
             ('warga@periksa.id', 'warga'), ('budi.santoso@periksa.id', 'warga')) AS x(email, role)
JOIN users u ON u.email = x.email
JOIN LATERAL (SELECT id FROM villages WHERE nama = 'Desa Sukamaju' ORDER BY id LIMIT 1) v ON TRUE
WHERE NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role::text = x.role);

-- Penyedia: peran tanpa desa + profil usaha CV Maju Bersama yang terhubung ke akunnya.
INSERT INTO user_roles (user_id, role)
SELECT u.id, 'penyedia' FROM users u
WHERE u.email IN ('penyedia@periksa.id', 'tester@periksa.id')
  AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = 'penyedia');

INSERT INTO counterparties (user_id, nama, jenis, npwp, alamat)
SELECT u.id, 'CV Maju Bersama', 'penyedia', '01.234.567.8-405.000', 'Jl. Raya Sukamaju No. 12, Banyumas'
FROM users u
WHERE u.email IN ('penyedia@periksa.id', 'tester@periksa.id')
  AND NOT EXISTS (SELECT 1 FROM counterparties k WHERE k.user_id = u.id);

-- Tester juga diberi akses inspektorat di dua wilayah dan admin daerah.
INSERT INTO user_roles (user_id, role, region_id)
SELECT u.id, x.role::user_roles_role_enum, r.id
FROM users u
CROSS JOIN (VALUES ('inspektorat', 'Kabupaten Banyumas'), ('inspektorat', 'Kabupaten Purbalingga'),
                   ('admin_daerah', 'Kabupaten Banyumas')) AS x(role, region_name)
JOIN regions r ON r.nama = x.region_name
WHERE u.email = 'tester@periksa.id'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role::text = x.role AND ur.region_id = r.id
  );

-- Inspektorat: dua wilayah lewat user_roles.region_id (wilayah Desa Sukamaju + Kabupaten Purbalingga).
INSERT INTO user_roles (user_id, role, region_id)
SELECT u.id, 'inspektorat', r.id
FROM users u
JOIN regions r ON r.id IN (
  (SELECT region_id FROM villages WHERE nama = 'Desa Sukamaju' ORDER BY id LIMIT 1),
  (SELECT id FROM regions WHERE nama = 'Kabupaten Purbalingga' ORDER BY id LIMIT 1))
WHERE u.email = 'inspektorat@periksa.id'
  AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role = 'inspektorat' AND ur.region_id = r.id);

-- Profil warga (desa domisili + no HP).
INSERT INTO warga_profiles (user_id, village_id, no_hp)
SELECT u.id, (SELECT id FROM villages WHERE nama = 'Desa Sukamaju' ORDER BY id LIMIT 1), x.no_hp
FROM (VALUES ('warga@periksa.id', '081255500142'), ('budi.santoso@periksa.id', '081255500199')) AS x(email, no_hp)
JOIN users u ON u.email = x.email
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
