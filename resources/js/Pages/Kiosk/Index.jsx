import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Ticket as TicketIcon, CheckCircle } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Index({ branch, departments }) {
    const [lastTicket, setLastTicket] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);
    
    const { data, setData, post, processing, reset } = useForm({
        department_id: '',
        customer_phone: '',
    });

    const openKioskForm = (dept) => {
        setSelectedDept(dept);
        setData('department_id', dept.id);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('tickets.store', branch.id), {
            onSuccess: (page) => {
                const msg = page.props.flash?.success || "Turno generado";
                setLastTicket(msg);
                reset();
                setSelectedDept(null);
                setTimeout(() => setLastTicket(null), 6000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title={`Kiosco - ${branch.name}`} />

            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-12">
                    <Link href={route('branches.index', branch.tenant_id)} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors">
                        <ChevronLeft size={24} /> Salir del Kiosco
                    </Link>
                    <div className="text-right">
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">{branch.name}</h2>
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Emisión de Turnos</p>
                    </div>
                </div>

                {!selectedDept ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {departments.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => openKioskForm(dept)}
                                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    <TicketIcon size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-2">{dept.name}</h3>
                                <p className="text-gray-400 font-medium">Toque para solicitar turno</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50">
                        <h3 className="text-4xl font-black text-center mb-4">Confirmar Turno</h3>
                        <p className="text-center text-gray-500 text-lg mb-10">Solicitando para: <span className="text-emerald-600 font-bold">{selectedDept.name}</span></p>
                        
                        <form onSubmit={submit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3 text-center">WhatsApp para notificaciones (Opcional)</label>
                                <input 
                                    type="tel" 
                                    value={data.customer_phone} 
                                    onChange={e => setData('customer_phone', e.target.value)} 
                                    placeholder="Ej: 6000-0000"
                                    className="w-full bg-gray-50 border-none px-8 py-6 rounded-2xl text-2xl font-bold text-center focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300" 
                                />
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full py-8 rounded-3xl font-black text-2xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                                >
                                    {processing ? 'PROCESANDO...' : 'GENERAR TURNO'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedDept(null)}
                                    className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition-colors"
                                >
                                    CANCELAR Y VOLVER
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <Modal show={lastTicket !== null} onClose={() => setLastTicket(null)} maxWidth="md">
                <div className="p-12 text-center bg-white rounded-[3rem]">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle size={56} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">¡LISTO!</h2>
                    <p className="text-xl text-gray-500 mb-10 font-medium">Tome su ticket y espere el llamado.</p>
                    <div className="bg-emerald-50 py-10 rounded-[2rem] border-2 border-emerald-100 mb-8">
                        <span className="block text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Su Turno es</span>
                        <span className="text-7xl font-black text-emerald-700 tracking-tighter">{lastTicket?.split(': ')[1] || '---'}</span>
                    </div>
                    <button 
                        onClick={() => setLastTicket(null)}
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg"
                    >
                        ACEPTAR
                    </button>
                </div>
            </Modal>
        </div>
    );
}
