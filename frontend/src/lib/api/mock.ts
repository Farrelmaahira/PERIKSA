import type { ApiResult } from "@/interfaces/api";
import type {
  ContractDetailResponse,
  ContractLifecycleResponse,
  ContractListItem,
  ContractOptionsResponse,
  ContractVersionItem,
  CounterpartyResponse,
  DashboardMetricsResponse,
  SignatureItem,
} from "./contracts";
import type {
  ApiNotification,
  ApiClause,
  AuditLogItem,
  AuditLogPage,
  AuditReport,
  ContractTermin,
  Me,
  OversightAssignment,
  PaymentTerm,
  Pengawas,
  RegionRule,
  SealItem,
  TerminListItem,
} from "@/interfaces/api";
import type { CreatedReportResponse, PublicContractSummary } from "./reports";

/* Mode demo hanya aktif bila diminta eksplisit; tanpa env ini frontend selalu memakai backend. */
export const DUMMY = process.env.NEXT_PUBLIC_DUMMY === "1";

const T0 = "2026-11-01T09:00:00Z";
const T1 = "2026-11-05T14:30:00Z";
const T2 = "2026-11-08T08:15:00Z";
const T3 = "2026-11-10T16:45:00Z";

const dummyContracts: ContractListItem[] = [
  {
    id: "1",
    contractNumber: "KTR/2026/11/001",
    villageId: "sukamaju",
    villageName: "Desa Sukamaju",
    title: "Pembangunan Jalan Desa Utama",
    category: "pembangunan",
    vendorName: "CV Maju Bersama",
    amount: 350000000,
    status: "berjalan",
    sha256Hash: "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789",
    integrityScore: 96,
    rating: 4.5,
    volume: "1.2 km",
    fiscalYear: 2026,
    clausesCount: 12,
    mandatoryFulfilled: 12,
    createdBy: "u-1",
    createdAt: T0,
    updatedAt: T3,
  },
  {
    id: "2",
    contractNumber: "KTR/2026/11/002",
    villageId: "sukamaju",
    villageName: "Desa Sukamaju",
    title: "Pengadaan Alat Kesehatan Puskesmas",
    category: "barang",
    vendorName: "PT Sehat Sentosa",
    amount: 128000000,
    status: "menunggu_tanda_tangan",
    sha256Hash: "b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1",
    integrityScore: 88,
    rating: 4,
    volume: "1 paket",
    fiscalYear: 2026,
    clausesCount: 9,
    mandatoryFulfilled: 7,
    createdBy: "u-1",
    createdAt: T1,
    updatedAt: T2,
  },
  {
    id: "3",
    contractNumber: "KTR/2026/11/003",
    villageId: "cibodas",
    villageName: "Desa Cibodas",
    title: "Belanja Modal Perpustakaan Desa",
    category: "barang",
    vendorName: "UD Cerdas Mandiri",
    amount: 64000000,
    status: "selesai",
    sha256Hash: "c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2",
    integrityScore: 99,
    rating: 5,
    volume: "1 bangunan",
    fiscalYear: 2026,
    clausesCount: 10,
    mandatoryFulfilled: 10,
    createdBy: "u-2",
    createdAt: T1,
    updatedAt: T3,
  },
];

const dummyTeks =
  "KONTRAK\n\n" +
  "Pasal 1 — Objek Pekerjaan\n" +
  "Pihak pertama memberikan tugas kepada pihak kedua untuk melaksanakan pekerjaan sesuai lingkup yang tercantum dalam dokumen ini.\n\n" +
  "Pasal 2 — Nilai Kontrak\n" +
  "Nilai kontrak sebesar jumlah yang disepakati kedua belah pihak dan dibayarkan sesuai skema termin.\n\n" +
  "Pasal 3 — Jangka Waktu\n" +
  "Pekerjaan wajib selesai paling lambat pada tanggal yang disepakati dalam lampiran jadwal.\n\n" +
  "Pasal 4 — Jaminan Pemeliharaan\n" +
  "Pihak kedua memberikan jaminan pemeliharaan selama 90 hari kalender setelah serah terima.";

const dummyVersions: ContractVersionItem[] = [
  {
    id: 1,
    contractId: 1,
    nomorVersi: 1,
    isi: dummyTeks,
    sumber: "ai",
    createdBy: 1,
    createdAt: T0,
  },
];

const dummySignatures: SignatureItem[] = [
  {
    id: 1,
    versionId: 1,
    partyId: 1,
    signerUserId: 1,
    metode: "digital",
    referensi: "KTR/2026/11/001",
    waktu: T2,
  },
];

const dummyOptions: ContractOptionsResponse = {
  jenisKontrak: [
    { value: "barang", label: "Barang", description: "Pengadaan barang" },
    { value: "jasa", label: "Jasa", description: "Pekerjaan jasa" },
    { value: "pembangunan", label: "Pembangunan", description: "Konstruksi fisik" },
  ],
  metodePemilihan: [
    { value: "penawaran", label: "Penawaran Langsung" },
    { value: "tender", label: "Tender" },
    { value: "pengadaan_langsung", label: "Pengadaan Langsung" },
  ],
  skemaPembayaran: [
    { value: "termin", label: "Termin" },
    { value: "lump_sum", label: "Lump Sum" },
  ],
};

const dummyCounterparties: CounterpartyResponse[] = [
  {
    id: 1,
    userId: 3,
    nama: "CV Maju Bersama",
    jenis: "penyedia",
    npwp: "01.234.567.8-901.000",
    alamat: "Jl. Raya Sukamaju No. 12",
  },
  {
    id: 2,
    nama: "PT Sehat Sentosa",
    jenis: "penyedia",
    npwp: "02.345.678.9-012.000",
    alamat: "Jl. Diponegoro No. 45",
  },
];

const dummyMetrics: DashboardMetricsResponse = {
  activeContractsCount: 2,
  activeContractsChange: 1,
  totalRealizationBudget: 478000000,
  realizationChange: 12,
  pendingReviewCount: 1,
  pendingReviewChange: 0,
  sealedContractsCount: 1,
  sealedContractsChange: 2,
  integrityIndex: 94,
};

const dummyPaymentTerms: PaymentTerm[] = [
  {
    id: 1,
    contractId: 1,
    urutan: 1,
    persen: 40,
    nominal: 140000000,
    jatuhTempo: "2026-11-30",
    status: "dibayar",
    realisasiNominal: 140000000,
    tanggalRealisasi: T2,
  },
  {
    id: 2,
    contractId: 1,
    urutan: 2,
    persen: 60,
    nominal: 210000000,
    jatuhTempo: "2026-12-31",
    status: "rencana",
  },
];

const dummyTermin: TerminListItem[] = dummyContracts.map((c) => ({
  contractId: Number(c.id),
  nomor: c.contractNumber,
  judul: c.title,
  villageId: 1,
  villageName: c.villageName,
  nilai: c.amount,
  status: c.status,
  totalDibayar: c.id === "1" ? 140000000 : 0,
  progresTerakhir: c.id === "1" ? 55 : c.id === "3" ? 100 : 0,
  terms: c.id === "1" ? dummyPaymentTerms : null,
}));

const dummySeals: SealItem[] = [
  {
    sealId: 1,
    contractId: 1,
    nomor: "KTR/2026/11/001",
    judul: dummyContracts[0].title,
    villageId: 1,
    villageName: "Desa Sukamaju",
    versionId: 1,
    nomorVersi: 1,
    sha256: dummyContracts[0].sha256Hash,
    waktuSegel: T2,
    segelSebelumnyaId: null,
    chain: "genesis",
    txHash: "0xdummy000000000000000000000000000000000000",
    jumlahVerifikasi: 3,
  },
];

const dummyNotifications: ApiNotification[] = [
  {
    id: 1,
    jenis: "kontrak",
    pesan: "Kontrak Pembangunan Jalan Desa Utama telah ditandatangani.",
    tautan: "/kontrak/1",
    dibaca: false,
    dibacaPada: null,
    dibuatPada: T2,
  },
  {
    id: 2,
    jenis: "termin",
    pesan: "Termin 1 kontrak KTR/2026/11/001 telah dibayar.",
    tautan: "/termin",
    dibaca: true,
    dibacaPada: T3,
    dibuatPada: T2,
  },
];

const dummyReports: CreatedReportResponse[] = [
  {
    id: 1,
    contractId: 1,
    contractTitle: dummyContracts[0].title,
    pelaporUserId: 7,
    pelaporNama: "Warga Sukamaju",
    kodePelacakan: "LPR-2026-0001",
    kategori: "kualitas_pekerjaan",
    deskripsi: "Lapisan aspal di ujung jalan belum rata.",
    status: "ditinjau",
    dibuatPada: T2,
    actions: [],
  },
  {
    id: 2,
    contractId: 2,
    contractTitle: dummyContracts[1].title,
    pelaporUserId: 8,
    pelaporNama: "Warga Cibodas",
    kodePelacakan: "LPR-2026-0002",
    kategori: "keterlambatan",
    deskripsi: "Pengiriman alat kesehatan terlambat dua minggu.",
    status: "baru",
    dibuatPada: T3,
    actions: [],
  },
];

const dummyAuditLogs: AuditLogItem[] = [
  {
    id: 1,
    aktorUserId: 1,
    aktorNama: "Kades Sukamaju",
    aktorRole: "perangkat_desa",
    aksi: "kontrak_ditandatangani",
    jenisObjek: "kontrak",
    idObjek: 1,
    contractId: 1,
    contractJudul: dummyContracts[0].title,
    villageId: 1,
    villageName: "Desa Sukamaju",
    waktu: T2,
  },
  {
    id: 2,
    aktorUserId: 4,
    aktorNama: "Inspektorat Daerah",
    aktorRole: "inspektorat",
    aksi: "audit_dibuat",
    jenisObjek: "audit",
    idObjek: 1,
    contractId: 1,
    contractJudul: dummyContracts[0].title,
    villageId: 1,
    villageName: "Desa Sukamaju",
    waktu: T3,
  },
];

const dummyAuditReports: AuditReport[] = [
  {
    id: 1,
    contractId: 1,
    contractJudul: dummyContracts[0].title,
    villageId: 1,
    villageName: "Desa Sukamaju",
    jenis: "lhp",
    penyusunUserId: 4,
    penyusunNama: "Inspektorat Daerah",
    ringkasan: "Pekerjaan berjalan sesuai spesifikasi dengan dua catatan minor.",
    status: "terbit",
    terbitPada: T3,
    jumlahTemuan: 2,
    findings: [
      {
        id: 1,
        objek: "pasal",
        temuan: "Pasal jaminan pemeliharaan belum mencantumkan masa berlaku.",
        tingkat: "saran",
        rekomendasi: "Tambahkan masa pemeliharaan minimal 90 hari.",
      },
      {
        id: 2,
        objek: "termin",
        temuan: "Persentase termin 2 tidak mengikuti kemajuan fisik.",
        tingkat: "kritis",
        rekomendasi: "Sesuaikan persentase dengan bobot pekerjaan.",
      },
    ],
  },
];

const dummyPublicContracts: (PublicContractSummary & { sha256Hash?: string })[] = [
  {
    id: 11,
    sha256Hash: "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789",
    nomor: "KTR/2026/11/001",
    judul: "Pembangunan Jalan Desa Utama",
    jenis: "pembangunan",
    nilai: 350000000,
    tenggat: "2026-12-31",
    status: "berjalan",
    villageId: 1,
    villageName: "Desa Sukamaju",
    counterpartyNama: "CV Maju Bersama",
  },
  {
    id: 12,
    sha256Hash: "b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1",
    nomor: "KTR/2026/11/002",
    judul: "Pengadaan Alat Kesehatan Puskesmas",
    jenis: "barang",
    nilai: 128000000,
    tenggat: "2026-11-30",
    status: "menunggu_tanda_tangan",
    villageId: 1,
    villageName: "Desa Sukamaju",
    counterpartyNama: "PT Sehat Sentosa",
  },
  {
    id: 13,
    sha256Hash: "c3d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2",
    nomor: "KTR/2026/11/004",
    judul: "Penyediaan Air Bersih Dusun Babakan",
    jenis: "pembangunan",
    nilai: 95000000,
    tenggat: "2027-01-31",
    status: "tersegel",
    villageId: 1,
    villageName: "Desa Sukamaju",
    counterpartyNama: "CV Tirta Makmur",
  },
  {
    id: 14,
    sha256Hash: "d4e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2c3",
    nomor: "KTR/2026/11/005",
    judul: "Belanja Alat Tulis Sekolah Dasar",
    jenis: "barang",
    nilai: 45000000,
    tenggat: "2026-12-15",
    status: "selesai",
    villageId: 1,
    villageName: "Desa Sukamaju",
    counterpartyNama: "UD Cerdas Mandiri",
  },
  {
    id: 15,
    sha256Hash: "e5f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2c3d4",
    nomor: "KTR/2026/11/006",
    judul: "Belanja Modal Perpustakaan Desa",
    jenis: "pembangunan",
    nilai: 64000000,
    tenggat: "2026-12-20",
    status: "selesai",
    villageId: 2,
    villageName: "Desa Cibodas",
    counterpartyNama: "UD Cerdas Mandiri",
  },
  {
    id: 16,
    sha256Hash: "f60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2c3d4e5",
    nomor: "KTR/2026/11/007",
    judul: "Pembangunan Drainase Lingkungan",
    jenis: "pembangunan",
    nilai: 210000000,
    tenggat: "2027-02-28",
    status: "tersegel",
    villageId: 2,
    villageName: "Desa Cibodas",
    counterpartyNama: "CV Bina Karya",
  },
  {
    id: 17,
    sha256Hash: "60718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2c3d4e5f6",
    nomor: "KTR/2026/11/008",
    judul: "Pelatihan UMKM Produk Olahan",
    jenis: "jasa",
    nilai: 180000000,
    tenggat: "2027-03-31",
    status: "berjalan",
    villageId: 3,
    villageName: "Desa Mekarsari",
    counterpartyNama: "PT Kreatif Nusantara",
  },
  {
    id: 18,
    sha256Hash: "0718293a4b5c6d7e8f901234567890abcdefabcdef0123456789a1b2c3d4e5f60",
    nomor: "KTR/2026/11/009",
    judul: "Pengadaan Jaringan Internet Desa",
    jenis: "barang",
    nilai: 72000000,
    tenggat: "2026-12-31",
    status: "menunggu_tanda_tangan",
    villageId: 3,
    villageName: "Desa Mekarsari",
    counterpartyNama: "PT Sehat Sentosa",
  },
];

const dummyRegionRules: RegionRule[] = [
  {
    id: 1,
    regionId: 1,
    regionNama: "Kabupaten Sukamaju",
    ambangPembelianLangsung: 20000000,
    ambangPenawaran: 200000000,
    dasarHukum: "Perda No. 7 Tahun 2026",
    berlakuSejak: "2026-01-01",
  },
];

const dummyPengawas: Pengawas[] = [
  {
    userId: 5,
    nama: "Ketua BPD Sukamaju",
    email: "bpd@periksa.id",
    jenis: "bpd",
    villageId: 1,
    villageName: "Desa Sukamaju",
  },
  {
    userId: 6,
    nama: "Auditor Inspektorat",
    email: "inspektorat@periksa.id",
    jenis: "inspektorat",
    villageId: null,
  },
];

const dummyAssignments: OversightAssignment[] = [
  {
    id: 1,
    contractId: 1,
    contractJudul: dummyContracts[0].title,
    villageName: "Desa Sukamaju",
    pengawasUserId: 5,
    pengawasNama: "Ketua BPD Sukamaju",
    jenis: "bpd",
    ditetapkanPada: T1,
  },
];

const dummyMe: Me = {
  userId: 1,
  nama: "Kades Sukamaju",
  email: "kades@periksa.id",
  role: "perangkat_desa",
  villageId: 1,
  noHp: "081234567890",
  usaha: null,
};

const dummyClauses: ApiClause[] = [
  { kodePasal: "1", judul: "Objek Pekerjaan", isi: dummyTeks.split("\n\n")[1], urutan: 1, legalReferenceId: 0 },
  { kodePasal: "2", judul: "Nilai Kontrak", isi: dummyTeks.split("\n\n")[2], urutan: 2, legalReferenceId: 0 },
  { kodePasal: "3", judul: "Jangka Waktu", isi: dummyTeks.split("\n\n")[3], urutan: 3, legalReferenceId: 0 },
  { kodePasal: "4", judul: "Jaminan Pemeliharaan", isi: dummyTeks.split("\n\n")[4], urutan: 4, legalReferenceId: 0 },
];

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

const dummyPublicProgres: Record<
  number,
  { progress: number; paid: number; selesai?: boolean; integrity: number; termin: { urutan: number; persen: number; status: string; jatuhTempo: string }[] }
> = {
  11: { progress: 55, paid: 40, integrity: 96, termin: [
    { urutan: 1, persen: 40, status: "dibayar", jatuhTempo: "2026-11-30" },
    { urutan: 2, persen: 60, status: "rencana", jatuhTempo: "2026-12-31" },
  ] },
  12: { progress: 0, paid: 0, integrity: 88, termin: [] },
  13: { progress: 25, paid: 0, integrity: 95, termin: [
    { urutan: 1, persen: 30, status: "rencana", jatuhTempo: "2026-12-20" },
    { urutan: 2, persen: 70, status: "rencana", jatuhTempo: "2027-01-31" },
  ] },
  14: { progress: 100, paid: 100, selesai: true, integrity: 99, termin: [
    { urutan: 1, persen: 50, status: "dibayar", jatuhTempo: "2026-11-20" },
    { urutan: 2, persen: 50, status: "dibayar", jatuhTempo: "2026-12-10" },
  ] },
  15: { progress: 100, paid: 100, selesai: true, integrity: 97, termin: [
    { urutan: 1, persen: 60, status: "dibayar", jatuhTempo: "2026-11-25" },
    { urutan: 2, persen: 40, status: "dibayar", jatuhTempo: "2026-12-18" },
  ] },
  16: { progress: 35, paid: 15, integrity: 92, termin: [
    { urutan: 1, persen: 15, status: "dibayar", jatuhTempo: "2026-12-31" },
    { urutan: 2, persen: 85, status: "rencana", jatuhTempo: "2027-02-28" },
  ] },
  17: { progress: 40, paid: 20, integrity: 90, termin: [
    { urutan: 1, persen: 20, status: "dibayar", jatuhTempo: "2027-01-15" },
    { urutan: 2, persen: 80, status: "rencana", jatuhTempo: "2027-03-31" },
  ] },
  18: { progress: 0, paid: 0, integrity: 87, termin: [] },
};

export async function dummyApiRequest<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  const method = (init.method ?? "GET").toUpperCase();
  const p = path.split("?")[0];

  if (method === "GET") {
    if (p === "/auth/me") return ok(dummyMe as T);
    if (p === "/notifications")
      return ok({ items: dummyNotifications, unreadCount: 1, nextBefore: null } as T);
    if (p === "/audit-logs") return ok({ items: dummyAuditLogs, nextBefore: null } as AuditLogPage as T);
    if (p === "/termin") return ok(dummyTermin as T);
    if (p === "/seals") return ok(dummySeals as T);
    if (p === "/audit-reports") return ok(dummyAuditReports as T);
    if (p === "/admin/region-rules") return ok(dummyRegionRules as T);
    if (p === "/admin/pengawas") return ok(dummyPengawas as T);
    if (p === "/admin/oversight-assignments") return ok(dummyAssignments as T);
    if (p === "/counterparties") return ok(dummyCounterparties as T);
    if (p === "/contracts/options") return ok(dummyOptions as T);
    if (p === "/contracts") return ok(dummyContractListData() as T);
    if (p === "/reports") return ok(dummyReports as T);
    if (p === "/public/contracts") return ok(dummyPublicContracts as T);
    const sealDetail = p.match(/^\/public\/contracts\/(\d+)$/);
    if (sealDetail) {
      const c = dummyPublicContracts.find((x) => String(x.id) === sealDetail[1]);
      const pg = dummyPublicProgres[Number(sealDetail[1])] ?? {
        progress: 0,
        paid: 0,
        integrity: 90,
        termin: [],
      };
      if (c)
        return ok({
          ...c,
          isiTeks: dummyTeks,
          klausulList: [
            "Pasal 1 — Objek Pekerjaan",
            "Pasal 2 — Nilai Kontrak",
            "Pasal 3 — Jangka Waktu",
            "Pasal 4 — Jaminan Pemeliharaan",
          ],
          integrityScore: pg.integrity,
          sha256Hash: c.sha256Hash ?? dummyContracts[0].sha256Hash,
          progres: {
            persenTerakhir: pg.progress,
            terakhirDilaporkan: T3,
            spkMulai: T1,
            spkSelesai: pg.selesai ? T3 : null,
            persenDibayar: pg.paid,
            termin: pg.termin,
          },
        } as T);
    }
    const auditMatch = p.match(/^\/contracts\/(\d+)\/audit\/latest$/);
    if (auditMatch) return ok(dummyAuditReports[0] as T);
    const reportsMatch = p.match(/^\/contracts\/(\d+)\/reports$/);
    if (reportsMatch) return ok(dummyReports as T);
    const lifeMatch = p.match(/^\/contracts\/(\d+)\/lifecycle$/);
    if (lifeMatch) return ok(dummyLifecycleData(lifeMatch[1]) as T);
    const idMatch = p.match(/^\/contracts\/(\d+)$/);
    if (idMatch) return ok(dummyContractDetailData(idMatch[1]) as T);
    return ok({ items: null, nextBefore: null } as unknown as T);
  }

  if (p === "/contracts/wizard/preview")
    return ok({ clauses: dummyClauses, model: "dummy", integrityScore: 92, findings: [] } as T);
  if (p.match(/^\/contracts\/\d+$/) && method === "PUT")
    return ok(dummyContractDetailData(p.split("/")[2]) as T);
  if (p.match(/^\/contracts\/\d+$/) && method === "POST")
    return ok(dummyContractDetailData(p.split("/")[2]) as T);
  if (p.match(/^\/contracts\/\d+\/reviews$/))
    return ok({
      id: 1,
      versionId: 1,
      partyId: 1,
      komentar: String(
        (init.body as { komentar?: string } | undefined)?.komentar ?? "",
      ),
      status: "setuju",
      waktu: T3,
    } as T);
  if (p.match(/^\/contracts\/\d+\/termin$/) && method === "PUT")
    return ok({
      contractId: 1,
      villageId: 1,
      status: "berjalan",
      nilai: 350000000,
      totalDibayar: 140000000,
      progresTerakhir: 55,
      spk: null,
      terms: dummyPaymentTerms,
      progress: null,
    } as ContractTermin as T);
  if (p.match(/^\/termin\/\d+\/bayar$/))
    return ok({ ...dummyPaymentTerms[0], status: "dibayar" } as T);
  if (p.endsWith("/sign"))
    return ok({
      signature: dummySignatures[0],
      isSealed: true,
      message: "Dummy mode: kontrak ditandatangani.",
    } as T);
  if (p.endsWith("/spk"))
    return ok({ ...dummyVersions[0], nomorVersi: 2 } as unknown as T);
  if (p.endsWith("/audit") || p.startsWith("/contracts/audit"))
    return ok(dummyAuditReports[0] as T);
  if (p.startsWith("/reports") && method === "POST")
    return ok(dummyReports[0] as T);
  if (p === "/dashboard/metrics") return ok(dummyMetrics as T);
  return ok({ message: "Mode dummy: aksi disimulasikan." } as unknown as T);
}

export function dummyContractListData(): ContractListItem[] {
  return dummyContracts;
}

export function dummyContractDetailData(
  id: number | string,
): ContractDetailResponse {
  const c = dummyContracts.find((x) => x.id === String(id)) ?? dummyContracts[0];
  return {
    id: Number(c.id),
    villageId: 1,
    villageName: c.villageName,
    counterpartyId: 1,
    counterpartyNama: c.vendorName,
    jenis: c.category,
    judul: c.title,
    nilai: c.amount,
    tenggat: "2026-12-31",
    skemaPembayaran: "termin",
    metodePemilihan: "penawaran",
    status: c.status,
    nomorVersi: 1,
    teksKontrak: dummyTeks,
    jawabanForm: { judulPekerjaan: c.title, nilaiKontrak: c.amount },
    integrityScore: c.integrityScore,
    sha256Hash: c.sha256Hash,
    createdBy: 1,
    createdAt: c.createdAt,
  };
}

export function dummyLifecycleData(id: number | string): ContractLifecycleResponse {
  return {
    contract: dummyContractDetailData(id),
    currentVersion: dummyVersions[0],
    versions: dummyVersions,
    reviews: [],
    signatures: dummySignatures,
    seal: {
      id: 1,
      versionId: 1,
      fileId: 1,
      sha256: dummyContracts[0].sha256Hash,
      waktuSegel: T2,
      chain: "genesis",
      txHash: "0xdummy000000000000000000000000000000000000",
    },
  };
}

export function dummyOptionsData(): ContractOptionsResponse {
  return dummyOptions;
}

export function dummyCounterpartiesData(): CounterpartyResponse[] {
  return dummyCounterparties;
}

export function dummyMetricsData(): DashboardMetricsResponse {
  return dummyMetrics;
}
