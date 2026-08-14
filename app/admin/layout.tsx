import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXO- Admin",
  description: "NEXO Administrative Workspace & Management Console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
