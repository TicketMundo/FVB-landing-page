import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
