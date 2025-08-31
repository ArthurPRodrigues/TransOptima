import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { recomputeDisponibilidade } from '../services/availability.js';


const router = Router();


router.get('/', authRequired, async (req, res) => {
const { rows } = await pool.query('SELECT * FROM tipos_documento WHERE ativo=true ORDER BY id DESC');
res.json(rows);
});


router.post('/', authRequired, async (req, res) => {
const { nome, obrigatorio_controlados, obrigatorio_nao_controlados, ativo } = req.body;
const { rows } = await pool.query(
`INSERT INTO tipos_documento (nome, obrigatorio_controlados, obrigatorio_nao_controlados, ativo)
VALUES ($1,$2,$3,$4) RETURNING *`,
[nome, !!obrigatorio_controlados, !!obrigatorio_nao_controlados, ativo !== false]
);
res.status(201).json(rows[0]);
});


router.put('/:id', authRequired, async (req, res) => {
const { nome, obrigatorio_controlados, obrigatorio_nao_controlados, ativo } = req.body;
const { rows } = await pool.query(
`UPDATE tipos_documento SET nome=$1, obrigatorio_controlados=$2, obrigatorio_nao_controlados=$3, ativo=$4
WHERE id=$5 RETURNING *`,
[nome, !!obrigatorio_controlados, !!obrigatorio_nao_controlados, !!ativo, req.params.id]
);
if (!rows[0]) return res.status(404).json({ error: 'Não encontrado' });


// Como regras de obrigatoriedade podem mudar, recomputar todas as transportadoras
const all = await pool.query('SELECT id FROM transportadoras');
await Promise.all(all.rows.map(r => recomputeDisponibilidade(r.id)));


res.json(rows[0]);
});


router.delete('/:id', authRequired, async (req, res) => {
await pool.query('DELETE FROM tipos_documento WHERE id=$1', [req.params.id]);
// Recompute disponibilidade (pode relaxar as exigências)
const all = await pool.query('SELECT id FROM transportadoras');
await Promise.all(all.rows.map(r => recomputeDisponibilidade(r.id)));
res.status(204).end();
});


export default router;