import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface RouteResponse {
  coords: [number, number][];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("292912800");
  const [destination, setDestination] = useState("352892744");
  const [algo, setAlgo] = useState<"dij" | "astar">("dij");
  const [nodes, setNodes] = useState<string[]>([]);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [showLegend, setShowLegend] = useState(false);

  // Logout
  const handleLogout = () => navigate("/");

  // Carga inicial de lista de nodos (puede venir de un endpoint /api/nodes)
 useEffect(() => {
  fetch("https://pixel-backend-y0h6.onrender.com/api/nodes")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener nodos");
      return res.json();
    })
    .then((data: string[]) => setNodes(data))
    .catch((e) => {
      console.error("Error obteniendo nodos:", e);
      setNodes([origin, destination]);
    });
}, []);

  const fetchRoute = async () => {
    const resp = await fetch(
      `https://pixel-backend-y0h6.onrender.com/api/route?orig=${origin}&dest=${destination}&algo=${algo}`
    );
    const data: RouteResponse = await resp.json();
    if (data.coords) setRouteCoords(data.coords);
  };

  // Configurar iconos
 useEffect(() => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}, []);

  return (
    <div className="min-h-screen bg-agrorutas-bg font-['Inter']">
      {/* Header */}
      <header className="w-full h-16 bg-agrorutas-dark-green shadow-lg">
        <div className="h-full flex items-center px-6">
          {/* Logo + Título */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-agrorutas-green rounded-lg flex items-center justify-center">
              {/* svg icon */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                {/* … tus paths … */}
              </svg>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">AgroRutas Cajamarca</h1>
              <p className="text-[#A8C5A0] text-sm">Optimización de Distribución Rural</p>
            </div>
          </div>
          {/* Actions */}
          <div className="ml-auto flex items-center gap-4">
            {/* … otros iconos … */}
            <button
              onClick={handleLogout}
              className="w-8 h-8 bg-agrorutas-green rounded-full flex items-center justify-center text-white text-sm font-medium"
            >
              JM
            </button>
          </div>
        </div>
      </header>

    <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-agrorutas-dark-green mb-6">
              Control de Rutas
            </h2>

            {/* Origen */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Punto de Origen
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-12 px-4 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agrorutas-green outline-none"
              >
                {nodes.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Destino */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Punto de Destino
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-12 px-4 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agrorutas-green outline-none"
              >
                {nodes.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Algoritmo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algoritmo
              </label>
              <select
                value={algo}
                onChange={(e) => setAlgo(e.target.value as any)}
                className="w-full h-12 px-4 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agrorutas-green outline-none"
              >
                <option value="dij">Dijkstra</option>
                <option value="astar">A*</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={fetchRoute}
                className="flex-1 h-12 bg-agrorutas-green text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-lg"
              >
                Calcular Ruta
              </button>
              <button
                className="flex-1 h-12 bg-agrorutas-brown text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-lg"
                onClick={() => {
                  /* implementa comparar si quieres */
                }}
              >
                Comparar
              </button>
            </div>

            {/* Leyenda */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="w-full h-11 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg flex items-center justify-between px-4"
            >
              <span>Leyenda del Mapa</span>
              <svg
                className={`w-4 h-4 transition-transform ${showLegend ? "rotate-180" : ""}`}
                viewBox="0 0 17 17"
                fill="none"
              >
                <path d="M5.289 7.139L8.622 10.472L11.956 7.139H5.289Z" fill="black" />
              </svg>
            </button>
            {showLegend && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Leyenda</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-agrorutas-green rounded-full" />
                    <span>Puntos de distribución</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-agrorutas-red rounded-full" />
                    <span>Puntos problemáticos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-agrorutas-blue rounded-full" />
                    <span>Paradas intermedias</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content / Mapa */}
        <main className="flex-1 relative">
          <MapContainer
            center={routeCoords[0] || [-7.165, -78.5]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {routeCoords.length > 0 && (
              <>
                <Marker position={routeCoords[0]} />
                <Marker position={routeCoords[routeCoords.length - 1]} />
                <Polyline positions={routeCoords} color="green" weight={5} />
              </>
            )}
          </MapContainer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
