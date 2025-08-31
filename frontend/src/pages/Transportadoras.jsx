import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../api' // <— IMPORTS DA API

export default function Transportadoras() {
  const [form, setForm] = useState({
    razao_social: '',
    cnpj: '',
    uf: 'SC',
    quimicos_controlados: false,
  })
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const data = await apiGet('/transportadoras')
      setList(data)
    } catch (err) {
      console.error(err)
      alert('Falha ao carregar transportadoras. Verifique se a API está rodando.')
    }
  }

  async function create() {
    // validações simples
    if (!form.razao_social.trim()) return alert('Informe a razão social.')
    if (!form.cnpj.trim() || form.cnpj.replace(/\D/g, '').length !== 14)
      return alert('Informe um CNPJ com 14 dígitos.')
    if (!/^[A-Z]{2}$/.test(form.uf)) return alert('UF deve ter 2 letras (ex.: SC).')

    try {
      setLoading(true)
      await apiPost('/transportadoras', {
        razao_social: form.razao_social.trim(),
        cnpj: form.cnpj.replace(/\D/g, ''), // envia só números
        uf: form.uf.toUpperCase(),
        quimicos_controlados: !!form.quimicos_controlados,
      })
      setForm({ razao_social: '', cnpj: '', uf: 'SC', quimicos_controlados: false })
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao cadastrar. Confira se está logado e os dados estão corretos.')
    } finally {
      setLoading(false)
    }
  }

  async function update(id, patch) {
    try {
      const cur = list.find(x => x.id === id)
      if (!cur) return
      const payload = { ...cur, ...patch }
      // normalizações
      if (payload.uf) payload.uf = String(payload.uf).toUpperCase().slice(0, 2)
      if (payload.cnpj) payload.cnpj = String(payload.cnpj).replace(/\D/g, '')
      await apiPut(`/transportadoras/${id}`, payload)
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao atualizar transportadora.')
    }
  }

  async function remove(id) {
    if (!confirm('Confirma excluir esta transportadora?')) return
    try {
      await apiDelete(`/transportadoras/${id}`)
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao excluir transportadora.')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card">
      <h3>Transportadoras</h3>

      {/* Formulário de cadastro */}
      <div className="row" style={{ marginBottom: 12 }}>
        <div style={{ flex: 2 }}>
          <label>Razão Social</label>
          <input
            className="input"
            value={form.razao_social}
            onChange={e => setForm({ ...form, razao_social: e.target.value })}
            placeholder="Transportadora Exemplo LTDA"
          />
        </div>

        <div style={{ flex: 1 }}>
          <label>CNPJ</label>
          <input
            className="input"
            value={form.cnpj}
            onChange={e => setForm({ ...form, cnpj: e.target.value })}
            placeholder="Só números (14 dígitos)"
          />
        </div>

        <div style={{ width: 100 }}>
          <label>UF</label>
          <input
            className="input"
            value={form.uf}
            onChange={e =>
              setForm({ ...form, uf: e.target.value.toUpperCase().slice(0, 2) })
            }
            placeholder="SC"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={form.quimicos_controlados}
              onChange={e => setForm({ ...form, quimicos_controlados: e.target.checked })}
            />{' '}
            Controlados
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn" type="button" onClick={create} disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar'}
          </button>
        </div>
      </div>

      {/* Tabela */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>UF</th>
            <th>Controlados</th>
            <th>Disponível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>
                <input
                  className="input"
                  value={it.razao_social || ''}
                  onChange={e => update(it.id, { razao_social: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="input"
                  value={it.cnpj || ''}
                  onChange={e => update(it.id, { cnpj: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="input"
                  value={it.uf || ''}
                  onChange={e => update(it.id, { uf: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!!it.quimicos_controlados}
                  onChange={e => update(it.id, { quimicos_controlados: e.target.checked })}
                />
              </td>
              <td>
                {it.disponivel_para_frete ? (
                  <span className="badge ok">Disponível</span>
                ) : (
                  <span className="badge err">Indisponível</span>
                )}
              </td>
              <td>
                <button className="btn danger" onClick={() => remove(it.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', opacity: 0.7 }}>
                Nenhuma transportadora cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
