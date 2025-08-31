import { Router } from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const router = Router();


router.post('/login', async (req, res) => {
const { username, password } = req.body;
try {
const { rows } = await pool.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [username]);
const user = rows[0];
if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });


const stored = user.password_hash;
let ok = false;
if (stored && stored.startsWith('$2')) {
ok = await bcrypt.compare(password, stored);
} else {
ok = password === stored; // MVP: aceita plaintext seed
}


if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });


const token = jwt.sign({ sub: user.id, username: user.username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });
res.json({ token });
} catch (e) {
console.error(e);
res.status(500).json({ error: 'Erro ao autenticar' });
}
});


export default router;