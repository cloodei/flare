import Header from '../components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto p-3 lg:py-8 space-y-8">
        <main>{children}</main>
      </div>
    </div>
  );
}
