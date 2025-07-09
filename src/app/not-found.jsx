import Link from "next/link"

function NotFound() {
  return (
    <section className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
      

        {/* Número 404 */}
        <h1 className="text-8xl md:text-9xl font-bold text-green-600 mb-4">
          404
        </h1>

        {/* Título principal */}
        <h2 className="text-2xl md:text-3xl font-semibold text-green-700 mb-4 text-center">
          Página no encontrada
        </h2>

        {/* Mensaje descriptivo */}
        <p className="text-lg text-green-600 mb-8 text-center max-w-md">
          Lo sentimos, la página que buscas parece haberse extraviado en nuestro jardín de remedios naturales.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/" 
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
          >
            Volver al Inicio
          </Link>
          
         
        </div>

    

        
      </div>
    </section>
  )
}

export default NotFound