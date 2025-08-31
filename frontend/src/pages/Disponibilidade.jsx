import { useEffect, useState } from 'react'
import { apiGet } from '../api'

function List({ title, items }){
  return (
    <div className="card">
      <h4>{title} ({items.length})</h4>
      <table className="table">
        <thead>
          <tr><th>Razão Social</th><th>UF</th><th>Controlados?</th></tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id}>
              <td>{t.razao_social}</td>
              <td>{t.uf}</td>
              <td>{t.quimicos_controlados ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Disponibilidade(){
  const [uf, setUf] = useState('')
  const [controlados, setControlados] = useState('')
  const [data, setData] = useState({ disponiveis: [], indisponiveis: [] })

  async function load(){
    const qs = new URLSearchParams()
    if(uf) qs.set('uf', uf)
    if(controlados!=='') qs.set('controlados', controlados)
    const resp = await apiGet(`/disponibilidade?${qs.toString()}`)
    setData(resp)
  }

  useEffect(()=>{ load() }, [uf, controlados])

  return (
    <div>
      <div className="card">
        <h3>Disponibilidade para Frete</h3>
        <div className="row">
          <div style={{width:100}}>
            <label>UF</label>
            <input
              className="input"
              placeholder="SC"
              value={uf}
              onChange={e=>setUf(e.target.value.toUpperCase().slice(0,2))}
            />
          </div>
          <div style={{width:240}}>
            <label>Tipo de Produto</label>
            <select
              className="input"
              value={controlados}
              onChange={e=>setControlados(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Controlado</option>
              <option value="false">Não Controlado</option>
            </select>
          </div>
        </div>
      </div>

      <List title="Disponíveis" items={data.disponiveis} />
      <List title="Indisponíveis" items={data.indisponiveis} />
    </div>
  )
}
