import { useEffect, useState } from 'react';
import {
  obtenerUniversidadesAxios,
  obtenerUniversidadesFetch
} from './services/universidadesApi';
import './App.css';

function transformarUniversidades(lista) {
  return lista.map((uni, indice) => ({
    id: `${indice}-${uni.name}`,
    nombre: uni.name ?? 'Sin nombre',
    pais: uni.country ?? 'Perú',
    codigo: uni.alpha_two_code ?? 'PE',
    dominio: uni.domains?.[0] ?? 'No disponible',
    web: uni.web_pages?.[0] ?? ''
  }));
}

export default function App() {
  const [universidades, setUniversidades] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cliente, setCliente] = useState('axios');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarUniversidades(metodo = 'axios') {
    setCargando(true);
    setError('');

    try {
      const datos = metodo === 'fetch'
        ? await obtenerUniversidadesFetch()
        : await obtenerUniversidadesAxios();
      setUniversidades(transformarUniversidades(datos));
    } catch (problema) {
      setUniversidades([]);
      setError(`No pudimos consultar la API. ${problema.message}`);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUniversidades('axios');
  }, []);

  const universidadesFiltradas = universidades.filter((uni) =>
    uni.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
    uni.dominio.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div className="pagina">
      <header className="cabecera">
        <div className="contenido cabecera-interior">
          <span className="logo-texto">🎓 Directorio Universitario</span>
          <span className="marca">PC3 React + Express · API REST</span>
        </div>
      </header>

      <main className="contenido">
        <section className="presentacion">
          <p className="eyebrow">EXPLORADOR ACADÉMICO</p>
          <h1>Universidades del Perú</h1>
          <p>
            Consulta instituciones registradas desde nuestro backend Express y
            filtra en tiempo real por nombre o dominio web.
          </p>
        </section>

        <section className="herramientas" aria-label="Herramientas de consulta">
          <label className="campo">
            <span>Buscar universidad o dominio</span>
            <input
              type="search"
              placeholder="Ejemplo: Tecnológica, San Marcos, edu.pe..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <label className="campo selector">
            <span>Cliente HTTP</span>
            <select
              value={cliente}
              onChange={(evento) => setCliente(evento.target.value)}
            >
              <option value="axios">Axios</option>
              <option value="fetch">Fetch API</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => cargarUniversidades(cliente)}
            disabled={cargando}
          >
            {cargando ? 'Consultando…' : '↻ Recargar datos'}
          </button>
        </section>

        <section className="resultados" aria-live="polite">
          <div className="resumen">
            <h2>Instituciones disponibles</h2>
            <span>
              {universidadesFiltradas.length} de {universidades.length} resultados
            </span>
          </div>

          {cargando ? (
            <p className="mensaje">Cargando universidades desde la API...</p>
          ) : error ? (
            <div className="mensaje error" role="alert">{error}</div>
          ) : universidadesFiltradas.length === 0 ? (
            <p className="mensaje">
              No se encontraron universidades con ese criterio de búsqueda.
            </p>
          ) : (
            <div className="galeria">
              {universidadesFiltradas.map((uni) => (
                <article className="tarjeta" key={uni.id}>
                  <div className="tarjeta-contenido">
                    <span className="etiqueta">{uni.pais} ({uni.codigo})</span>
                    <h3>{uni.nombre}</h3>
                    <p style={{ color: '#646b75', fontSize: '0.9rem', margin: '8px 0 12px' }}>
                      Dominio: {uni.dominio}
                    </p>
                    {uni.web && (
                      <a
                        href={uni.web}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#b20b24', fontWeight: 700, fontSize: '0.9rem' }}
                      >
                        Visitar sitio web ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="pie">
        Práctica Calificada 3 · React + Vite + Node.js/Express
      </footer>
    </div>
  );
}