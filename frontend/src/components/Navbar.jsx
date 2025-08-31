import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Navbar(){
const { token, logout } = useAuth()
return (
<div className="nav">
<Link to="/">Home</Link>
{token && <>
<Link to="/transportadoras">Transportadoras</Link>
<Link to="/tipos-documento">Tipos de Documento</Link>
<Link to="/upload-documento">Upload Documento</Link>
<Link to="/documentos">Documentos por Transportadora</Link>
<Link to="/disponibilidade">Disponibilidade</Link>
<button className="btn secondary" onClick={logout}>Sair</button>
</>}
{!token && <Link to="/login">Login</Link>}
</div>
)
}