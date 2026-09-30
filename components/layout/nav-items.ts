import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Search,
  FolderKanban,
  Bot,
  Sparkles,
  CalendarDays,
  Bell,
  Users,
  CreditCard,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Panel principal", href: "/", icon: LayoutDashboard },
  { label: "Oportunidades", href: "/oportunidades", icon: Search },
  { label: "Mis convocatorias", href: "/convocatorias", icon: FolderKanban },
  { label: "Copiloto IA", href: "/copiloto", icon: Bot },
  { label: "Agentes IA", href: "/agentes", icon: Sparkles },
  { label: "Calendario", href: "/calendario", icon: CalendarDays },
  { label: "Notificaciones", href: "/notificaciones", icon: Bell },
  { label: "Usuarios", href: "/usuarios", icon: Users },
  { label: "Plan y facturación", href: "/plan", icon: CreditCard },
];
