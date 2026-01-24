"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname?.startsWith(href);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  };

  const [role, setRole] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok) {
          setRole(j.user?.role);
          setUsername(j.user?.username);
        }
      });
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 md:px-4 h-14 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/admin/events" className="font-bold tracking-wider uppercase text-turkish-red">
            TSA Admin
          </Link>
          <Link
            href="/admin/events"
            className={`text-sm ${isActive("/admin/events") ? "text-turkish-red font-medium" : "text-gray-600 hover:text-turkish-red"}`}
          >
            Events
          </Link>
          <Link
            href="/admin/members"
            className={`text-sm ${isActive("/admin/members") ? "text-turkish-red font-medium" : "text-gray-600 hover:text-turkish-red"}`}
          >
            Members
          </Link>
          {(role === "SUPERADMIN" || role === "ADMIN") && (
            <Link
              href="/admin/users"
              className={`text-sm ${isActive("/admin/users") ? "text-turkish-red font-medium" : "text-gray-600 hover:text-turkish-red"}`}
            >
              Users
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {username && <span className="text-sm text-gray-500">@{username}</span>}
          <Link href="/" className="text-sm text-gray-600 hover:text-turkish-red">
            View site
          </Link>
          <button onClick={logout} className="text-sm text-gray-600 hover:text-turkish-red">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
