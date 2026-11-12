export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white text-slate-800">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase">
          PERIKSA Foundation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          PERIKSA
        </h1>
        <p className="text-base sm:text-lg font-medium text-blue-700">
          Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Boilerplate frontend Next.js 16 berhasil diinisialisasi. Seluruh antarmuka
          lengkap, komponen wizard, dan portal pengawasan publik sedang dikembangkan pada
          branch <code className="bg-slate-100 text-blue-600 px-2 py-0.5 rounded font-mono text-xs">feat/frontend</code>.
        </p>
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel
        </div>
      </div>
    </main>
  );
}