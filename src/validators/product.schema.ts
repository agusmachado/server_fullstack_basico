import { minLength, minValue, number, object, optional, pipe, string } from "valibot";

// Esquema para Crear
export const ProductCreateSchema = object({
    name: pipe(
        string('name debe ser texto'),
        minLength(1, 'name es requerido')
    ),
    price: pipe(
        number('price debe ser un número'), 
        minValue(0.01, 'price debe ser > 0')
    )
})

// Esquema para editar - PATCH - Actualización Parcial
// Los dos campos (name y price) son opcionales
// Si llegan los campos, entonces se validan igual que create
// Si no llega ningún campo, el controlador nos devolverá 400
export const ProductPatchSchema = object({
    name: optional(
        pipe(
        string('name debe ser texto'),
        minLength(1, 'name es requerido')
        )
    ),
    price: optional(
        pipe(
        number('price debe ser un número'), 
        minValue(0.01, 'price debe ser > 0')
        )
    )
})


// Esquema para params - ( DELETE /api/products/:id)
export const PrductIdParamsSchema = object({
    id: pipe(
        number('El id debe ser un número'),
        minValue(1, 'El id debe ser mayor o igual a 1')
    )
})