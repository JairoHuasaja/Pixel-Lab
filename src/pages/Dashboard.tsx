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

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
      {/* HEADER */}
      <header className="w-full h-16 bg-agrorutas-dark-green flex items-center px-6 shadow-md">
        {/* Logo cuadrado */}
        <div className="w-12 h-12 bg-agrorutas-green rounded flex items-center justify-center">
          {/* Aquí tu SVG de logo */}
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.6 12.9H4.6V19.65C4.6 20.7 5.49 21.57 6.6 21.57H18.6C19.71 21.57 20.6 20.7 20.6 19.65V12.9H21.6C21.79 12.9 21.98 12.84 22.14 12.74C22.3 12.64 22.43 12.49 22.5 12.31C22.58 12.13 22.6 11.93 22.56 11.74C22.52 11.55 22.43 11.38 22.29 11.25L12.6 2.9L2.91 11.25C2.77 11.38 2.68 11.55 2.64 11.74C2.6 11.93 2.62 12.13 2.7 12.31C2.77 12.49 2.9 12.64 3.06 12.74C3.22 12.84 3.41 12.9 3.6 12.9Z" fill="black"/><path d="M12.6 7.17C10.95 7.17 9.6 8.47 9.6 10.05C9.6 11.63 10.95 12.93 12.6 12.93C14.25 12.93 15.6 11.63 15.6 10.05C15.6 8.47 14.25 7.17 12.6 7.17Z" fill="black"/></svg>
        </div>
        {/* Título + subtítulo */}
        <div className="ml-4">
          <h1 className="text-white text-2xl font-bold leading-tight">AgroRutas Cajamarca</h1>
          <p className="text-[#A8C5A0] text-sm">Optimización de Distribución Rural</p>
        </div>
        {/* Avatar / Logout */}
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-agrorutas-green rounded-full flex items-center justify-center text-white text-base font-medium shadow"
          >
            JM
          </button>
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
                    <span>Camino Propuesto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-agrorutas-red rounded-full" />
                    <span>Punto de llegada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-agrorutas-blue rounded-full" />
                    <span>Punto de Partida</span>
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
                <Marker position={routeCoords[routeCoords.length - 1]}
                icon={redIcon} />
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
