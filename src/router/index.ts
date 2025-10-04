import { Router } from "express"
import { crearProducto, listaProductos } from "../controllers/productController"
import { validateBody } from "../middleware/validate"
import { ProductCreateSchema } from "../validators/product.schema"

const router = Router()

// Rutas

router.get('/', listaProductos)

router.post('/', validateBody(ProductCreateSchema), crearProducto)

router.put('/', (req, res) => {    
    res.json("Desde PUT")
})

router.delete('/', (req, res) => {    
    res.json("Desde DELETE")
})

export default router 