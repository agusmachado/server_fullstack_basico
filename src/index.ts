import express from 'express' // Framework para crear servidores web
import router from './router'
import cors, { type CorsOptions } from 'cors'
import { aiController } from './controllers/aiController'

const app = express() // Creamos una nueva app de Express (nuestro servidor backend)

app.use(express.json())
/* 
    Desde el frontend sale una petición. Esa petición llega al server y pasa por express.json()
    expres.json() hace que esa petición sea legible.
    El sistema procesa esa petición con prisma y, ahí, decide que hacer con esa petición.

    Ejemplo:
    {
        "name": "Lapicera",
        "price": 10
    }

    El middleware express.json() lee el body y lo convierte a un objeto JavaScript.
    Ahora podemos hacer req.body.name y obtener "Lapicera"
*/

// CORS - El frontend viaja hacia el puerto 3000 (que es el backend) y, en el server a través de cors le abren la puerta al puerto 5173
// Este mecanismo se necesita cuando estamos en Desarrollo
/* app.use(cors({
    origin: "http://localhost:5173", // Permitimos que solo este origen pueda hacer pedidos al backend
    methods: ['GET', 'POST']
})) */

const FRONTEND_URL = process.env.FRONTEND_URL // ej: "https://mi-app.vercel.app"

const whitelist = [
    "http://localhost:5173",        // DESARROLLO - Invitado (dev)
    FRONTEND_URL                    // PRODUCCIÓN - Invitado (Vercel)
].filter(Boolean)                   // Si FRONTEND_URL no está definido, lo quitamos


const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // 1 - Si no hay origen - No bloquea, habilita pruebas tipo las de POSTMAN
        if (!origin) {
            return callback(null, true)
        }

        // 2 - Si hay origen y está en la whitelist, PERMITIMOS - El navegador autoriza la llamada del frontend
        if (whitelist.includes(origin)) {
            return callback(null, true)
        }

        // 3 - En cualquier otro caso, BLOQUEAMOS
        return callback(new Error("CORS: origen no permitido"))
    },

    credentials: true,
}

// Registramos
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))


app.use('/api/products', router)

app.get("/api/ai/products-profile", aiController)


// 404 - "Not Found": se ejecuta si ninguna ruta contesta
app.use((req, res, _next) => {
    res.status(404).json({
        error:'No encontrado - Not Found',
        path: req.originalUrl, // Ruta que intentaron acceder
        method: req.method
    })
})


// ---- Manejador de errores GLOBAL (500 y otros)
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error Handler :', err)
    const isDev = process.env.NODE_ENV !== 'production'

    const payload: Record<string, unknown> = {
        error: 'Internal server error',
        tip: 'Revisá la consola del servidor para más detalles'
    }

    // Si estamos en desarrollo agregamos más detalles técnicos
    if (isDev) {
        payload.details = {
            message: err?.message,
            stack: err?.stack
        }
    }

    // Elegimos el status HTTP:
    const status = typeof err?.status === 'number' ? err.status: 500

    // Enviamos la respuesta JSON al cliente con el status
    res.status(status).json(payload)
})

export default app