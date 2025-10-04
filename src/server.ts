import app from "./index";

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`)
})

// En desarrollo (local) el servidor utilizará 3000
/* 
    Por qué igual se pone process.env.PORT?
    Esta´pensado para cuando subas tu backend a producción. Ahí, la plataforma le pasa al servidor un puerto propio a través de una variable.
    ¿Qué pasa si no lo pudiéramos?
    Si no lo pusieras, y dejaras fijo el 3000, en la nube podría fallar porque la plataforma no usaría el puerto que espera.
*/