export type NavItem = { href: string; label: string };

export const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students/new", label: "New players" },
  { href: "/students/intermediate", label: "Intermediate" },
  { href: "/students/professional", label: "Professional" },
  { href: "/fees", label: "Fees" },
  { href: "/announcements", label: "Announcements" },
  { href: "/tournaments", label: "Matches & tournaments" },
  { href: "/admin/students", label: "Manage players" },
];

export const STUDENT_NAV: NavItem[] = [
  { href: "/announcements", label: "Announcements" },
  { href: "/tournaments", label: "Upcoming matches" },
  { href: "/fees", label: "My fees" },
];

export function isStudentAllowedPath(pathname: string): boolean {
  return (
    pathname === "/welcome" ||
    pathname.startsWith("/welcome/") ||
    pathname === "/announcements" ||
    pathname.startsWith("/announcements/") ||
    pathname === "/fees" ||
    pathname.startsWith("/fees/") ||
    pathname === "/tournaments" ||
    pathname.startsWith("/tournaments/")
  );
}
