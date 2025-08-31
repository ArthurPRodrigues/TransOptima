import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import transportadorasRoutes from './routes/transportadoras.js';
import tiposDocumentoRoutes from './routes/tiposDocumento.js';
import documentosRoutes from './routes/documentos.js';
import disponibilidadeRoutes from './routes/disponibilidade.js';


const app = express();
app.use(cors());
app.use(express.json());


// Static for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => res.json({ ok: true, name: 'TransOptima API' }));


app.use('/auth', authRoutes);
app.use('/transportadoras', transportadorasRoutes);
app.use('/tipos-documento', tiposDocumentoRoutes);
app.use('/documentos', documentosRoutes);
app.use('/disponibilidade', disponibilidadeRoutes);


// Fallback
app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ error: 'Internal Server Error' });
});


export default app;