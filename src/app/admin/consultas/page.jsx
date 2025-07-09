import SidebarMinimal from '@/components/admin/SidebarMinimal';
import ConsultasAdminPanel from '@/components/admin/consultas/ConsultasAdminPanel';

export default function ConsultasPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <SidebarMinimal />
      <main className="flex-1 flex flex-col md:ml-20 ml-16 p-6 transition-all relative overflow-x-hidden">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultas</h1>
        <ConsultasAdminPanel />
      </main>
    </div>
  );
} 