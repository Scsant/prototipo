import { Home, Map, Truck, Package, BarChart3, Settings, Calendar, Factory, MapPin, Globe, Brain } from 'lucide-react';
import { Button } from './ui/button';
import bracellLogo from 'figma:asset/1afbf363332f423994c4f77f53ad3bb93a7d9d7e.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'planning', label: 'Planejamento', icon: Calendar },
    { id: 'interactiveMap', label: 'Mapa Interativo', icon: Globe },
    { id: 'map', label: 'Rotas', icon: Map },
    { id: 'smartScenarios', label: 'IA Cenários', icon: Brain },
    { id: 'orders', label: 'Ordens', icon: Package },
    { id: 'farms', label: 'Fazendas', icon: MapPin },
    { id: 'fleet', label: 'Frota', icon: Truck },
    { id: 'scenarios', label: 'Cenários', icon: BarChart3 },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <img src={bracellLogo} alt="Bracell" className="h-8" />
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => onNavigate(item.id)}
                    className={`gap-2 ${
                      currentPage === item.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Factory className="size-4 text-blue-400" />
            <span className="text-sm">Unidade Lençóis Paulista</span>
          </div>
        </div>
      </div>
    </nav>
  );
}