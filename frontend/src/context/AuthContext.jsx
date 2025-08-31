import React, { createContext, useContext, useState } from 'react'


const AuthCtx = createContext()
export function useAuth(){ return useContext(AuthCtx) }


export function AuthProvider({ children }){
const [token, setToken] = useState(localStorage.getItem('token'))


function login(t){ localStorage.setItem('token', t); setToken(t) }
function logout(){ localStorage.removeItem('token'); setToken(null) }


return <AuthCtx.Provider value={{ token, login, logout }}>{children}</AuthCtx.Provider>
}