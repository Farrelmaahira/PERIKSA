# Azure deployment

Backend dan AI engine dideploy oleh `.github/workflows/deploy-azure.yml`. Backend memakai Azure App Service Linux dengan HTTPS publik; AI engine memakai Azure Container Instances dengan port gRPC `50051`.

## GitHub configuration

Buat GitHub Actions OIDC trust untuk repository `Farrelmaahira/PERIKSA`, lalu simpan secrets berikut:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `POSTGRES_ADMIN_PASSWORD`
- `PERIKSA_SECRET`
- `AI_API_KEY`
- `GEMINI_API_KEY` dan/atau `GROQ_API_KEY`

Set repository variables berikut. Semua nama resource harus global-unique dan hanya memakai huruf kecil/angka/hyphen sesuai aturan Azure:

- `AZURE_ACR`
- `AZURE_POSTGRES`
- `AZURE_REDIS`
- `AZURE_STORAGE`
- `AZURE_LOCATION` (opsional, default `southeastasia`)
- `AZURE_RESOURCE_GROUP` (opsional, default `periksa-prod`)
- `WEB_ORIGIN` (opsional; isi URL FE production)

Push ke `main` akan membuat resource group, PostgreSQL, storage account, App Service Plan, dan ACR, lalu build dan deploy image backend serta AI engine. Redis sengaja tidak diprovision karena layanan Redis lama sudah retired pada subscription; backend memakai cache no-op dan rate limiter in-memory. FE cukup memakai:

```text
NEXT_PUBLIC_API_URL=https://<backend-fqdn>/api/v1
```

Workflow membangun image migrasi terpisah dari `backend/cmd/migrate`, menjalankannya sebagai Container Instance sekali jalan, dan tidak pernah menjalankan reset schema.

## Troubleshooting login 401 di production

Geo `401 Unauthorized` pada `POST /api/v1/auth/login` **belum tentu** email/sandi salah. Handler login meneruskan kegagalan koneksi database sebagai error server (`500`) sejak perbaikan ini, tetapi deployment lama bisa menampilkannya sebagai 401.

Langkah diagnosa cepat:

1. `GET https://<backend-fqdn>/readyz` harus `200`. Bila `503`, backend tidak bisa menjangkau PostgreSQL.
2. Bandingkan `DATABASE_URL` di App Service dengan password PostgreSQL yang berlaku:

   ```bash
   az webapp config appsettings list -n periksa-backend -g <resource-group> \
     --query "[?name=='DATABASE_URL'].value" -o tsv
   az postgres flexible-server show -n <postgres-name> -g <resource-group> \
     --query administratorLogin -o tsv
   ```

3. Jika password dirotasi lewat Portal/CLI di luar pipeline, `DATABASE_URL` menjadi basi. Samakan keduanya: perbarui secret `POSTGRES_ADMIN_PASSWORD` di GitHub, lalu jalankan ulang workflow (step **Sync backend database credentials** akan menulis `DATABASE_URL` dari secret yang sama dengan container migrasi).

Workflow sekarang berakhir dengan smoke test: `/readyz` harus `200` dan login `tester@periksa.id` / `periksa123` harus `200`. Deploy dianggap gagal bila salah satunya tidak terpenuhi, sehingga masalah ini tidak lagi lolos diam-diam.

Akun demo berasal dari `backend/scripts/seed_demo.sql` (idempoten, dijalankan saat migrasi). Semua email akun demo memakai domain `@periksa.id` dan sandi `periksa123`.

