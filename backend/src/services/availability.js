import pool from '../db.js';


export async function recomputeDisponibilidade(transportadoraId) {
const client = await pool.connect();
try {
// Carrega a transportadora
const t = await client.query('SELECT * FROM transportadoras WHERE id=$1', [transportadoraId]);
const tr = t.rows[0];
if (!tr) return;


// Quais tipos são obrigatórios para este perfil?
const tipos = await client.query(
`SELECT * FROM tipos_documento WHERE ativo = true AND (
($1::boolean = true AND obrigatorio_controlados = true) OR
($1::boolean = false AND obrigatorio_nao_controlados = true)
)`,
[tr.quimicos_controlados]
);


const hoje = new Date();
let ok = true;


for (const tipo of tipos.rows) {
// Existe ao menos 1 documento vigente deste tipo para a transportadora?
const q = await client.query(
`SELECT data_vencimento FROM documentos
WHERE transportadora_id=$1 AND tipo_documento_id=$2
ORDER BY data_vencimento DESC LIMIT 1`,
[transportadoraId, tipo.id]
);
const doc = q.rows[0];
if (!doc) { ok = false; break; }
const venc = new Date(doc.data_vencimento);
if (venc < hoje) { ok = false; break; }
}


await client.query('UPDATE transportadoras SET disponivel_para_frete=$1 WHERE id=$2', [ok, transportadoraId]);
} catch (e) {
console.error('Erro recomputeDisponibilidade', e);
} finally {
client.release();
}
}