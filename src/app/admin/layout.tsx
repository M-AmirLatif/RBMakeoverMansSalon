import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | R.B Makeover Man's Salon",
  description: "Secure Content Management & Salon Administration Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-portal">{children}</div>;
}
