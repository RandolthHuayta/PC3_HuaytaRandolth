import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/universidades', async (req, res) => {
  try {
    const respuesta = await axios.get('http://universities.hipolabs.com/search?country=Peru', {
      timeout: 30000
    });
    res.json(respuesta.data);
  } catch (error) {
    res.status(502).json({
      mensaje: 'La API pública de Hipolabs no respondió a tiempo',
      detalle: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Express listo en http://localhost:${PORT}/api/universidades`);
});