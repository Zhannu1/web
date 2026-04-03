import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Tags, LogOut, Menu, X } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', name: 'Тақта', icon: LayoutDashboard },
    { path: '/admin/users', name: 'Қолданушылар', icon: Users },
    { path: '/admin/jobs', name: 'Вакансиялар', icon: Briefcase },
    { path: '/admin/categories', name: 'Категориялар', icon: Tags },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-layout">
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="admin-logo">AdminPanel</div>
        <nav className="admin-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end 
                className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        <button className="admin-logout" onClick={() => navigate('/')}>
          <LogOut size={20} />
          <span>Сайтқа қайту</span>
        </button>
      </aside>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;