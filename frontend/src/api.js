const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';


export function authHeader() {
const token = localStorage.getItem('token');
return token ? { 'Authorization': `Bearer ${token}` } : {};
}


export async function apiGet(path) {
const res = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json', ...authHeader() } });
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function apiPost(path, body) {
const res = await fetch(`${API}${path}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json', ...authHeader() },
body: JSON.stringify(body)
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function apiPut(path, body) {
const res = await fetch(`${API}${path}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json', ...authHeader() },
body: JSON.stringify(body)
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function apiDelete(path) {
const res = await fetch(`${API}${path}`, { method: 'DELETE', headers: { ...authHeader() } });
if (!res.ok) throw new Error(await res.text());
return true;
}


export async function apiUpload(path, formData) {
const res = await fetch(`${API}${path}`, { method: 'POST', headers: { ...authHeader() }, body: formData });
if (!res.ok) throw new Error(await res.text());
return res.json();
}