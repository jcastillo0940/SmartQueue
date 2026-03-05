import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Plus, Building } from 'lucide-react';

export default function Index({ auth, empresas = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('empresas.store'), {
            onSuccess: () => reset('name'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Gestión de Empresas (Clientes)">
            <Head title="Empresas" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Plus size={20} strokeWidth={2} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Nueva Empresa</h3>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Comercial</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-gray-50/50"
                                        placeholder="Ej. Supermercados Rey"
                                        required
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Registrar Empresa'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Building2 size={20} className="text-gray-400" />
                                    Tus Clientes Activos
                                </h3>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                    {empresas.length} en total
                                </span>
                            </div>

                            <div className="space-y-3">
                                {empresas.length > 0 ? (
                                    empresas.map((empresa) => (
                                        <div key={empresa.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                                                    {empresa.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{empresa.name}</h4>
                                                    <p className="text-sm text-gray-400">Registrada el {new Date(empresa.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">
                                                Gestionar
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                            <Building size={32} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Aún no hay empresas registradas.</p>
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
