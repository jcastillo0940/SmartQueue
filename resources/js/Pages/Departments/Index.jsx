import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ChevronLeft, Plus, Hash, Trash2, Layers } from 'lucide-react';

export default function Index({ auth, sucursal, departamentos }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        prefix: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('departments.store', sucursal.id), {
            onSuccess: () => reset(),
        });
    };

    const deleteDept = (id) => {
        if (confirm('¿Eliminar este departamento? Se perderá el historial de turnos asociado.')) {
            router.delete(route('departments.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={`Deptos: ${sucursal.name}`}>
            <Head title="Departamentos" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link href={route('branches.index', sucursal.tenant_id)} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-semibold mb-6 transition-colors w-fit">
                    <ChevronLeft size={20} /> Volver a Sucursales ({sucursal.tenant.name})
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FORMULARIO */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-emerald-500" /> Nuevo Departamento
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-gray-50/50" placeholder="Ej. Carnicería o Cajas" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prefijo (Turnos)</label>
                                    <input type="text" value={data.prefix} onChange={e => setData('prefix', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-gray-50/50" placeholder="Ej. C o A" maxLength="2" />
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Generará turnos como: {data.prefix || '?'}-01</p>
                                </div>
                                <button disabled={processing} className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all">
                                    {processing ? 'Guardando...' : 'Crear Departamento'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* LISTADO */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {departamentos.length > 0 ? departamentos.map((dept) => (
                                    <div key={dept.id} className="p-5 rounded-2xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500 font-bold">
                                                {dept.prefix || '#'}
                                            </div>
                                            <button onClick={() => deleteDept(dept.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{dept.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Sucursal: {sucursal.name}</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center text-gray-400 font-medium italic">
                                        No hay departamentos creados.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
