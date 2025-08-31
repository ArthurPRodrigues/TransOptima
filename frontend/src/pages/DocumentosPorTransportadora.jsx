import { useEffect, useState } from 'react'
import { apiGet, apiDelete } from '../api' // <-- IMPORTANTE

// Componente para exibir o status
function StatusPill({ status }) {
  const cls =
    status === 'VALIDO' ? 'ok' :
    status === 'A_VENCER' ? 'warn' : 'err'

  const label =
    status === 'VALIDO' ? 'Válido' :
    status === 'A_VENCER' ? 'A vencer' : 'Expirado'

  return <span className={`badge ${cls}`}>{label}</span>
}

export default function DocumentosPorTransportadora() {
  const [transportadoras, setTransportadoras] = useState([])
  const [docs, setDocs] = useState([])
  const [tid, setTid] = useState('')      // id selecionado (string do <select>)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Carrega transportadoras na inicialização
  useEffect(() => {
    (async () => {
      try {
        const ts = await apiGet('/transportadoras')
        setTransportadoras(ts || [])
      } catch (err) {
        console.error(err)
        setMsg('Falha ao carregar transportadoras. Verifique o login e a API.')
      }
    })()
  }, [])

  // Carrega documentos da transportadora selecionada
  async function load() {
    setMsg('')
    if (!tid) { setDocs([]); return }
    try {
      setLoading(true)
      // garante número na query (muitos backends esperam int)
      const id = Number(tid)
      const data = await apiGet(`/documentos?transportadora_id=${id}`)
      setDocs(Array.isArray(data) ? data : [])
      if (!data || data.length === 0) setMsg('Nenhum documento para esta transportadora.')
    } catch (err) {
      console.error(err)
      setMsg('Falha ao carregar documentos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [tid])

  // Excluir documento
  async function remove(id) {
    if (!confirm('Confirma excluir este documento?')) return
    try {
      await apiDelete(`/documentos/${id}`)
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao excluir documento.')
    }
  }

  // monta URL do arquivo (aceita `arquivo_url` ou `arquivo` vindo do backend)
  function buildFileUrl(d) {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const path = d.arquivo_url || d.arquivo || ''
    if (!path) return null
    // se já vier com http, retorna direto
    if (/^https?:\/\//i.test(path)) return path
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`
  }

  return (
    <div className="card">
      <h3>Documentos por Transportadora</h3>

      <div style={{ maxWidth: 420, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label>Transportadora</label>
          <select
            className="input"
            value={tid}
            onChange={e => setTid(e.target.value)}
          >
            <option value="">Selecione</option>
            {transportadoras.map(t => (
              <option key={t.id} value={String(t.id)}>
                {t.razao_social}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" type="button" onClick={load} disabled={!tid || loading}>
          {loading ? 'Carregando…' : 'Buscar'}
        </button>
      </div>

      {msg && <p style={{ marginTop: 10, opacity: 0.85 }}>{msg}</p>}

      {docs.length > 0 && (
        <table className="table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Cadastro</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Arquivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(d => {
              const fileUrl = buildFileUrl(d)
              return (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.tipo_nome}</td>
                  <td>{d.data_cadastro ? new Date(d.data_cadastro).toLocaleString('pt-BR') : '-'}</td>
                  <td>{d.data_vencimento ? new Date(d.data_vencimento).toLocaleDateString('pt-BR') : '-'}</td>
                  <td><StatusPill status={d.status} /></td>
                  <td>
                    {fileUrl ? (
                      <a href={fileUrl} target="_blank" rel="noreferrer">abrir</a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button className="btn danger" onClick={() => remove(d.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
