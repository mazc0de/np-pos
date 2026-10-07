import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, LogOut, Package, Settings, History, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { usePin } from '../hooks/usePin';
import { useAuth } from '../hooks/useAuth';
import { PinSetupModal } from '../components/PinModals';

export default function MainLayout() {
  const { pin, loading } = usePin();
  const { session } = useAuth();
  const userEmail = session?.user?.email || 'User';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'POS (Kasir)', path: '/pos', icon: ShoppingCart },
    { name: 'Inventori', path: '/inventory', icon: Package },
    { name: 'Riwayat Transaksi', path: '/transactions', icon: History },
    { name: 'Pengaturan', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex">
      {!loading && !pin && <PinSetupModal />}
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col view-transition-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-brand-900 tracking-tight">KasirWeb</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-900 text-white shadow-md shadow-brand-900/10' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <UserCircle size={32} className="text-slate-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-500">Log masuk sebagai</span>
              <span className="text-sm font-bold text-slate-900 truncate">{userEmail}</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden view-transition-main">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
