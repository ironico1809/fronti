// Servicio para login con JWT
export async function loginUsuario({ correo, contrasena }) {
  const response = await fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena })
  });
  return response.json();
}
