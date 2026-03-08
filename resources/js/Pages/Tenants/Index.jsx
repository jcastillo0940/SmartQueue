import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout user={auth.user} header="Gestión de Empresas">
            <Head title="Empresas" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Nueva Empresa</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Comercial</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={processing} className="w-full py-3 rounded-xl font-bold text-white bg-gray-900">
                                    Registrar Empresa
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Building2 size={20} className="text-gray-400" /> Clientes Activos
                            </h3>
                            <div className="space-y-3">
                                {empresas.map((empresa) => (
                                    <div key={empresa.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold">
                                                {empresa.name.charAt(0)}
                                            </div>
                                            <h4 className="font-bold text-gray-800">{empresa.name}</h4>
                                        </div>
                                        <Link 
                                            href={route('branches.index', empresa.id)} 
                                            className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg"
                                        >
                                            Gestionar
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
