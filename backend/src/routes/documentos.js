import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { getStatusByDates } from '../utils/status.js';
import { recomputeDisponibilidade } from '../services/availability.js';


const router = Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
destination: path.join(__dirname, '../uploads'),
filename: (req, file, cb) => {
const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
const ext = path.extname(file.originalname || '');
cb(null, unique + ext);
}
});

const upload = multer({ storage });


router.get('/', authRequired, async (req, res) => {
const { transportadora_id } = req.query;
let q = `SELECT d.*, t.nome as tipo_nome FROM documentos d
JOIN tipos_documento t ON t.id = d.tipo_documento_id`;
const params = [];
if (transportadora_id) {
params.push(transportadora_id);
q += ` WHERE d.transportadora_id = $1`;
}
q += ' ORDER BY d.id DESC';


const { rows } = await pool.query(q, params);
const days = process.env.DAYS_A_VENCER || 15;
const enriched = rows.map(r => ({
...r,
status: getStatusByDates(r.data_vencimento, days)
}));
res.json(enriched);
});


router.post('/', authRequired, upload.single('arquivo'), async (req, res) => {
try {
const { transportadora_id, tipo_documento_id, data_vencimento } = req.body;
const file = req.file;
const url = file ? `/uploads/${file.filename}` : null;
const { rows } = await pool.query(
`INSERT INTO documentos (transportadora_id, tipo_documento_id, data_vencimento, arquivo_url)
VALUES ($1,$2,$3,$4) RETURNING *`,
[transportadora_id, tipo_documento_id, data_vencimento, url]
);


// Atualiza disponibilidade
recomputeDisponibilidade(transportadora_id);


res.status(201).json(rows[0]);
} catch (e) {
console.error(e);
res.status(500).json({ error: 'Erro ao salvar documento' });
}
});


router.delete('/:id', authRequired, async (req, res) => {
// Descobre a transportadora e apaga
const q = await pool.query('SELECT transportadora_id FROM documentos WHERE id=$1', [req.params.id]);
const row = q.rows[0];
await pool.query('DELETE FROM documentos WHERE id=$1', [req.params.id]);
if (row) recomputeDisponibilidade(row.transportadora_id);
res.status(204).end();
});


export default router;