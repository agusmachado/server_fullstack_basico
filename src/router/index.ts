import { Router } from "express"
import { crearProducto, editarProducto, eliminarProducto, listaProductos } from "../controllers/productController"
import { validateBody } from "../middleware/validate"
import { PrductIdParamsSchema, ProductCreateSchema, ProductPatchSchema } from "../validators/product.schema"
import { validateParams } from "../middleware/validateParams"

const router = Router()

// Rutas

router.get('/', listaProductos)

router.post('/', validateBody(ProductCreateSchema), crearProducto)

router.patch("/:id", validateBody(ProductPatchSchema), editarProducto)

router.delete('/:id', validateParams(PrductIdParamsSchema), eliminarProducto)

export default router 