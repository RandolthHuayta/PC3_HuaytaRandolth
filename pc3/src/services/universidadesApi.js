import axios from 'axios';

const URL_API = 'http://localhost:3000/api/universidades';

function validarDatos(datos) {
  if (!Array.isArray(datos)) {
    throw new Error('La API no devolvió una lista válida de universidades.');
  }
  return datos;
}

export async function obtenerUniversidadesAxios() {
  const respuesta = await axios.get(URL_API, { timeout: 30000 });
  return validarDatos(respuesta.data);
}

export async function obtenerUniversidadesFetch() {
  const respuesta = await fetch(URL_API);
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return validarDatos(datos);
}