import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Users, Play, SkipForward, CheckCircle, UserX, Building2, LayoutGrid, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, turnos, branches, departments, staffList, filters }) {
    // Estado local para los selectores de contexto
    const { data, setData, post, processing } = useForm({
        branch_id: filters.branch_id || '',
        department_id: filters.department_id || '',
        staff_id: filters.staff_id || '',
    });

    // Actualizar la vista cuando cambian los selectores
    const handleContextChange = (key, value) => {
        const newData = { ...data, [key]: value };
        if (key === 'branch_id') newData.department_id = ''; // Resetear depto si cambia sucursal
        
        setData(newData);
        
        // Recargar la página con los nuevos filtros
        router.get(route('dashboard'), {
            branch_id: newData.branch_id,
            department_id: newData.department_id,
        }, { preserveState: true });
    };

    // Acciones operativas
    const callNext = () => {
        if (!data.department_id || !data.staff_id) {
            alert('Por favor seleccione Departamento y Agente antes de llamar.');
            return;
        }
        post(route('tickets.call-next'));
    };

    const handleAction = (routePath, id) => {
        router.post(route(routePath, id), { staff_id: data.staff_id });
    };

    // Separar el ticket activo (el que está llamando o atendiendo el staff actual)
    const ticketActivo = turnos.find(t => 
        (t.status === 'CALLING' || t.status === 'SERVING') && 
        t.assigned_staff_id === parseInt(data.staff_id)
    );

    // Turnos en espera en la cola
    const colaEspera = turnos.filter(t => t.status === 'WAITING');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Consola de Atención</h2>}
        >
            <Head title="Panel de Control" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* SELECTORES DE CONTEXTO */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Sucursal</label>
                        <select 
                            value={data.branch_id} 
                            onChange={e => handleContextChange('branch_id', e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Seleccione Sucursal</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Departamento</label>
                        <select 
                            value={data.department_id} 
                            onChange={e => handleContextChange('department_id', e.target.value)}
                            disabled={!data.branch_id}
                            className="w-full bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                            <option value="">Seleccione Departamento</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Agente (Usted)</label>
                        <select 
                            value={data.staff_id} 
                            onChange={e => setData('staff_id', e.target.value)}
                            disabled={!data.department_id}
                            className="w-full bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                            <option value="">Identifíquese</option>
                            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* PANEL DE LLAMADO (IZQUIERDA) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Atención Actual</h3>
                            
                            {ticketActivo ? (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 py-10 rounded-[2rem] border-2 border-emerald-100">
                                        <span className="text-6xl font-black text-emerald-700 tracking-tighter">{ticketActivo.number}</span>
                                        <p className="text-emerald-600 font-bold mt-2 uppercase text-xs tracking-widest">{ticketActivo.status}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleAction('tickets.recall', ticketActivo.id)}
                                            className="flex flex-col items-center justify-center p-4 bg-amber-50 text-amber-600 rounded-2xl font-bold hover:bg-amber-100 transition-colors"
                                        >
                                            <SkipForward size={24} className="mb-1" /> Re-llamar
                                        </button>
                                        <button 
                                            onClick={() => handleAction('tickets.no-show', ticketActivo.id)}
                                            className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <UserX size={24} className="mb-1" /> No vino
                                        </button>
                                        <button 
                                            onClick={() => handleAction('tickets.serve', ticketActivo.id)}
                                            className="col-span-2 flex items-center justify-center gap-2 p-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                                        >
                                            <CheckCircle size={24} /> FINALIZAR ATENCIÓN
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                                        <Play size={40} />
                                    </div>
                                    <p className="text-gray-400 font-bold">Sin turno activo</p>
                                    <button 
                                        disabled={processing || !data.staff_id || colaEspera.length === 0}
                                        onClick={callNext}
                                        className="mt-8 w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-gray-800 transition-all disabled:opacity-30 active:scale-95"
                                    >
                                        LLAMAR SIGUIENTE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLA DE ESPERA (DERECHA) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                                    <Clock className="text-emerald-500" /> Cola de Espera
                                </h3>
                                <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full font-black text-sm">
                                    {colaEspera.length} CLIENTES
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Turno</th>
                                            <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Departamento</th>
                                            <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Espera</th>
                                            <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {colaEspera.map((turno) => (
                                            <tr key={turno.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="text-2xl font-black text-gray-800 tracking-tighter">{turno.number}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-gray-600">{turno.department.name}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-gray-400 text-sm font-medium">Hace {Math.floor((new Date() - new Date(turno.created_at))/60000)} min</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">En Espera</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {colaEspera.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <p className="text-gray-400 font-bold italic">No hay clientes esperando en este momento.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
