
import { message, safeParse, type BaseSchema } from "valibot";
import { Request, Response, NextFunction } from "express";

/* 
    validateBody(schema)
    - Recibimos un schema de valibot (las reglas) y devuelve un middleware de Express
    - Este middleware se puede "conectar" en cualquier ruta POST/PUT/DELETE
*/

export function validateBody<TSchema extends BaseSchema<any, any, any>>(schema: TSchema) {
    // TSchema es algún schema Valibot. No nos importa cuál, porque TSchema es genérico

    return(req: Request, res: Response, next: NextFunction) => {
        //1 - Validamos y convertimos(coerce) el req.body con el schema recibido
        const parsed = safeParse(schema, req.body)

        //2 - Qué pasa si la validación falla
        if (!parsed.success) {
            const errors = parsed.issues.map(i => ({
                // path: ruta al campo con error. Nos dice dónde fallo (por ejemplo "price")
                path: i.path?.map(p => ('key' in p ? p.key : p.index)).join('.') || 'body',
                // message: el texto descriptivo que puse en el schema (por ejemplo "price debe ser > 0")
                message: i.message
            }))

            return res.status(400).json({ errors })
        }

        // 3 - Validación pasa
        req.body = parsed.output as any

        next()
    } 
}