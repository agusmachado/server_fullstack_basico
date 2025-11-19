import { Product } from "@prisma/client";
import { Request, Response } from "express";
import Groq from "groq-sdk";
import { prisma } from "../lib/prisma";
import { EstadisticasCatalogo, RESPUESTA_ANALISIS_VACIA, RespuestaAnalisisCatalogo } from "../types/ai";

// 1 - Creamos el cliente de Groq con nuestra API Key, que tenemos en nuestro archivo .env
const groqCliente = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function aiController(_req: Request, res: Response) {
    // 1 - Traemos TODOS loas productos con tipado estricto del modelo Prisma
    const listaDeProductos: Product[] = await prisma.product.findMany({
        orderBy: { id: "asc" },
    })

    // 2 - Si no hay productos, devolvemos una respuesta mínima y ya tipada / NO llamamos a la IA ( ahorra tiempo y DINERO )
    if (listaDeProductos.length === 0) {
        return res.json( RESPUESTA_ANALISIS_VACIA )
    }

    // 3 - Calculamos estadísticas simples y con nombre fáciles de recordar
    const cantidadDeProductos: number = listaDeProductos.length
    const listaDePrecios: number[] = listaDeProductos.map((producto) => producto.price)
    const sumaDePrecios: number = listaDePrecios.reduce( (acumulado, precio) => acumulado + precio, 0)
    const precioPromedio: number = sumaDePrecios / cantidadDeProductos
    const precioMaximo: number = Math.max( ...listaDePrecios )
    const precioMinimo: number = Math.min( ...listaDePrecios )


    // -------------------------------- PROMPT IA ------------------------------

    // 4 - Armamos el prompt ( texto ) para la IA: que datos le damos y que queremos de vuelta
    const promptAnalisis: string = `
        Sos un analista de catálogo. Te paso el listado completo de productos y estadísticas.
        Respondé en español con:
        1) Un perfil general del catálogo.
        2) Posibles problemas u omisiones.
        3) Oportunidades y mejoras.
        4) Un campo adicional que convendría agrega para segmentar mejor.

        PRODUCTOS_JSON: ${ JSON.stringify( listaDeProductos ) }
        ESTADÍSTICAS:
                        - cantidadDeProductos: ${cantidadDeProductos}
                        - precioPromedio: ${precioPromedio.toFixed(2)}
                        - precioMaximo: ${precioMaximo}
                        - precioMinimo: ${precioMinimo}
        `.trim()  
    
    // ------------------------------ LLAMAMOS A LA IA
    // 5 - Llamamos a la IA con el SDK de Groq
    try {
        // 5.1 - Preparamos la llamada al modelo
        const respuestaGroq = await groqCliente.chat.completions.create({
            model: "llama-3.1-8b-instant",          // Modelo rápido y económico creado por Meta
            // role "system" - reglas generales que debe adoptar el modelo de IA
            // role "user" - nuestro pedido concreto
            messages: [
                { role: "system", content: "Sos un asistente experto en análisis de catálogos de productos", },
                { role: "user", content: promptAnalisis }
            ]
        })

        // 5.2  - Extraemos solo el texto que escribió la IA
        // - La respuesta, generalmente vuelve así => { choices: [ { message: { content: "texto de la IA" } } ] } 
        // - ? - Si algo no existe, no rompe, seguimos.
        // - ?? - Si quedó undefined / null, mostramos el texto en el que la IA no devuelve
        const contenidoGeneradoIA: string = respuestaGroq.choices?.[0]?.message?.content ?? "La IA no devolvió contenido."

        // 5.3 - Armamos el objeto de estadísticas
        const estadisticasCatalogo: EstadisticasCatalogo = { cantidadDeProductos, precioPromedio, precioMaximo, precioMinimo }

        // 5.4 - Aramos el objeto final que va al frontend
        const respuestaAnalisisCatalogo: RespuestaAnalisisCatalogo = { analisisIA: contenidoGeneradoIA, estadisticasCatalogo }

        // 5.5 - Devolvemos todo en formato JSON
        return res.json( respuestaAnalisisCatalogo )

    } catch (error) {
        
        console.error("La llamada a la IA ha dado el siguiente error:", error)
    }
}
