import {
  Factory,
  Building2,
  Wrench,
  Cog,
  HardHat,
  ShieldCheck,
  Clock,
  CheckCircle,
  Users,
  Award,
  Leaf,
} from "lucide-react";

const ICONS = {
  Factory,
  Building2,
  Wrench,
  Cog,
  HardHat,
  ShieldCheck,
  Clock,
  CheckCircle,
  Users,
  Award,
  Leaf,
};

export function iconByName(name) {
  return ICONS[name] ?? ShieldCheck;
}
