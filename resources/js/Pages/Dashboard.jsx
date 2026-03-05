import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Ticket, Clock, TrendingUp, MonitorSmartphone, Smartphone, UserRound } from 'lucide-react';

export default function Dashboard({ auth, turnos = [] }) {
    
    // Función para darle color a la etiqueta del estado
    const getStatusBadge = (status) => {
        switch(status) {
            case 'WAITING':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-200">En Espera</span>;
            case 'CALLING':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-200">Llamando...</span>;
            case 'SERVING':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">En Atención</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-600 border border-gray-200">{status}</span>;
        }
    };

    // Función para el icono del origen (Kiosco o WhatsApp)
    const getSourceIcon = (source) => {
        if (source === 'WHATSAPP') return <Smartphone size={16} className="text-green-500" />;
        return <MonitorSmartphone size={16} className="text-gray-400" />;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Dashboard General"
        >
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* 1. TARJETAS DE MÉTRICAS (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <Ticket size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Turnos Hoy</p>
                            <h3 className="text-3xl font-bold text-gray-800">{turnos.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <Users size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">En Espera</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {turnos.filter(t => t.status === 'WAITING').length}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Clock size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Tiempo Prom.</p>
                            <h3 className="text-3xl font-bold text-gray-800">-- min</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <TrendingUp size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Satisfacción</p>
                            <h3 className="text-3xl font-bold text-gray-800">100%</h3>
                        </div>
                    </div>
                </div>

                {/* 2. TABLA DE TURNOS ACTIVOS */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Fila Actual (Turnos Activos)</h3>
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">Actualización en vivo</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                                    <th className="px-6 py-4 font-semibold">Turno</th>
                                    <th className="px-6 py-4 font-semibold">Cliente / Origen</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold">Hora de Emisión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {turnos.length > 0 ? (
                                    turnos.map((turno) => (
                                        <tr key={turno.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                                                        {turno.number.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-800 text-lg">{turno.number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                                        <UserRound size={14} className="text-gray-400"/>
                                                        {turno.client_name || 'Cliente General'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        {getSourceIcon(turno.source)} {turno.source}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(turno.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {new Date(turno.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    /* ESTADO VACÍO (Cuando no hay nadie en la fila) */
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                    <Ticket size={32} className="text-gray-300" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-600">No hay clientes en espera</p>
                                                <p className="text-sm mt-1">Los nuevos turnos aparecerán aquí automáticamente.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
