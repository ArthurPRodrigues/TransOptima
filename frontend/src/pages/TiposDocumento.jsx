import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../api' // <-- IMPORTANTE

export default function TiposDocumento() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({
    nome: '',
    obrigatorio_controlados: false,
    obrigatorio_nao_controlados: false,
    ativo: true,
  })
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const data = await apiGet('/tipos-documento')
      setList(data)
    } catch (err) {
      console.error(err)
      alert('Falha ao carregar tipos de documento.')
    }
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!form.nome.trim()) return alert('Informe o nome do tipo.')
    try {
      setLoading(true)
      await apiPost('/tipos-documento', {
        nome: form.nome.trim(),
        obrigatorio_controlados: !!form.obrigatorio_controlados,
        obrigatorio_nao_controlados: !!form.obrigatorio_nao_controlados,
        ativo: !!form.ativo,
      })
      setForm({
        nome: '',
        obrigatorio_controlados: false,
        obrigatorio_nao_controlados: false,
        ativo: true,
      })
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao criar tipo de documento.')
    } finally {
      setLoading(false)
    }
  }

  async function update(id, patch) {
    try {
      const cur = list.find(x => x.id === id)
      if (!cur) return
      await apiPut(`/tipos-documento/${id}`, { ...cur, ...patch })
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao atualizar tipo de documento.')
    }
  }

  async function remove(id) {
    if (!confirm('Confirma excluir este tipo?')) return
    try {
      await apiDelete(`/tipos-documento/${id}`)
      await load()
    } catch (err) {
      console.error(err)
      alert('Falha ao excluir tipo de documento.')
    }
  }

  return (
    <div className="card">
      <h3>Tipos de Documento</h3>

      {/* Formulário de criação */}
      <div className="row" style={{ marginBottom: 12 }}>
        <div style={{ flex: 2 }}>
          <label>Nome</label>
          <input
            className="input"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            placeholder="Ex.: Licença ambiental"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={form.obrigatorio_controlados}
              onChange={e => setForm({ ...form, obrigatorio_controlados: e.target.checked })}
            />{' '}
            Obrigatório p/ Controlados
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.obrigatorio_nao_controlados}
              onChange={e => setForm({ ...form, obrigatorio_nao_controlados: e.target.checked })}
            />{' '}
            Obrigatório p/ Não Controlados
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={e => setForm({ ...form, ativo: e.target.checked })}
            />{' '}
            Ativo
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn" type="button" onClick={create} disabled={loading}>
            {loading ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Tabela */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Obr. Ctrl</th>
            <th>Obr. Não Ctrl</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map(td => (
            <tr key={td.id}>
              <td>{td.id}</td>
              <td>
                <input
                  className="input"
                  value={td.nome || ''}
                  onChange={e => update(td.id, { nome: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!!td.obrigatorio_controlados}
                  onChange={e => update(td.id, { obrigatorio_controlados: e.target.checked })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!!td.obrigatorio_nao_controlados}
                  onChange={e => update(td.id, { obrigatorio_nao_controlados: e.target.checked })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!!td.ativo}
                  onChange={e => update(td.id, { ativo: e.target.checked })}
                />
              </td>
              <td>
                <button className="btn danger" onClick={() => remove(td.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', opacity: 0.7 }}>
                Nenhum tipo cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
