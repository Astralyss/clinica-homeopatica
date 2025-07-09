import { Facebook, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Columna 1: Logo, Slogan y Horarios */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              className="h-10 w-10"
              alt="logo consultorio homeopatico"
            />
            <h3 className="text-xl font-bold">Consultorio Homeopático</h3>
          </div>
          <p className="mt-2 italic text-sm text-gray-200">
            "Sanando con la sabiduría de la naturaleza"
          </p>
          
        </div>

        {/* Columna 2: Contacto */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              <a href="https://facebook.com/consultoriohomeopatico" className="hover:underline" target="_blank">
                Facebook
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a
                href="https://wa.me/5217717129797?text=Hola%2C%20quisiera%20más%20información%20sobre%20el%20consultorio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                771 712 9797
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:centrohomeopatico@yahoo.com" className="hover:underline">
                centrohomeopatico@yahoo.com
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Dirección y mapa */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Dirección</h4>

          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Dirección de texto */}
           

            <a
              href="https://www.google.com/maps/place/20%C2%B006'02.4%22N+98%C2%B045'03.6%22W/@20.1006572,-98.7535665,17z"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
               <p className="text-sm text-gray-100 max-w-[300px]">
              Plaza de las Américas local 15 módulo A,<br />
              colonia Valle de San Javier, Pachuca, Hidalgo
            </p>
            </a>

    
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-100">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-1" />
              <span>Lunes a viernes: 11 am - 7 pm</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-1" />
              <span>Domingo con cita: 7 am - 8 am</span>
            </li>
          </ul>
        </div>
      

      </div>

      {/* Footer inferior */}
      <div className="border-t border-white/20 mt-10 pt-4 text-center text-sm text-gray-300">
        © 2025 Consultorio Homeopático. Todos los derechos reservados.
      </div>
    </footer>
  );
}
