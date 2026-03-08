import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Volume2 } from 'lucide-react';

export default function Index({ branch, llamados }) {
    
    // Auto-recarga cada 10 segundos para ver nuevos turnos
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const principal = llamados[0];
    const anteriores = llamados.slice(1);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden">
            <Head title={`Monitor - ${branch.name}`} />

            <div className="flex h-screen">
                {/* LADO IZQUIERDO: TURNO PRINCIPAL */}
                <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-800 p-12 bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-emerald-500 uppercase tracking-[0.3em] mb-8">Llamando Ahora</h2>
                        
                        {principal ? (
                            <div className="animate-pulse">
                                <div className="text-[20rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                    {principal.number}
                                </div>
                                <div className="mt-8 py-4 px-12 bg-emerald-600 rounded-full inline-block">
                                    <span className="text-4xl font-black uppercase italic">
                                        Pase a: {principal.called_by ? principal.called_by.name : 'Módulo'}
                                    </span>
                                </div>
                                <p className="text-3xl text-slate-400 mt-6 font-bold uppercase tracking-widest">
                                    {principal.department.name}
                                </p>
                            </div>
                        ) : (
                            <div className="text-slate-600 text-3xl font-bold italic">
                                Esperando nuevos turnos...
                            </div>
                        )}
                    </div>
                </div>

                {/* LADO DERECHO: HISTORIAL Y LOGO */}
                <div className="w-[30%] flex flex-col bg-slate-950">
                    <div className="p-8 border-b border-slate-800 text-center">
                        <h1 className="text-2xl font-black tracking-tighter">{branch.name}</h1>
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-1">Sala de Espera</p>
                    </div>

                    <div className="flex-1 p-8 space-y-6">
                        <h3 className="text-slate-500 font-black uppercase text-sm tracking-widest mb-4">Turnos Anteriores</h3>
                        {anteriores.map((t) => (
                            <div key={t.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center opacity-70">
                                <div>
                                    <span className="text-4xl font-black text-white">{t.number}</span>
                                    <p className="text-slate-500 text-xs font-bold uppercase">{t.department.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 font-bold">Módulo</span>
                                    <p className="text-emerald-500 font-black">{t.called_by?.name || '-'}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* HORA / FOOTER */}
                    <div className="p-8 bg-emerald-600 text-center flex items-center justify-center gap-4">
                        <Volume2 size={32} />
                        <span className="text-2xl font-black">Siga las indicaciones en pantalla</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
