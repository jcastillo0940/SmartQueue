import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { MapPin, Plus, ChevronLeft, Store, Trash2, Edit2, X, Monitor } from 'lucide-react';

export default function Index({ auth, empresa, sucursales }) {
    const [editingBranch, setEditingBranch] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        location: '',
        timezone: 'America/Panama',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingBranch) {
            put(route('branches.update', editingBranch.id), {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(route('branches.store', empresa.id), {
                onSuccess: () => reset(),
            });
        }
    };

    const editBranch = (branch) => {
        setEditingBranch(branch);
        setData({
            name: branch.name,
            location: branch.location || '',
            timezone: branch.timezone,
        });
    };

    const cancelEdit = () => {
        setEditingBranch(null);
        reset();
        clearErrors();
    };

    const deleteBranch = (id) => {
        if (confirm('¿Estás seguro de eliminar esta sucursal? Se borrarán también sus departamentos y turnos.')) {
            router.delete(route('branches.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={`Sucursales: ${empresa.name}`}>
            <Head title={`Sucursales - ${empresa.name}`} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link href={route('empresas.index')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-semibold mb-6 transition-colors w-fit">
                    <ChevronLeft size={20} /> Volver a Empresas
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    {editingBranch ? <Edit2 size={20} className="text-amber-500" /> : <Plus size={20} className="text-emerald-500" />}
                                    {editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
                                </h3>
                                {editingBranch && (
                                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" 
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación / Dirección</label>
                                    <input 
                                        type="text" 
                                        value={data.location} 
                                        onChange={e => setData('location', e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500" 
                                    />
                                </div>

                                <button 
                                    disabled={processing} 
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg ${editingBranch ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
                                >
                                    {processing ? 'Procesando...' : (editingBranch ? 'Actualizar Sucursal' : 'Crear Sucursal')}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="space-y-4">
                                {sucursales.length > 0 ? sucursales.map((sucursal) => (
                                    <div key={sucursal.id} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${editingBranch?.id === sucursal.id ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100 hover:border-emerald-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${sucursal.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                                                <Store size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800">{sucursal.name}</h4>
                                                    {sucursal.is_active ? 
                                                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md italic">Activa</span>
                                                        : <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md italic">Inactiva</span>
                                                    }
                                                </div>
                                                <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={14} /> {sucursal.location || 'Sin ubicación'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                                                <button onClick={() => editBranch(sucursal)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => deleteBranch(sucursal.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <Link
                                                href={route('kiosk.index', sucursal.id)}
                                                className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
                                                title="Abrir Kiosco de Turnos"
                                            >
                                                <Monitor size={16} />
                                                Kiosco
                                            </Link>

                                            <Link
                                                href={route('departments.index', sucursal.id)}
                                                className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                            >
                                                Departamentos
                                            </Link>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Store size={32} /></div>
                                        <p className="text-gray-500 font-medium text-lg">No hay sucursales aún</p>
                                        <p className="text-gray-400 text-sm">Comienza agregando la primera sucursal de {empresa.name}.</p>
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
