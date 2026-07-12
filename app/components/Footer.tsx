import { Link } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <span>© {year} Focus Protocol. All rights reserved.</span>

      <div className="footerLinks">
          <Link href="/Privacy/page.tsx"> Privacy </Link>
          <Link href="/Terms/page.tsx"> Terms </Link>
        <a href="https://github.com/xnshumxxn/focus-protocol" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
