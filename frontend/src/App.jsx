import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Transportadoras from './pages/Transportadoras'
import TiposDocumento from './pages/TiposDocumento'
import UploadDocumento from './pages/UploadDocumento'
import DocumentosPorTransportadora from './pages/DocumentosPorTransportadora'
import Disponibilidade from './pages/Disponibilidade'
import PrivateRoute from './components/PrivateRoute'


export default function App(){
return (
<>
<Navbar />
<div className="container">
<Routes>
<Route path="/" element={<div className="card"><h2>TransOptima</h2><p>MVP de gerenciamento de transportadoras e documentos.</p></div>} />
<Route path="/login" element={<Login />} />


<Route path="/transportadoras" element={<PrivateRoute><Transportadoras /></PrivateRoute>} />
<Route path="/tipos-documento" element={<PrivateRoute><TiposDocumento /></PrivateRoute>} />
<Route path="/upload-documento" element={<PrivateRoute><UploadDocumento /></PrivateRoute>} />
<Route path="/documentos" element={<PrivateRoute><DocumentosPorTransportadora /></PrivateRoute>} />
<Route path="/disponibilidade" element={<PrivateRoute><Disponibilidade /></PrivateRoute>} />
</Routes>
</div>
</>
)
}