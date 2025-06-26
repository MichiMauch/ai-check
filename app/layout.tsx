import "./globals.css";

export const metadata = {
  title: "AI Maturity Checker",
  description:
    "Interaktives Tool zur Einschätzung des digitalen Reifegrads im Bereich Künstliche Intelligenz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="font-sans">{children}</body>
    </html>
  );
}
