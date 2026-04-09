import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <Link href="/" className="flex items-center gap-1 font-bold text-blue-600 text-sm">
        <span className="bg-blue-600 text-white rounded px-1 py-0.5 text-xs font-bold">e</span>
        Jobs
      </Link>
      <Link href="/vacancies" className="text-sm text-gray-600 hover:text-gray-900">
        Lowongan Kerja
      </Link>
      <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
        Dashboard
      </Link>
    </nav>
  );
}
