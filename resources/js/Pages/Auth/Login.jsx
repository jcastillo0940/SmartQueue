import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex font-sans text-gray-900 antialiased selection:bg-emerald-500 selection:text-white">
            <Head title="Log in" />

            {/* LADO IZQUIERDO: Branding Corporativo (Oculto en celulares) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-600 overflow-hidden items-center justify-center">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                
                <div className="relative z-10 px-12 text-white max-w-lg">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                        <span className="text-3xl font-bold">S</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Bienvenido a <br/>SmartQueue
                    </h1>
                    <p className="text-lg text-emerald-100 mb-8 font-light">
                        El sistema omnicanal líder para gestión de filas. Optimiza tu operación y mejora la experiencia de tus clientes.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-50">
                            <CheckCircle2 size={20} className="text-emerald-300" />
                            <span>Sincronización en tiempo real</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-50">
                            <CheckCircle2 size={20} className="text-emerald-300" />
                            <span>Kioskos QR y WhatsApp integrados</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-50">
                            <CheckCircle2 size={20} className="text-emerald-300" />
                            <span>Métricas NPS automáticas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO: Formulario de Login Minimalista */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8F9FA] p-8">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
                            S
                        </div>
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">SmartQueue</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                        <p className="text-gray-500 mt-2 text-sm">Ingresa tus credenciales para acceder a tu panel de control.</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-gray-700 bg-gray-50/50"
                                placeholder="gerente@smartqueue.com"
                                required
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-gray-700 bg-gray-50/50"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500 w-4 h-4"
                                />
                                <span className="ms-2 text-sm text-gray-600 font-medium">Recordar mi sesión</span>
                            </label>
                        </div>

                        <button
                            disabled={processing}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {processing ? 'Iniciando sesión...' : 'Ingresar al sistema'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
