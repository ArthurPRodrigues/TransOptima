import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { recomputeDisponibilidade } from '../services/availability.js';


const router = Router();


router.get('/', authRequired, async (req, res) => {
const { uf, controlados } = req.query;
const filters = [];
const values = [];


if (uf) { values.push(uf.toUpperCase()); filters.push(`uf = $${values.length}`); }
if (typeof controlados !== 'undefined') {
values.push(controlados === 'true');
filters.push(`quimicos_controlados = $${values.length}`);
}
const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';


const { rows } = await pool.query(`SELECT * FROM transportadoras ${where} ORDER BY id DESC`, values);
res.json(rows);
});


router.get('/:id', authRequired, async (req, res) => {
const { rows } = await pool.query('SELECT * FROM transportadoras WHERE id=$1', [req.params.id]);
if (!rows[0]) return res.status(404).json({ error: 'Não encontrada' });
res.json(rows[0]);
});


router.post('/', authRequired, async (req, res) => {
const { razao_social, cnpj, uf, quimicos_controlados } = req.body;
const { rows } = await pool.query(
`INSERT INTO transportadoras (razao_social, cnpj, uf, quimicos_controlados, disponivel_para_frete)
VALUES ($1,$2,$3,$4,false) RETURNING *`,
[razao_social, cnpj, (uf||'').toUpperCase(), !!quimicos_controlados]
);
res.status(201).json(rows[0]);
});


router.put('/:id', authRequired, async (req, res) => {
const { razao_social, cnpj, uf, quimicos_controlados } = req.body;
const { rows } = await pool.query(
`UPDATE transportadoras SET razao_social=$1, cnpj=$2, uf=$3, quimicos_controlados=$4
WHERE id=$5 RETURNING *`,
[razao_social, cnpj, (uf||'').toUpperCase(), !!quimicos_controlados, req.params.id]
);
if (!rows[0]) return res.status(404).json({ error: 'Não encontrada' });
// Perfil pode ter mudado: recomputar disponibilidade
recomputeDisponibilidade(req.params.id);
res.json(rows[0]);
});


router.delete('/:id', authRequired, async (req, res) => {
await pool.query('DELETE FROM transportadoras WHERE id=$1', [req.params.id]);
res.status(204).end();
});


export default router;