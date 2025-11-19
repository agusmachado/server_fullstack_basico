// Estadísticas que calcula el backend sobre TODO el catálogo
export interface EstadisticasCatalogo {
    cantidadDeProductos: number
    precioPromedio: number
    precioMaximo: number
    precioMinimo: number
}

// Respuesta JSON que devuelve el endpoint GET => /api/ai/products-profile
// - Incluye el texto generado por la IA y las estadísticas
export interface RespuestaAnalisisCatalogo {
    analisisIA: string
    estadisticasCatalogo: EstadisticasCatalogo
}

// Errores o respuestas vacías
export const RESPUESTA_ANALISIS_VACIA: RespuestaAnalisisCatalogo = {
    analisisIA: "No hay productos cargados todavía, no puedo analizar el catálogo",
    estadisticasCatalogo: {  cantidadDeProductos: 0, precioPromedio: 0, precioMaximo: 0, precioMinimo: 0 }
}