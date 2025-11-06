// Flujo => Frontend => Server => Rutas => controller ( contiene los handlers => funciones con prisma) => BD

// Importamos los tipos de Express para tipar correctamente los parámetros del handler
/* 
 - Request: lo que llega del cliente (headers, body, params, etc...)
 - Response: lo que le vamos a devolver al cliente (cliente = frontend)
 - NextFunction: si algo sale mal, pasa el error a un manejador global
*/
import { Request, Response, NextFunction } from "express";

// Importamos prisma, que es nuestro único contacto con la BD
import { prisma } from "../lib/prisma";

export async function crearProducto( req: Request, res: Response, next: NextFunction ) {

    try {
        // 1 - Lo que envía el cliente
        // - name => tiene que ser un string y le sacamos espacios a los costados con trim
        const name = String(req.body?.name ?? '').trim()

        // - price => convertimos price a número, por si vino como string ( ej: "10" )
        const price = Number(req.body?.price)

        // 2 - Le pedimos a Prisma que cree el registro en la tabla "Product"
        const crear = await prisma.product.create({
            data: { name, price}
        })

        // 3 - Si salió bien, devolvemos un 201(Created) y el JSON del registro nuevo
        res.status(201).json(crear)
    } catch (error) {
        next(error)
        // 4 - Si algo sale mal ( por ejemplo, no conecta la BD), le pasamos el error al manejador global
    }    
}

export async function listaProductos(_req: Request, res: Response, next: NextFunction) {
    try {
        // 1 - Pedimos todos los productos ordenados por id ascendente
        const items = await prisma.product.findMany({
            orderBy: { id: 'asc'}
        })
        res.json(items)
    } catch (error) {
        next(error)
    }
}

export async function editarProducto(req: Request, res: Response, next: NextFunction) {
        
    try {
        // 1 - Validamos el id
        // El id SIEMPRE viene como string "api/products/7" = "7"
        const id = Number(req.params.id)
        // Id válido(true) = 7, 2.5 - Id inválido(false) NaN - Infinity (-Infinitei)
        if (!Number.isFinite(id)) {
            return res.status(400).json({ message: "id inválido"})
        }

        const { name, price } = req.body as { name?: string; price?: number }

        if (typeof name === "undefined" && typeof price === "undefined") {
            return res.json(400).json({ message: "Nada que actualizar" })
        }

        // 2 - Actualizamos
        const updated = await prisma.product.update({
            where: { id },          // El id, cuyos campos dependientes (name o price) vamos a actualizar
            data:{
                ...(name !== undefined && { name }),    // Incluir un "name", SOLO si vino
                ...(price !== undefined && { price }),  // Incluir un "price", SOLO si vino
            },
        })


        // 3 - Respuesta de éxito
        return res.json(updated)

        
    } catch (error) {
        next(error)
    }
}


export async function eliminarProducto(req: Request, res: Response, next: NextFunction) {
    try {
        // 1 - Ya lo validamos en validateParams, pero de todas formas, lo tipamos claro
        const id = req.params.id as unknown as number  

        // 2 - Intentamos eliminar el producto
        await prisma.product.delete({ where: { id }})

        // 3 - Si sale bien, respondemos 204 = No Content
        // Cómo ya no existe el registro en la BD, no hace falta devolver un JSON
        return res.status(204).send()


    } catch (error) {
        next(error)
    }
}