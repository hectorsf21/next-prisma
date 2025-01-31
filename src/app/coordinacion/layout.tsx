import React, { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a className="text-xl" href="#">UNERG SOLICITUDES</a>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">Inicio</Link>
            <Link href="/solicitudes" className="hover:underline">Solicitudes</Link>
            <Link href="/contacto" className="hover:underline">Contacto</Link>
          </div>
        </div>
      </nav>

      {/* Header with Logos */}
      <div className="mx-6 py-8">
        <div className="flex justify-between items-center">
          {/* Logo Gobierno */}
          <div>
            <img src="/img/logo-gobierno.png" alt="Logo Gobierno" className="h-16" />
          </div>

          {/* Logo Dirección */}
          <div className="h-24 border-r border-black py-4 px-4 pr-8 text-right">
            <span className="block text-sm">Gobierno <strong>Bolivariano</strong><br />
              de Venezuela</span>
          </div>

          {/* Ministerio de Educación */}
          <div className='h-24 border-r py-4 px-4 pr-8 border-black'>
            <span className="block text-sm text-right">
              Ministerio del Poder Popular<br />
              Para la <strong>Educación Universitaria</strong><br />
              de Venezuela
            </span>
          </div>
          {/* Logo Universidad */}
          <div>
            <img src="/img/logo-romulo.png" alt="Logo Universidad" className="h-16" />
          </div>
          {/* Universidad Nacional Experimental */}
          <div className='h-24  py-4 px-4 pr-8'>
            <span className="block text-sm text-right">
              Universidad Nacional Experimental<br />
              <strong>Rómulo Gallegos</strong>
            </span>
          </div> 
        </div>
      </div>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-800 text-white">
        <small>Universidad Nacional Experimental Rómulo Gallegos © Todos los derechos reservados</small>
      </footer>
    </div>
  );
};

export default Layout;
