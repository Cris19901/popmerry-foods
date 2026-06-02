import AdminSidebar from './AdminSidebar';
import NewOrderAlert from './NewOrderAlert';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto pt-14 pb-16 lg:pt-0 lg:pb-0">
        {children}
      </main>
      <NewOrderAlert />
    </div>
  );
}
