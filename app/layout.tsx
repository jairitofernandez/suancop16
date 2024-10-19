// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Suancop16',
  description: 'Aplicación de animales en peligro de extinción',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
