import { useAuthStore } from '@/store/authStore';
import { Module } from '@/types/jwt-payload';
import { screens } from '@/utils/screens';
import { Link, Outlet, useLocation, useNavigate, } from '@tanstack/react-router'; // Removed ReactNode import
import { Home, LogOut, Menu, PackageSearch, X } from 'lucide-react';
import { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';

// Removed children prop from function signature
export function Layout() {
  const credentials = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const localtion = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!credentials) {
    return null;
  }

  const {  user } = credentials;

  // const documentModule = modules.find(module => module.name === 'tp-documentos');

  // const { screens: documentScreens } = documentModule as Module;

  // const formattedScreens = documentScreens.map((screen) => {
  //   const path = `/${ screen.name.split('-')[0] }`;
  //   return {
  //     path,
  //   };
  // });



  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */ }
      <nav className="bg-asideColor shadow-sm">
        <div className="max-w-[92vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              {/* <button
                onClick={ () => setIsSidebarOpen(!isSidebarOpen) }
                className="p-2 rounded-md hover:bg-background"
              >
                <Menu className="h-6 w-6" />
              </button> */}
              <PackageSearch className="h-8 w-8 text-foreground" />
              <span className="text-xl font-semibold">
                Sistema de Controle de Envelopes
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-primary">
                Olá, { user.nome }
              </span>
              <>
                <ModeToggle />
              </>
              <Button
                onClick={ localtion.pathname === '/' ? handleLogout : () => navigate({ to: '/' }) }
                variant={ 'secondary' }
                className='hover: bg-accent '
              >
                <LogOut className="h-4 w-4 mr-2" />
                { `${ localtion.pathname === '/' ? 'Sair' : 'Início' }` }
              </Button>

            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */ }
      {/*<div className={ `fixed inset-y-0 left-0 transform ${ isSidebarOpen ? 'translate-x-0' : '-translate-x-full' } w-64 bg-asideColor shadow-lg transition-transform duration-300 ease-in-out z-20` }>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={ () => setIsSidebarOpen(false) }
              className="p-2 rounded-md hover:bg-background"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            <Link
              to="/"
              onClick={ () => setIsSidebarOpen(false) }
              activeProps={ { className: 'w-full flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 ' } }
              inactiveProps={ { className: 'w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent' } }
            >
              <Home className="h-5 w-5" />
              Início
            </Link>

            {
              screens.filter((screen) => formattedScreens.some(formattedScreen => formattedScreen.path === screen.path)).map((screen) => (
                <Link
                  to={ screen.path }
                  onClick={ () => setIsSidebarOpen(false) }
                  activeProps={ { className: 'w-full flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 ' } }
                  inactiveProps={ { className: 'w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent' } }
                >
                  <screen.icon className="h-5 w-5" />
                  { screen.title.split(' ')[0] }
                </Link>
              ))
            }

           
          </nav>
          <Button
            onClick={ handleLogout }
            className='w-full flex items-center justify-start gap-2 px-4 py-2 rounded-md bg-blue-50 '
            variant={ 'outline' }
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div >
      </div >;
      */}

      {/* Overlay */ }
      {/* 
      {
        isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black blur-md bg-opacity-50 z-10"
            onClick={ () => setIsSidebarOpen(false) }
          />
        );
}

          */}
      <main className="py-6">
        <Outlet /> {/* ONLY Outlet here */ }
      </main>
    </div >
  );
}