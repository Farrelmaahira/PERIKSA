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
