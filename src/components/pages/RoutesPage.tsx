import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Factory, Map, Route as RouteIcon, MapPin, ArrowLeft } from 'lucide-react';
import { RoutesMap } from '../RoutesMap';

type FarmLite = {
  id: string;
  nome: string;
  estado: string;
  latitude: number;
  longitude: number;
  distancia_km: number;
};

const FACTORY_COORDS: [number, number] = [-22.5989, -48.8003]; // Lençóis Paulista - SP

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const sinDlat = Math.sin(dLat / 2);
  const sinDlng = Math.sin(dLng / 2);
  const h = sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlng * sinDlng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function generateFarmsAroundFactory(count: number): FarmLite[] {
  const [fLat, fLng] = FACTORY_COORDS;
  const farms: FarmLite[] = [];
  for (let i = 0; i < count; i++) {
    // Distâncias realistas: 15km a 120km da fábrica
    const radiusKm = 15 + (i % 106); // distribui 15..120
    const angle = (i * 137.508) % 360; // espaçamento tipo sunflower
    const rad = (angle * Math.PI) / 180;
    const latOffset = radiusKm / 111; // ~111km por grau latitude
    const lngOffset = radiusKm / (111 * Math.cos(fLat * Math.PI / 180));
    const lat = fLat + latOffset * Math.cos(rad);
    const lng = fLng + lngOffset * Math.sin(rad);
    const dist = Math.round(haversineKm(FACTORY_COORDS, [lat, lng]));
    farms.push({
      id: `SP-${i + 1}`,
      nome: `Fazenda Operacional ${String(i + 1).padStart(2, '0')} - SP`,
      estado: 'SP',
      latitude: lat,
      longitude: lng,
      distancia_km: dist,
    });
  }
  return farms;
}

export function RoutesPage() {
  const [selectedFarm, setSelectedFarm] = useState(null as FarmLite | null);
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef(null as any);

	function handleSelectFarm(f: FarmLite) {
		console.log('Clicou na fazenda:', f.nome);
		setSelectedFarm(f);
		setIsExpanded(true);
		console.log('isExpanded deve ser true agora');
	}

  const farms: FarmLite[] = useMemo(() => generateFarmsAroundFactory(50), []);

  const filteredFarms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farms;
    return farms.filter(f => f.nome.toLowerCase().includes(q) || f.estado.toLowerCase().includes(q));
  }, [farms, query]);

	useEffect(() => {
		if (!selectedFarm && farms.length > 0) {
			setSelectedFarm(farms[0]);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [farms.length]);

  const routeKm = selectedFarm ? Math.round(haversineKm(FACTORY_COORDS, [selectedFarm.latitude, selectedFarm.longitude])) : null;
  const routeTimeMin = routeKm !== null ? Math.round(routeKm * 1.5) : null;

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white flex items-center gap-2"><RouteIcon className="size-6" /> Rotas - Fábrica ⇄ Fazendas</h1>
          <p className="text-gray-300">Fluxo 24/7: Fábrica (Lençóis Paulista) → Carrega na fazenda → Retorna</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
        {/* Sidebar */}
        <div className="order-1 lg:order-2 space-y-4 sticky top-20 self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Map className="size-5" /> Selecionar Fazenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Buscar por nome ou estado (ex: SP)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <div className="text-xs text-gray-400">{filteredFarms.length} fazendas</div>
              <Separator className="bg-gray-700/50" />
              <div ref={listRef} className="max-h-[calc(100vh-380px)] overflow-auto space-y-2 pr-1">
                {filteredFarms.map((f) => (
                  <button
                    key={f.id}
                    className={`w-full inline-flex items-center gap-3 rounded-md text-sm font-medium px-4 py-2 transition-colors ${selectedFarm?.id === f.id ? 'bg-primary text-primary-foreground' : 'text-gray-300 hover:text-white hover:bg-gray-800/50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Botão clicado para fazenda:', f.nome);
                      handleSelectFarm(f);
                    }}
                  >
                    <MapPin className="size-4" />
                    <div className="flex-1">
                      <div className="text-left text-sm text-white">{f.nome}</div>
                      <div className="text-left text-xs text-gray-400">{f.estado} • ~{f.distancia_km} km</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Factory className="size-5" /> Fábrica</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Unidade</span>
                <span className="text-white font-medium">Lençóis Paulista - SP</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Capacidade</span>
                <span className="text-white font-medium">35.000 m³/dia</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map & Route Details */}
        <div className="order-2 lg:order-1 space-y-4">
          <Card className="overflow-hidden sticky top-20">
            <CardHeader className="border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><RouteIcon className="size-5" /> Rota Selecionada</CardTitle>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      setIsExpanded(false);
                      setTimeout(() => {
                        try { listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
                      }, 0);
                    }}
                  >
                    Voltar para lista
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setIsExpanded(true)}
                  >
                    Abrir mapa
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <RoutesMap
                  lat={selectedFarm?.latitude}
                  lng={selectedFarm?.longitude}
                  name={selectedFarm?.nome}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              {selectedFarm ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Origem</p>
                    <p className="text-white font-medium">Fábrica Bracell</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Destino</p>
                    <p className="text-white font-medium">{selectedFarm.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Distância (ida)</p>
                    <p className="text-white font-medium">~{routeKm} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tempo Estimado (ida)</p>
                    <p className="text-white font-medium">~{routeTimeMin} min</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Selecione uma fazenda para visualizar a rota.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-[9999] p-4 flex flex-col" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          {console.log('Renderizando overlay isExpanded:', isExpanded)}
          <div className="flex items-center justify-between mb-2">
            <div className="text-white text-lg font-bold">Mapa Expandido - {selectedFarm?.nome}</div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                onClick={() => {
                  setIsExpanded(false);
                  setTimeout(() => {
                    try { listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
                  }, 0);
                }}
              >
                ← Voltar para lista
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                onClick={() => setIsExpanded(false)}
              >
                ✕ Fechar
              </button>
            </div>
          </div>
          <div className="w-full flex-1">
            <RoutesMap
              lat={selectedFarm?.latitude}
              lng={selectedFarm?.longitude}
              name={selectedFarm?.nome}
            />
          </div>
        </div>
      )}

      {/* Floating back-to-list button (always visible when not expanded) */}
      {!isExpanded && (
        <button
          className="fixed left-4 bottom-4 z-[3000] inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/90 px-3 py-2 text-xs text-gray-100 hover:bg-gray-800 shadow-lg"
          onClick={() => {
            try { listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
          }}
        >
          <ArrowLeft className="size-3.5" />
          Voltar para lista
        </button>
      )}
    </div>
  );
}
