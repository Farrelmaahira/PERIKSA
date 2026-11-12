import type { IllustrationName } from "@/data/illustrations";
import type {
  RoleKey,
  SeedAccount,
  StoredUser,
  UserRole,
} from "@/interfaces/auth";
import type { CounterpartyType } from "@/interfaces/master";

export const SESSION_KEY = "periksa:session-v2";
export const AUTH_EVENT = "periksa:auth";
export const USERS_KEY = "periksa:users-v2";
export const TOKENS_KEY = "periksa:auth-tokens";
export const REMEMBERED_EMAIL_KEY = "periksa:auth-email";

export const DEMO_PASSWORD = "periksa123";
export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 5;

export const roleLabels: Record<RoleKey, string> = {
  perangkat_desa: "Perangkat Desa",
  pihak_kedua: "Pihak Kedua",
  bpd: "BPD",
  inspektorat: "Inspektorat",
  warga: "Warga",
  admin_daerah: "Admin Daerah",
};

export const roleArt: Record<RoleKey, IllustrationName> = {
  perangkat_desa: "contract-signed_vutk",
  pihak_kedua: "food-truck_my6o",
  bpd: "data-reports_l2u3",
  inspektorat: "fingerprint_kdwq",
  warga: "online-community_3o0l",
  admin_daerah: "fingerprint_kdwq",
};

export const seedAccounts: SeedAccount[] = [
  {
    email: "tester@periksa.id",
    label: "Tester Multi-Peran (Semua Role)",
    note: "Bisa ganti 5 role langsung di sidebar dashboard",
  },
  { email: "kades@periksa.id", label: "Kepala Desa", note: "Desa Sukamaju" },
  { email: "penyedia@periksa.id", label: "Pihak Kedua", note: "CV Maju Bersama" },
  { email: "bpd@periksa.id", label: "BPD", note: "Desa Sukamaju" },
  {
    email: "inspektorat@periksa.id",
    label: "Inspektorat",
    note: "Punya 2 wilayah",
  },
  { email: "warga@periksa.id", label: "Warga", note: "Desa Sukamaju" },
  {
    email: "budi.santoso@periksa.id",
    label: "Budi Santoso (Warga)",
    note: "Desa Sukamaju",
  },
];

export const seedUsers: StoredUser[] = [
  {
    id: "u-tester",
    name: "Tester PERIKSA Multi-Peran",
    email: "tester@periksa.id",
    roles: [
      {
        id: "r-tester-kades",
        role: "perangkat_desa",
        title: "Kepala Desa",
        villageId: "sukamaju",
      },
      {
        id: "r-tester-penyedia",
        role: "pihak_kedua",
        title: "Penyedia",
        counterpartyId: "cp-maju",
      },
      {
        id: "r-tester-bpd",
        role: "bpd",
        title: "Ketua BPD",
        villageId: "sukamaju",
      },
      {
        id: "r-tester-insp",
        role: "inspektorat",
        title: "Auditor Inspektorat",
        regionId: "kab-cianjur",
      },
      {
        id: "r-tester-warga",
        role: "warga",
        title: "Pelapor",
        villageId: "sukamaju",
      },
      {
        id: "r-tester-admin",
        role: "admin_daerah",
        title: "Admin Daerah",
        regionId: "kab-cianjur",
      },
    ],
  },
  {
    id: "u-kades",
    name: "Hendra Wijaya",
    email: "kades@periksa.id",
    roles: [
      {
        id: "r-kades",
        role: "perangkat_desa",
        title: "Kepala Desa",
        villageId: "sukamaju",
      },
    ],
  },
  {
    id: "u-penyedia",
    name: "Rina Kartika",
    email: "penyedia@periksa.id",
    roles: [
      {
        id: "r-penyedia",
        role: "pihak_kedua",
        title: "Penyedia",
        counterpartyId: "cp-maju",
      },
    ],
  },
  {
    id: "u-bpd",
    name: "Asep Saepudin",
    email: "bpd@periksa.id",
    roles: [
      { id: "r-bpd", role: "bpd", title: "Ketua BPD", villageId: "sukamaju" },
    ],
  },
  {
    id: "u-warga",
    name: "Siti Rahma",
    email: "warga@periksa.id",
    phone: "0812-5550-0142",
    roles: [
      { id: "r-warga", role: "warga", title: "Pelapor", villageId: "sukamaju" },
    ],
  },
  {
    id: "u-budi",
    name: "Budi Santoso Warga",
    email: "budi.santoso@periksa.id",
    phone: "0812-5550-0199",
    roles: [
      { id: "r-budi", role: "warga", title: "Pelapor", villageId: "sukamaju" },
    ],
  },
  {
    id: "u-insp",
    name: "Dewi Lestari",
    email: "inspektorat@periksa.id",
    roles: [
      {
        id: "r-insp-cjr",
        role: "inspektorat",
        title: "Auditor Inspektorat",
        regionId: "kab-cianjur",
      },
      {
        id: "r-insp-sbg",
        role: "inspektorat",
        title: "Auditor Inspektorat",
        regionId: "kab-subang",
      },
    ],
  },
].map((u) => ({
  ...u,
  roles: u.roles as UserRole[],
  passwordHash: "seed",
  status: "aktif" as const,
  failedAttempts: 0,
  createdAt: "2026-01-05",
}));

export const typeHints: Record<CounterpartyType, string> = {
  Penyedia: "Menjual barang atau jasa ke desa",
  UMKM: "Usaha kecil warga",
  BUMDes: "Badan usaha milik desa",
  "Penerima hibah": "Kelompok penerima bantuan",
  Penyewa: "Menyewa aset desa",
};

export const loginSteps = ["Email dan sandi", "Pilih peran"];
export const registerSteps = ["Akun", "Usaha", "Kata sandi"];
export const verifySteps = ["Akun", "Usaha", "Kata sandi", "Verifikasi"];
export const resetSteps = ["Email", "Cek email", "Sandi baru"];

// Which register step owns each field, so a late error sends the user back to the right place
export const fieldStep: Record<string, number> = {
  name: 0,
  email: 0,
  business: 1,
  type: 1,
  npwp: 1,
  address: 1,
  password: 2,
  confirm: 2,
  agree: 2,
};

export const strengthLabel = ["Terlalu pendek", "Cukup", "Baik", "Kuat"];
