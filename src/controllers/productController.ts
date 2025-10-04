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