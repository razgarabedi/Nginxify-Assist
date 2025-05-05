import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary py-6 mt-12 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Nginxify Assist. Alle Rechte vorbehalten.</p>
        {/* Optional Links */}
        {/* <div className="mt-2 space-x-4">
          <Link href="/imprint" className="hover:text-primary">Impressum</Link>
          <Link href="/privacy" className="hover:text-primary">Datenschutz</Link>
        </div> */}
      </div>
    </footer>
  );
}
