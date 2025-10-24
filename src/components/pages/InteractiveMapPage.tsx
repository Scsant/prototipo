import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { MapPin, Truck, Factory, Layers, Filter, Maximize2, Minimize2, Scissors, Package, Clock, TrendingUp, Circle, AlertCircle, Info, Lightbulb, Building2 } from 'lucide-react';
import { mapQueries } from '../../lib/queries';
import type { OperationState } from '../../lib/mock-data';
import { Progress } from '../ui/progress';

// Generate polygon coordinates around a center point
function generatePolygon(lat: number, lng: number, radiusKm: number = 3): [number, number][] {
  const points = 6; // hexagon
  const coords: [number, number][] = [];
  const latOffset = radiusKm / 111; // 1 degree ≈ 111 km
  const lngOffset = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coords.push([
      lat + latOffset * Math.cos(angle),
      lng + lngOffset * Math.sin(angle)
    ]);
  }
  return coords;
}

type FarmWithGeo = {
  id: string;
  nome: string;
  estado: string;
  latitude: number;
  longitude: number;
  produtividade: string;
  distancia_km: number;
  estoque_t: number;
  poligono: [number, number][];
  operation_state: OperationState;
  tpc_dias?: number;
  colheita_progresso?: { colhido_t: number; meta_t: number; modulo_id: string };
  carregamento_progresso?: { carregado_t: number; meta_t: number; modulo_id: string };
};

type ModuleWithGeo = {
  id: string;
  nome: string;
  status: string;
  tipo: string;
  tipo_operacao: 'colheita' | 'carregamento';
  estado: string;
  latitude: number;
  longitude: number;
  trocas_dia_max?: number;
};

export function InteractiveMapPage() {
  const [selectedFarm, setSelectedFarm] = useState<FarmWithGeo | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleWithGeo | null>(null);
  const [showFarms, setShowFarms] = useState(true);
  const [showModulosColheita, setShowModulosColheita] = useState(true);
  const [showModulosCarregamento, setShowModulosCarregamento] = useState(true);
  const [showBuffers, setShowBuffers] = useState(false); // Novo: controle de buffers
  const [filterEstado, setFilterEstado] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [farmsWithPolygons, setFarmsWithPolygons] = useState<FarmWithGeo[]>([]);
  const [modulosColheita, setModulosColheita] = useState<ModuleWithGeo[]>([]);
  const [modulosCarregamento, setModulosCarregamento] = useState<ModuleWithGeo[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do banco
  useEffect(() => {
    async function loadMapData() {
      try {
        setLoading(true);
        
        const [fazendasData, modulosData] = await Promise.all([
          mapQueries.getFazendasComStatus(),
          mapQueries.getModulosComLocalizacao()
        ]);
        
        // Mapear fazendas para o formato esperado
        const farms: FarmWithGeo[] = fazendasData.map((f: any) => {
          let operation_state: OperationState = 'idle';
          
          // Determinar estado operacional
          if (f.operation_state === 'colheita') {
            operation_state = 'colheita';
          } else if (f.operation_state === 'carregamento') {
            operation_state = 'carregamento';
          } else if (f.tpc_dias !== null && f.tpc_dias !== undefined) {
            operation_state = 'cto_baldeio';
          }
          
          return {
            id: f.id,
            nome: f.nome,
            estado: f.estado?.sigla || 'SP', // FIX: acessar estado.sigla
            latitude: f.latitude,
            longitude: f.longitude,
            produtividade: f.produtividade || 'media',
            distancia_km: f.distancia_fabrica_km || 0,
            estoque_t: f.estoque_toneladas || 0,
            poligono: generatePolygon(f.latitude, f.longitude, 5),
            operation_state,
            tpc_dias: f.tpc_dias,
            colheita_progresso: f.colheita_progresso_pct ? {
              colhido_t: Math.floor(f.estoque_toneladas * (f.colheita_progresso_pct / 100)),
              meta_t: f.estoque_toneladas,
              modulo_id: f.modulo_id || 'N/A'
            } : undefined,
            carregamento_progresso: operation_state === 'carregamento' ? {
              carregado_t: Math.floor(f.estoque_toneladas * 0.5),
              meta_t: f.estoque_toneladas,
              modulo_id: f.modulo_id || 'N/A'
            } : undefined
          };
        });
        
        // Separar módulos por tipo
        const colheita: ModuleWithGeo[] = modulosData
          .filter((m: any) => m.tipo === 'colheita')
          .map((m: any) => (({
            id: m.id,
            nome: m.nome,
            status: m.status,
            tipo: m.mobilidade || 'fixo',
            tipo_operacao: 'colheita' as const,
            estado: m.fazenda_atual?.estado?.sigla || 'SP', // FIX: acessar fazenda_atual.estado.sigla
            latitude: m.latitude_atual,
            longitude: m.longitude_atual,
            trocas_dia_max: m.limite_trocas_dia || 2
          })));
        
        const carregamento: ModuleWithGeo[] = modulosData
          .filter((m: any) => m.tipo === 'carregamento')
          .map((m: any) => ({
            id: m.id,
            nome: m.nome,
            status: m.status,
            tipo: m.mobilidade || 'fixo',
            tipo_operacao: 'carregamento' as const,
            estado: m.fazenda_atual?.estado?.sigla || 'SP', // FIX: acessar fazenda_atual.estado.sigla
            latitude: m.latitude_atual,
            longitude: m.longitude_atual,
            trocas_dia_max: m.limite_trocas_dia || 2
          }));
        
        setFarmsWithPolygons(farms);
        setModulosColheita(colheita);
        setModulosCarregamento(carregamento);
      } catch (error) {
        console.error('Erro ao carregar dados do mapa:', error);
        
        // Fallback para dados mockados quando Supabase não está disponível
        const mockFarms: FarmWithGeo[] = [
          {
            id: 'SP-01',
            nome: 'Fazenda Operacional 01 - SP',
            estado: 'SP',
            latitude: -22.5,
            longitude: -48.2,
            produtividade: 'alta',
            distancia_km: 45,
            estoque_t: 2500,
            poligono: generatePolygon(-22.5, -48.2, 5),
            operation_state: 'colheita',
            colheita_progresso: {
              colhido_t: 1800,
              meta_t: 2500,
              modulo_id: 'COL-01'
            }
          },
          {
            id: 'SP-02',
            nome: 'Fazenda Operacional 02 - SP',
            estado: 'SP',
            latitude: -22.3,
            longitude: -48.5,
            produtividade: 'media',
            distancia_km: 67,
            estoque_t: 3200,
            poligono: generatePolygon(-22.3, -48.5, 5),
            operation_state: 'carregamento',
            carregamento_progresso: {
              carregado_t: 1600,
              meta_t: 3200,
              modulo_id: 'CAR-01'
            }
          },
          {
            id: 'SP-03',
            nome: 'Fazenda Operacional 03 - SP',
            estado: 'SP',
            latitude: -22.7,
            longitude: -48.8,
            produtividade: 'baixa',
            distancia_km: 89,
            estoque_t: 1800,
            poligono: generatePolygon(-22.7, -48.8, 5),
            operation_state: 'cto_baldeio',
            tpc_dias: 45
          }
        ];
        
        const mockColheita: ModuleWithGeo[] = [
          {
            id: 'COL-01',
            nome: 'Módulo Colheita 01',
            status: 'ativo',
            tipo: 'móvel',
            tipo_operacao: 'colheita',
            estado: 'SP',
            latitude: -22.5,
            longitude: -48.2,
            trocas_dia_max: 2
          }
        ];
        
        const mockCarregamento: ModuleWithGeo[] = [
          {
            id: 'CAR-01',
            nome: 'Módulo Carregamento 01',
            status: 'ativo',
            tipo: 'fixo',
            tipo_operacao: 'carregamento',
            estado: 'SP',
            latitude: -22.3,
            longitude: -48.5,
            trocas_dia_max: 3
          }
        ];
        
        setFarmsWithPolygons(mockFarms);
        setModulosColheita(mockColheita);
        setModulosCarregamento(mockCarregamento);
      } finally {
        setLoading(false);
      }
    }
    
    loadMapData();
  }, []);

  useEffect(() => {
    import('leaflet').then((L) => {
      setLeaflet(L);
      
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const mapInstance = L.map('map').setView([-20.0, -50.0], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstance);

      setMap(mapInstance);

      return () => {
        mapInstance.remove();
      };
    });
  }, []);

  useEffect(() => {
    if (!map || !leaflet) return;

    map.eachLayer((layer: any) => {
      if (layer instanceof leaflet.Polygon || layer instanceof leaflet.Marker || layer instanceof leaflet.DivIcon || layer instanceof leaflet.Circle) {
        map.removeLayer(layer);
      }
    });

    const filteredFarms = filterEstado 
      ? farmsWithPolygons.filter(f => f.estado === filterEstado)
      : farmsWithPolygons;

    const filteredColheita = filterEstado
      ? modulosColheita.filter(m => m.estado === filterEstado)
      : modulosColheita;

    const filteredCarregamento = filterEstado
      ? modulosCarregamento.filter(m => m.estado === filterEstado)
      : modulosCarregamento;

    // FÁBRICA BRACELL - Lençóis Paulista - SP (SEMPRE VISÍVEL, PRIMEIRA CAMADA)
    const fabricaIcon = leaflet.divIcon({
      html: `
        <div style="position: relative;">
          <div style="
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 10px;
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
            border: 2px solid white;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            position: relative;
            z-index: 1000;
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="7" width="18" height="14" rx="2" ry="2"></rect>
              <path d="M8 3v4"></path>
              <path d="M12 3v4"></path>
              <path d="M16 3v4"></path>
            </svg>
            FÁBRICA
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid white;
            z-index: 999;
          "></div>
        </div>
      `,
      className: 'custom-factory-icon',
      iconSize: [75, 28],
      iconAnchor: [37.5, 28],
    });

    const fabricaMarker = leaflet.marker([-22.5989, -48.8003], { 
      icon: fabricaIcon,
      zIndexOffset: 2000 // Garantir que fica por cima
    }).addTo(map);

    fabricaMarker.bindPopup(`
      <div style="min-width: 280px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #dc2626;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 8px; border-radius: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <rect x="3" y="7" width="18" height="14" rx="2" ry="2"></rect>
              <path d="M8 3v4"></path>
              <path d="M12 3v4"></path>
              <path d="M16 3v4"></path>
            </svg>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #dc2626;">Fábrica Bracell</h3>
            <p style="margin: 0; font-size: 11px; color: #666;">Unidade Lençóis Paulista - SP</p>
          </div>
        </div>
        
        <div style="background: #fef2f2; padding: 10px; border-radius: 6px; border-left: 3px solid #dc2626; margin-bottom: 8px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #991b1b;">📊 Capacidade de Produção</p>
          <p style="margin: 0; font-size: 13px; color: #991b1b;">35.000 m³/dia</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">830 caminhões ativos</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
          <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
            <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase;">Localização</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; font-weight: 600; color: #111827;">Lençóis Paulista</p>
          </div>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
            <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase;">Estado</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; font-weight: 600; color: #111827;">São Paulo</p>
          </div>
        </div>

        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 11px; color: #6b7280;">
            <strong>Coordenadas:</strong> 22°35'56"S, 48°48'01"W
          </p>
        </div>
      </div>
    `);

    // Círculo de destaque ao redor da fábrica (raio de influência)
    leaflet.circle([-22.5989, -48.8003], {
      radius: 8000, // 8km de raio
      color: '#dc2626',
      fillColor: '#dc2626',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '5, 8',
    }).addTo(map);

    // Buffers são gerenciados em useEffect separado

    // Draw farm polygons
    if (showFarms) {
      filteredFarms.forEach((farm) => {
        const getPolygonColor = (state: OperationState) => {
          switch (state) {
            case 'idle': return { color: '#6b7280', fillColor: '#6b7280' }; // gray
            case 'cto_baldeio': return { color: '#f59e0b', fillColor: '#f59e0b' }; // amber
            case 'colheita': return { color: '#22c55e', fillColor: '#22c55e' }; // green
            case 'carregamento': return { color: '#3b82f6', fillColor: '#3b82f6' }; // blue
          }
        };

        const colors = getPolygonColor(farm.operation_state);
        
        const polygon = leaflet.polygon(farm.poligono, {
          ...colors,
          fillOpacity: 0.25,
          weight: 2,
        }).addTo(map);

        // Add label flag for operational farms
        if (farm.operation_state === 'colheita' || farm.operation_state === 'carregamento') {
          const label = farm.operation_state === 'colheita' ? 'COL' : 'CAR';
          const labelColor = farm.operation_state === 'colheita' ? '#22c55e' : '#3b82f6';
          
          const flagIcon = leaflet.divIcon({
            html: `<div style="background: ${labelColor}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">${label}</div>`,
            className: 'custom-flag-icon',
            iconSize: [40, 20],
            iconAnchor: [20, 10],
          });

          leaflet.marker([farm.latitude, farm.longitude], { icon: flagIcon }).addTo(map);
        }

        // Popup content based on operation state
        let popupContent = `
          <div style="min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${farm.nome}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Estado Operacional:</strong> ${
              farm.operation_state === 'idle' ? 'Sem Operação' :
              farm.operation_state === 'cto_baldeio' ? 'CTO Baldeio Liberado' :
              farm.operation_state === 'colheita' ? 'Colheita Ativa' :
              'Carregamento Ativo'
            }</p>
        `;

        if (farm.operation_state === 'cto_baldeio' && farm.tpc_dias) {
          popupContent += `
            <div style="margin: 8px 0; padding: 8px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px;"><strong>TPC (Tempo Pós-Corte):</strong> ${farm.tpc_dias} dias</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #92400e;">
                ${farm.tpc_dias >= 60 ? '✓ Pronto para carregar (TPC >= 60 dias)' : `⏳ Aguardando secagem (faltam ${60 - farm.tpc_dias} dias)`}
              </p>
            </div>
          `;
        }

        if (farm.operation_state === 'colheita' && farm.colheita_progresso) {
          const percent = (farm.colheita_progresso.colhido_t / farm.colheita_progresso.meta_t * 100).toFixed(1);
          popupContent += `
            <div style="margin: 8px 0; padding: 8px; background: #d1fae5; border-left: 3px solid #22c55e; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px;"><strong>Módulo:</strong> ${farm.colheita_progresso.modulo_id}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Colhido:</strong> ${farm.colheita_progresso.colhido_t.toLocaleString()}t / ${farm.colheita_progresso.meta_t.toLocaleString()}t</p>
              <div style="background: #e5e7eb; height: 6px; border-radius: 3px; overflow: hidden; margin: 4px 0;">
                <div style="background: #22c55e; height: 100%; width: ${percent}%;"></div>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #065f46;">${percent}% completo</p>
            </div>
          `;
        }

        if (farm.operation_state === 'carregamento' && farm.carregamento_progresso) {
          const percent = (farm.carregamento_progresso.carregado_t / farm.carregamento_progresso.meta_t * 100).toFixed(1);
          popupContent += `
            <div style="margin: 8px 0; padding: 8px; background: #dbeafe; border-left: 3px solid #3b82f6; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px;"><strong>Módulo:</strong> ${farm.carregamento_progresso.modulo_id}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Carregado:</strong> ${farm.carregamento_progresso.carregado_t.toLocaleString()}t / ${farm.carregamento_progresso.meta_t.toLocaleString()}t</p>
              <div style="background: #e5e7eb; height: 6px; border-radius: 3px; overflow: hidden; margin: 4px 0;">
                <div style="background: #3b82f6; height: 100%; width: ${percent}%;"></div>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #1e40af;">${percent}% completo</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #1e40af;">Taxa: ${farm.taxa_carregamento_caminhoes_hora} cam/h</p>
            </div>
          `;
        }

        popupContent += `
            <p style="margin: 4px 0; font-size: 12px;"><strong>Distância:</strong> ${farm.distancia_km} km até fábrica</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Estoque:</strong> ${farm.estoque_t.toLocaleString()} t</p>
          </div>
        `;

        polygon.bindPopup(popupContent);

        polygon.on('click', () => {
          setSelectedFarm(farm);
          setSelectedModule(null);
        });
      });
    }

    // Add colheita modules (green tractors)
    if (showModulosColheita) {
      filteredColheita.forEach((module) => {
        const iconHtml = `<div style="background: #22c55e; color: white; padding: 6px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">COL</div>`;

        const icon = leaflet.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = leaflet.marker([module.latitude, module.longitude], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 180px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${module.nome}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Tipo:</strong> Colheita</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> ${module.status}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Estado:</strong> ${module.estado}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedModule(module);
          setSelectedFarm(null);
        });
      });
    }

    // Add carregamento modules (blue trucks)
    if (showModulosCarregamento) {
      filteredCarregamento.forEach((module) => {
        const iconHtml = `<div style="background: #3b82f6; color: white; padding: 6px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">CAR</div>`;

        const icon = leaflet.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = leaflet.marker([module.latitude, module.longitude], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 180px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${module.nome}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Tipo:</strong> Carregamento</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Gruas:</strong> ${module.maquinas_gruas} máquinas</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> ${module.status}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Estado:</strong> ${module.estado}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedModule(module);
          setSelectedFarm(null);
        });
      });
    }
  }, [map, leaflet, showFarms, showModulosColheita, showModulosCarregamento, filterEstado, farmsWithPolygons, modulosColheita, modulosCarregamento]);

  // useEffect separado para buffers - não afetado pela seleção de fazendas
  useEffect(() => {
    if (!map || !leaflet || !showBuffers) return;

    // Remover apenas buffers existentes
    map.eachLayer((layer: any) => {
      if (layer instanceof leaflet.Circle && layer.options.radius === 50000) {
        map.removeLayer(layer);
      }
    });

    const filteredFarms = filterEstado 
      ? farmsWithPolygons.filter(f => f.estado === filterEstado)
      : farmsWithPolygons;

    // Desenhar buffers
    filteredFarms.forEach((farm) => {
      const getPolygonColor = (state: OperationState) => {
        switch (state) {
          case 'idle': return '#6b7280';
          case 'cto_baldeio': return '#f59e0b';
          case 'colheita': return '#22c55e';
          case 'carregamento': return '#3b82f6';
        }
      };

      const color = getPolygonColor(farm.operation_state);
      
      // Buffer de 50km
      leaflet.circle([farm.latitude, farm.longitude], {
        radius: 50000, // 50km em metros
        color: color,
        fillColor: color,
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '8, 12',
      }).addTo(map);
    });
  }, [map, leaflet, showBuffers, filterEstado, farmsWithPolygons]);

  const estados = ['SP', 'MS', 'GO', 'PR', 'MG'];
  
  const stats = {
    totalFarms: farmsWithPolygons.length,
    modulosColheita: modulosColheita.length,
    modulosCarregamento: modulosCarregamento.length,
    farmsIdle: farmsWithPolygons.filter(f => f.operation_state === 'idle').length,
    farmsCTO: farmsWithPolygons.filter(f => f.operation_state === 'cto_baldeio').length,
    farmsColheita: farmsWithPolygons.filter(f => f.operation_state === 'colheita').length,
    farmsCarregamento: farmsWithPolygons.filter(f => f.operation_state === 'carregamento').length,
  };

  const mapHeight = isMaximized ? 'calc(100vh - 200px)' : '600px';

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white">Mapa Operacional - Análise Integrada</h1>
          <p className="text-gray-300">Visualização de fazendas, colheita, baldeio e carregamento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Factory className="size-4 text-blue-400" />
              <p className="text-sm text-gray-400">Fazendas</p>
            </div>
            <p className="text-2xl text-white">{stats.totalFarms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="size-4 text-green-400" />
              <p className="text-sm text-gray-400">Módulos Colheita</p>
            </div>
            <p className="text-2xl text-white">{stats.modulosColheita}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="size-4 text-blue-400" />
              <p className="text-sm text-gray-400">Módulos Carga</p>
            </div>
            <p className="text-2xl text-white">{stats.modulosCarregamento}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <p className="text-sm text-gray-400">Carregamento</p>
            </div>
            <p className="text-2xl text-white">{stats.farmsCarregamento}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-sm text-gray-400">Colheita</p>
            </div>
            <p className="text-2xl text-white">{stats.farmsColheita}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <p className="text-sm text-gray-400">CTO Baldeio</p>
            </div>
            <p className="text-2xl text-white">{stats.farmsCTO}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <p className="text-sm text-gray-400">Sem Operação</p>
            </div>
            <p className="text-2xl text-white">{stats.farmsIdle}</p>
          </CardContent>
        </Card>
      </div>

      <div className={`grid gap-6 ${isMaximized ? 'grid-cols-1' : 'lg:grid-cols-[1fr_350px]'}`}>
        {/* Map Container */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Mapa de Operações
              </CardTitle>
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Layers className="size-4" />
                      Camadas
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[450px] bg-gray-900 text-white border-gray-700">
                    <SheetHeader className="space-y-2 pb-4 border-b border-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Layers className="size-5 text-blue-400" />
                        </div>
                        <div>
                          <SheetTitle className="text-xl text-white">Controle de Camadas</SheetTitle>
                          <SheetDescription className="text-xs text-gray-400">
                            Personalize a visualização do mapa
                          </SheetDescription>
                        </div>
                      </div>
                    </SheetHeader>

                    <div className="space-y-6 mt-6 pb-6">
                      {/* Section: Elementos do Mapa */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Elementos do Mapa
                        </h3>

                        {/* Fazendas */}
                        <div className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="layer-fazendas" className="flex items-center gap-3 cursor-pointer flex-1">
                              <div className="p-2 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                                <Factory className="size-4 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white">Fazendas</p>
                                <p className="text-xs text-gray-400">{stats.totalFarms} áreas mapeadas</p>
                              </div>
                            </Label>
                            <Switch
                              id="layer-fazendas"
                              checked={showFarms}
                              onCheckedChange={setShowFarms}
                            />
                          </div>
                        </div>

                        {/* Buffers */}
                        <div className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="layer-buffers" className="flex items-center gap-3 cursor-pointer flex-1">
                              <div className="p-2 bg-purple-500/10 rounded-md group-hover:bg-purple-500/20 transition-colors">
                                <Circle className="size-4 text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white">Raio de Alcance</p>
                                <p className="text-xs text-gray-400">Buffers de 50km</p>
                              </div>
                            </Label>
                            <Switch
                              id="layer-buffers"
                              checked={showBuffers}
                              onCheckedChange={setShowBuffers}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gray-700/50" />

                      {/* Section: Módulos de Operação */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Módulos de Operação
                        </h3>

                        {/* Módulos Colheita */}
                        <div className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="layer-colheita" className="flex items-center gap-3 cursor-pointer flex-1">
                              <div className="p-2 bg-green-500/10 rounded-md group-hover:bg-green-500/20 transition-colors">
                                <Scissors className="size-4 text-green-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white">Módulos Colheita</p>
                                <p className="text-xs text-gray-400">
                                  {stats.modulosColheita === 0 ? (
                                    <span className="flex items-center gap-1 text-orange-400">
                                      <AlertCircle className="size-3" />
                                      Nenhum módulo ativo
                                    </span>
                                  ) : (
                                    <span>{stats.modulosColheita} {stats.modulosColheita === 1 ? 'módulo ativo' : 'módulos ativos'}</span>
                                  )}
                                </p>
                              </div>
                            </Label>
                            <Switch
                              id="layer-colheita"
                              checked={showModulosColheita}
                              onCheckedChange={setShowModulosColheita}
                              disabled={stats.modulosColheita === 0}
                            />
                          </div>
                          {stats.modulosColheita === 0 && (
                            <div className="mt-2 p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-md">
                              <div className="flex items-start gap-2">
                                <MapPin className="size-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-300 leading-relaxed">
                                  Adicione módulos de colheita no banco de dados
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Módulos Carregamento */}
                        <div className="group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="layer-carregamento" className="flex items-center gap-3 cursor-pointer flex-1">
                              <div className="p-2 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                                <Truck className="size-4 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white">Módulos Carregamento</p>
                                <p className="text-xs text-gray-400">
                                  {stats.modulosCarregamento === 0 ? (
                                    <span className="flex items-center gap-1 text-orange-400">
                                      <AlertCircle className="size-3" />
                                      Nenhum módulo ativo
                                    </span>
                                  ) : (
                                    <span>{stats.modulosCarregamento} {stats.modulosCarregamento === 1 ? 'módulo ativo' : 'módulos ativos'}</span>
                                  )}
                                </p>
                              </div>
                            </Label>
                            <Switch
                              id="layer-carregamento"
                              checked={showModulosCarregamento}
                              onCheckedChange={setShowModulosCarregamento}
                              disabled={stats.modulosCarregamento === 0}
                            />
                          </div>
                          {stats.modulosCarregamento === 0 && (
                            <div className="mt-2 p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-md">
                              <div className="flex items-start gap-2">
                                <MapPin className="size-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-300 leading-relaxed">
                                  Adicione módulos de carregamento no banco de dados
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-gray-700/50" />

                      {/* Stats Section - Melhorada */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Estatísticas do Mapa
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {/* Total Fazendas */}
                          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Factory className="size-3 text-blue-400" />
                              <p className="text-xs text-gray-400">Fazendas</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.totalFarms}</p>
                          </div>

                          {/* Total Módulos */}
                          <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Layers className="size-3 text-purple-400" />
                              <p className="text-xs text-gray-400">Módulos</p>
                            </div>
                            <p className="text-2xl font-bold text-white">
                              {stats.modulosCarregamento + stats.modulosColheita}
                            </p>
                          </div>

                          {/* Em Carregamento */}
                          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <p className="text-xs text-gray-400">Carregamento</p>
                            </div>
                            <p className="text-xl font-bold text-white">{stats.farmsCarregamento}</p>
                          </div>

                          {/* Em Colheita */}
                          <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <p className="text-xs text-gray-400">Colheita</p>
                            </div>
                            <p className="text-xl font-bold text-white">{stats.farmsColheita}</p>
                          </div>
                        </div>

                        {/* Resumo de Status */}
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                          <p className="text-xs text-gray-400 mb-2">Resumo de Status</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-2 text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                CTO/Baldeio
                              </span>
                              <span className="font-medium text-white">{stats.farmsCTO}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-2 text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                Sem Operação
                              </span>
                              <span className="font-medium text-white">{stats.farmsIdle}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dica de Uso */}
                      <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-2.5">
                          <Lightbulb className="size-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-300 mb-1">Dica</p>
                            <p className="text-xs text-gray-400">
                              {stats.modulosColheita === 0 && stats.modulosCarregamento === 0 ? (
                                'Execute o script seed-modulos.sql para popular os módulos no banco de dados'
                              ) : (
                                'Clique nos elementos do mapa para ver detalhes operacionais'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button 
                  variant={showFarms ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShowFarms(!showFarms)}
                  className="gap-2"
                >
                  <Factory className="size-4" />
                  Fazendas
                </Button>
                <Button 
                  variant={showModulosColheita ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShowModulosColheita(!showModulosColheita)}
                  className="gap-2"
                >
                  <Scissors className="size-4" />
                  Colheita
                </Button>
                <Button 
                  variant={showModulosCarregamento ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShowModulosCarregamento(!showModulosCarregamento)}
                  className="gap-2"
                >
                  <Truck className="size-4" />
                  Carregamento
                </Button>
                <Button 
                  variant={showBuffers ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShowBuffers(!showBuffers)}
                  className="gap-2"
                >
                  <Circle className="size-4" />
                  Buffers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  {isMaximized ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <div id="map" className="w-full" style={{ height: mapHeight }} />
              
              {/* Floating Controls */}
              <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-2 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2 px-2">Filtrar por Estado</p>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant={filterEstado === null ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterEstado(null)}
                      className="justify-start"
                    >
                      Todos
                    </Button>
                    {estados.map((estado) => (
                      <Button
                        key={estado}
                        variant={filterEstado === estado ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilterEstado(estado)}
                        className="justify-start"
                      >
                        {estado}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="size-5" />
                Legenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Estados Operacionais</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/30 border-2 border-blue-500" />
                    <span className="text-sm">Carregamento Ativo (Flag CAR)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/30 border-2 border-green-500" />
                    <span className="text-sm">Colheita Ativa (Flag COL)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-500/30 border-2 border-amber-500" />
                    <span className="text-sm">CTO Baldeio Liberado (TPC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-500/30 border-2 border-gray-500" />
                    <span className="text-sm">Sem Operação</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <p className="text-sm text-gray-400 mb-2">Módulos</p>
                <p className="text-sm text-gray-400 mb-2">Instalações</p>
                <div className="space-y-2">
                  {/* Fábrica */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border-2 border-white shadow-md">
                      <Building2 className="size-3 text-white" />
                    </div>
                    <span className="text-sm">Fábrica Bracell (Lençóis Paulista)</span>
                  </div>

                  {/* Módulos */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">COL</div>
                    <span className="text-sm">Módulos de Colheita ({stats.modulosColheita})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">CAR</div>
                    <span className="text-sm">Módulos de Carregamento ({stats.modulosCarregamento})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedFarm && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Fazenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="text-lg mb-2">{selectedFarm.nome}</h3>
                  <Badge className={
                    selectedFarm.operation_state === 'carregamento' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                    selectedFarm.operation_state === 'colheita' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                    selectedFarm.operation_state === 'cto_baldeio' ? 'bg-amber-900/30 text-amber-400 border-amber-700/50' :
                    'bg-gray-800/30 text-gray-400 border-gray-700/50'
                  }>
                    {selectedFarm.operation_state === 'idle' ? 'SEM OPERAÇÃO' :
                     selectedFarm.operation_state === 'cto_baldeio' ? 'CTO BALDEIO' :
                     selectedFarm.operation_state === 'colheita' ? 'COLHEITA' :
                     'CARREGAMENTO'}
                  </Badge>
                </div>

                {selectedFarm.operation_state === 'cto_baldeio' && selectedFarm.tpc_dias && (
                  <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-4 text-amber-400" />
                      <p className="text-sm font-medium text-amber-400">TPC (Tempo Pós-Corte)</p>
                    </div>
                    <p className="text-2xl text-white">{selectedFarm.tpc_dias} dias</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFarm.tpc_dias >= 60 
                        ? '✓ Pronto para carregar (TPC >= 60 dias)' 
                        : `⏳ Aguardando secagem (faltam ${60 - selectedFarm.tpc_dias} dias)`}
                    </p>
                  </div>
                )}

                {selectedFarm.operation_state === 'colheita' && selectedFarm.colheita_progresso && (
                  <div className="p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Scissors className="size-4 text-green-400" />
                      <p className="text-sm font-medium text-green-400">Progresso Colheita</p>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Módulo: {selectedFarm.colheita_progresso.modulo_id}
                    </p>
                    <Progress 
                      value={(selectedFarm.colheita_progresso.colhido_t / selectedFarm.colheita_progresso.meta_t) * 100} 
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-400">
                      {selectedFarm.colheita_progresso.colhido_t.toLocaleString()}t / {selectedFarm.colheita_progresso.meta_t.toLocaleString()}t 
                      ({((selectedFarm.colheita_progresso.colhido_t / selectedFarm.colheita_progresso.meta_t) * 100).toFixed(1)}%)
                    </p>
                  </div>
                )}

                {selectedFarm.operation_state === 'carregamento' && selectedFarm.carregamento_progresso && (
                  <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="size-4 text-blue-400" />
                      <p className="text-sm font-medium text-blue-400">Progresso Carregamento</p>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Módulo: {selectedFarm.carregamento_progresso.modulo_id}
                    </p>
                    <Progress 
                      value={(selectedFarm.carregamento_progresso.carregado_t / selectedFarm.carregamento_progresso.meta_t) * 100} 
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-400 mb-1">
                      {selectedFarm.carregamento_progresso.carregado_t.toLocaleString()}t / {selectedFarm.carregamento_progresso.meta_t.toLocaleString()}t 
                      ({((selectedFarm.carregamento_progresso.carregado_t / selectedFarm.carregamento_progresso.meta_t) * 100).toFixed(1)}%)
                    </p>
                    <p className="text-xs text-blue-400">
                      Taxa: {selectedFarm.taxa_carregamento_caminhoes_hora} caminhões/hora
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-gray-700/50">
                  <div>
                    <p className="text-gray-400">Estado</p>
                    <p className="text-white">{selectedFarm.estado}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Distância</p>
                    <p className="text-white">{selectedFarm.distancia_km} km</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Estoque Total</p>
                    <p className="text-white">{selectedFarm.estoque_t.toLocaleString()} t</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedFarm && !selectedModule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Análise de Capacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Capacidade Total Carregamento</p>
                  <p className="text-2xl text-white">~{stats.farmsCarregamento * 9} cam/h</p>
                  <p className="text-xs text-gray-400">Baseado em {stats.farmsCarregamento} fazendas ativas</p>
                </div>
                
                <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Fazendas Aguardando CTO</p>
                  <p className="text-2xl text-white">{stats.farmsCTO}</p>
                  <p className="text-xs text-gray-400">Priorizar para próximas mudanças</p>
                </div>

                <div className="pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2">Sugestão de Próxima Mudança</p>
                  <p className="text-sm text-gray-300">
                    Analisar fazendas com CTO liberado e TPC {'>'} 7 dias para otimizar produtividade
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}