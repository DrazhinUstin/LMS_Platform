import NavMenu from './nav-menu';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <NavMenu />
      {children}
    </div>
  );
}
