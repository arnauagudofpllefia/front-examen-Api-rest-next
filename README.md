# Projecte Examen: Frontend Next.js (API Externa)

Aquest repositori conte nomes el client Next.js.

El backend API REST esta en un altre repositori i aquest frontend el consumeix amb fetch.

## Estructura

- `src/app/` Frontend Next.js
- `src/lib/api.js` client de consum de l'API externa

## Requisits

- Node.js 18+ (recomanat 20+)
- npm

## Variables d'entorn

Client (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Instal·lacio

```bash
npm install
```

## Execucio local

Terminal (web):

```bash
npm run dev
```

Frontend local: `http://localhost:3000`
API local externa: `http://localhost:3001` (o la URL que tingui el teu backend)

## Endpoints API consumits

Base URL local: `http://localhost:3001`

### 1) GET /api/bacalla

Retorna tot el llistat.

Exemple resposta 200:

```json
[
	{
		"id": 1,
		"nom": "Bacalla d'Islandia premium",
		"origen": "Islandia",
		"tipus": "Salat sencer",
		"descripcio": "Lloms gruixuts de textura ferma..."
	}
]
```

### 2) GET /api/bacalla/:id

Retorna el detall per id.

Exemple 404:

```json
{
	"message": "Varietat de bacalla no trobada"
}
```

### 3) POST /api/bacalla

Crea una nova varietat (id generat pel backend extern).

Body JSON requerit:

```json
{
	"nom": "Bacalla gourmet",
	"origen": "Noruega",
	"tipus": "Dessalat",
	"descripcio": "Textura suau i sabor net."
}
```

Resposta 201:

```json
{
	"id": 6,
	"nom": "Bacalla gourmet",
	"origen": "Noruega",
	"tipus": "Dessalat",
	"descripcio": "Textura suau i sabor net."
}
```

## Rutes Frontend

- `/` portada amb resum
- `/bacalla` llistat
- `/bacalla/[id]` detall
- `/afegir` formulari interactiu

## Desplegament

### Frontend (Vercel)

- Deploy del projecte Next.js
- Variable: `NEXT_PUBLIC_API_BASE_URL=https://api-bacalla.onrender.com`

## Nota

Aquest projecte no inclou cap servidor Express local. Si necessites provar en local, arrenca el backend des del seu repositori i apunta `NEXT_PUBLIC_API_BASE_URL` a la seva URL.
