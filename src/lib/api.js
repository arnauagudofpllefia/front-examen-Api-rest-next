// URL base de la API externa, llegida de les variables d'entorn del projecte
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Intenta parsejar la resposta com JSON; si no és JSON retorna el text com a objecte
async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

// Funció interna que executa una petició fetch a l'API.
// Llança un Error si falta la variable d'entorn o si l'HTTP status no és 2xx.
async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en las variables de entorno");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",   // sempre dades fresques, sense caché del servidor de Next.js
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    // Propaga el missatge d'error de l'API o un text genèric amb el codi HTTP
    const message = payload?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

// GET /health — comprova que l'API estigui activa
export async function getHealth() {
  return request("/health", { method: "GET" });
}

// GET /api/mascotas — retorna el llistat complet de mascotas
export async function getMascotasList() {
  return request("/api/mascotas", { method: "GET" });
}

// GET /api/mascotas/:id — retorna el detall d'una mascota per id
export async function getMascotaById(id) {
  return request(`/api/mascotas/${id}`, { method: "GET" });
}

// POST /api/mascotas — crea una nova mascota amb les dades del formulari
export async function createMascota(data) {
  return request("/api/mascotas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /api/mascotas/:id — actualitza una mascota existent
export async function updateMascota(id, data) {
  return request(`/api/mascotas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /api/mascotas/:id — elimina una mascota per id
export async function deleteMascota(id) {
  return request(`/api/mascotas/${id}`, { method: "DELETE" });
}
