import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link href="/" className="portfolio-back-link">
      <ArrowLeft size={18} />
      Voltar ao site
    </Link>
  );
}
