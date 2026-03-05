import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Building2, Users, Settings, Menu, X, 
    LogOut, Bell, ChevronDown, ChevronRight, Store, Layers
} from 'lucide-react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { url } = usePage();
    
    // Estados para los acordeones
    const [openEstructura, setOpenEstructura] = useState(url.includes('empresas') || url.includes('sucursales') || url.includes('departamentos'));

    const isSuperAdmin = user.role === 'super_admin';

    const NavLink = ({ href, icon: Icon, children, active }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                active 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <Icon size={18} />
            <span className="text-sm">{children}</span>
        </Link>
    );

    const SubLink = ({ href, icon: Icon, children, active }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                active 
                ? 'text-emerald-600 bg-emerald-50 font-bold' 
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
            <Icon size={14} />
            {children}
        </Link>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            {/* SIDEBAR ESCRITORIO */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-8 z-30">
                <div className="flex items-center gap-3 mb-10 px-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-lg">S</div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">SmartQueue</span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 font-mono">Principal</div>
                    
                    <NavLink href={route('dashboard')} icon={LayoutDashboard} active={url === '/dashboard'}>
                        Dashboard
                    </NavLink>

                    {isSuperAdmin && (
                        <div className="space-y-1">
                            <button 
                                onClick={() => setOpenEstructura(!openEstructura)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${openEstructura ? 'text-gray-900 bg-gray-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 size={18} />
                                    <span className="text-sm text-black font-bold">Organización</span>
                                </div>
                                {openEstructura ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            
                            {openEstructura && (
                                <div className="pl-9 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                    <SubLink href={route('empresas.index')} icon={Building2} active={url === '/empresas'}>
                                        Empresas
                                    </SubLink>
                                    {/* Estos links son informativos del estado actual */}
                                    <SubLink href="#" icon={Store} active={url.includes('/sucursales')}>
                                        Sucursales
                                    </SubLink>
                                    <SubLink href="#" icon={Layers} active={url.includes('/departamentos')}>
                                        Departamentos
                                    </SubLink>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className="pt-4 border-t border-gray-50">
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-sm">
                        <LogOut size={18} /> Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* CONTENIDO */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
                    <button onClick={() => setShowingNavigationDropdown(true)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"><Menu size={20} /></button>
                    <h2 className="text-lg font-bold text-gray-800 truncate">{header}</h2>
                    <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff&bold=true`} className="w-8 h-8 rounded-lg" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
