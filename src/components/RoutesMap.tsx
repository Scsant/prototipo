import React, { useEffect, useRef } from 'react';

interface RoutesMapProps {
  lat?: number;
  lng?: number;
  name?: string;
}

export function RoutesMap({ lat, lng, name }: RoutesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Carregar Leaflet dinamicamente
    const loadLeaflet = async () => {
      // Carregar CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Carregar JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      
      script.onload = () => {
        if (!mapRef.current) return;

        const L = (window as any).L;
        const FACTORY = { lat: -22.5989, lng: -48.8003, name: 'Fábrica Bracell' };
        const farm = lat && lng ? { lat, lng, name: name || 'Fazenda Selecionada' } : null;

        // Criar mapa
        const map = L.map(mapRef.current);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Icons
        const factoryIcon = L.divIcon({
          html: '<div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 8px rgba(29,78,216,0.35);">FÁBRICA</div>',
          className: 'factory-div-icon',
          iconSize: [70, 26],
          iconAnchor: [35, 26]
        });

        const farmIcon = L.divIcon({
          html: '<div style="background: #16a34a; color: white; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 8px rgba(22,163,74,0.35);">FAZENDA</div>',
          className: 'farm-div-icon',
          iconSize: [74, 26],
          iconAnchor: [37, 26]
        });

        const truckIcon = L.divIcon({
          html: '<div style="background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: 800; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 8px rgba(14,165,233,0.35);">TRK</div>',
          className: 'truck-div-icon',
          iconSize: [46, 24],
          iconAnchor: [23, 12]
        });

        const overlays = [];
        overlays.push(L.marker([FACTORY.lat, FACTORY.lng], { icon: factoryIcon, zIndexOffset: 1000 }));

        if (farm) {
          overlays.push(L.marker([farm.lat, farm.lng], { icon: farmIcon, zIndexOffset: 1000 }));
          
          // Rota
          const coords = [[FACTORY.lat, FACTORY.lng], [farm.lat, farm.lng], [FACTORY.lat, FACTORY.lng]];
          const line = L.polyline(coords, { color: '#2563eb', weight: 4, opacity: 0.9 });
          overlays.push(line);

          // Animação do caminhão
          const samples = 200;
          const points = [];
          for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            points.push([
              FACTORY.lat + (farm.lat - FACTORY.lat) * t,
              FACTORY.lng + (farm.lng - FACTORY.lng) * t,
            ]);
          }
          for (let i = 1; i <= samples; i++) {
            const t = i / samples;
            points.push([
              farm.lat + (FACTORY.lat - farm.lat) * t,
              farm.lng + (FACTORY.lng - farm.lng) * t,
            ]);
          }

          const truck = L.marker(points[0], { icon: truckIcon, zIndexOffset: 1500 });
          overlays.push(truck);
          let idx = 0;
          setInterval(() => {
            idx = (idx + 1) % points.length;
            try { truck.setLatLng(points[idx]); } catch (e) {}
          }, 40);
        }

        const group = L.featureGroup(overlays);
        group.addTo(map);

        if (farm) {
          map.fitBounds(group.getBounds(), { padding: [40, 40] });
        } else {
          map.setView([FACTORY.lat, FACTORY.lng], 11);
        }

        mapInstanceRef.current = map;
      };

      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [lat, lng, name]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
