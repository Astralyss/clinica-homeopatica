import ConsultasAdminPanel from '@/components/admin/consultas/ConsultasAdminPanel';

export default function ConsultasPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
        Gestión de Consultas
      </h1>
      <ConsultasAdminPanel />
    </div>
  );
} 