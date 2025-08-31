import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Login(){
const [username, setUsername] = useState('admin')
const [password, setPassword] = useState('admin123')
const [err, setErr] = useState('')
const nav = useNavigate()
const { login } = useAuth()


async function onSubmit(e){
e.preventDefault()
setErr('')
try {
const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/auth/login`, {
method: 'POST', headers:{'Content-Type':'application/json'},
body: JSON.stringify({ username, password })
})
if(!res.ok){ throw new Error('Falha no login') }
const data = await res.json()
login(data.token)
nav('/transportadoras')
} catch (e) {
setErr('Usuário ou senha inválidos')
}
}


return (
<div className="card" style={{maxWidth:420, margin:'40px auto'}}>
<h3>Acessar</h3>
<form onSubmit={onSubmit}>
<label>Usuário</label>
<input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
<label>Senha</label>
<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
{err && <p style={{color:'#fca5a5'}}>{err}</p>}
<div style={{marginTop:12}}>
<button className="btn" type="submit">Entrar</button>
</div>
</form>
</div>
)
}