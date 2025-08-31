import { useEffect, useState } from 'react'
import { apiGet, apiUpload } from '../api'   // <-- IMPORTANTE

export default function UploadDocumento() {
  const [transportadoras, setTransportadoras] = useState([])
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({
    transportadora_id: '',
    tipo_documento_id: '',
    data_vencimento: '',
    arquivo: null,
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Carrega transportadoras e tipos de documento
  useEffect(() => {
    (async () => {
      try {
        const [ts, tds] = await Promise.all([
          apiGet('/transportadoras'),
          apiGet('/tipos-documento'),
        ])
        setTransportadoras(ts)
        setTipos(tds)
      } catch (err) {
        console.error(err)
        setMsg('Falha ao carregar listas. Verifique se está logado e a API está ativa.')
      }
    })()
  }, [])

  // Envio do formulário
  async function submit() {
    setMsg('')
    // validações simples
    if (!form.transportadora_id) return setMsg('Selecione uma transportadora.')
    if (!form.tipo_documento_id) return setMsg('Selecione um tipo de documento.')
    if (!form.data_vencimento) return setMsg('Informe a data de vencimento.')

    try {
      setLoading(true)

      const fd = new FormData()
      // garanta números para os IDs (o backend costuma esperar inteiros)
      fd.append('transportadora_id', Number(form.transportadora_id))
      fd.append('tipo_documento_id', Number(form.tipo_documento_id))
      fd.append('data_vencimento', form.data_vencimento)
      if (form.arquivo) fd.append('arquivo', form.arquivo)

      await apiUpload('/documentos', fd)

      setMsg('✅ Documento enviado! Disponibilidade recalculada.')
      setForm({
        transportadora_id: '',
        tipo_documento_id: '',
        data_vencimento: '',
        arquivo: null,
      })
    } catch (err) {
      console.error(err)
      setMsg('❌ Falha ao enviar. Confira o login, os campos e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Upload de Documento</h3>

      {/* Formulário */}
      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Transportadora</label>
          <select
            className="input"
            value={form.transportadora_id}
            onChange={e =>
              setForm({ ...form, transportadora_id: e.target.value })
            }
          >
            <option value="">Selecione</option>
            {transportadoras.map(t => (
              <option key={t.id} value={t.id}>
                {t.razao_social}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label>Tipo de Documento</label>
          <select
            className="input"
            value={form.tipo_documento_id}
            onChange={e =>
              setForm({ ...form, tipo_documento_id: e.target.value })
            }
          >
            <option value="">Selecione</option>
            {tipos.map(td => (
              <option key={td.id} value={td.id}>
                {td.nome}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: 220 }}>
          <label>Data de Vencimento</label>
          <input
            className="input"
            type="date"
            value={form.data_vencimento}
            onChange={e =>
              setForm({ ...form, data_vencimento: e.target.value })
            }
          />
        </div>

        <div style={{ flex: 1 }}>
          <label>Arquivo (opcional)</label>
          <input
            className="input"
            type="file"
            onChange={e =>
              setForm({ ...form, arquivo: e.target.files?.[0] ?? null })
            }
          />
        </div>
      </div>

      {/* Botão */}
      <div style={{ marginTop: 12 }}>
        <button
          className="btn"
          disabled={
            loading ||
            !form.transportadora_id ||
            !form.tipo_documento_id ||
            !form.data_vencimento
          }
          onClick={submit}
          type="button"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {/* Mensagem */}
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </div>
  )
}
