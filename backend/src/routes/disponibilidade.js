import { Router } from 'express';
import pool from '../db.js';
import { authRequired } from '../middleware/auth.js';


const router = Router();


router.get('/', authRequired, async (req, res) => {
const { uf, controlados } = req.query;
const values = [];
const filters = [];


if (uf) { values.push(uf.toUpperCase()); filters.push(`uf = $${values.length}`); }
if (typeof controlados !== 'undefined') {
values.push(controlados === 'true');
filters.push(`quimicos_controlados = $${values.length}`);
}


const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
const all = await pool.query(`SELECT * FROM transportadoras ${where} ORDER BY razao_social ASC`, values);
const disponiveis = all.rows.filter(r => r.disponivel_para_frete);
const indisponiveis = all.rows.filter(r => !r.disponivel_para_frete);
res.json({ disponiveis, indisponiveis });
});


export default router;