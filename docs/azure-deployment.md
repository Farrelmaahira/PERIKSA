# Azure deployment

Backend dan AI engine dideploy oleh `.github/workflows/deploy-azure.yml` ke Azure Container Apps. Backend memiliki ingress HTTPS publik; AI engine memakai ingress TCP internal pada port gRPC `50051`.

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
- `AZURE_ENVIRONMENT` (opsional, default `periksa-prod-env`)
- `WEB_ORIGIN` (opsional; isi URL FE production)

Push ke `main` akan membuat resource group, PostgreSQL, Redis, storage file share, Container Apps environment, ACR, lalu build dan deploy image backend serta AI engine. FE cukup memakai:

```text
NEXT_PUBLIC_API_URL=https://<backend-fqdn>/api/v1
```

Workflow membangun image migrasi terpisah dari `backend/cmd/migrate`, menjalankannya sebagai Container Apps Job, dan tidak pernah menjalankan reset schema.
