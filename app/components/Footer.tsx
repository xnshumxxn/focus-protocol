export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <span>© {year} Focus Protocol. All rights reserved.</span>

      <div className="footerLinks">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
