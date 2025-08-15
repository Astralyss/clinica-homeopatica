# 🚨 CONFIGURACIÓN INMEDIATA DE STRIPE

## ⚠️ PROBLEMA ACTUAL
Tu aplicación está mostrando "Error al cargar el formulario de pago" porque las claves de Stripe no están configuradas.

## 🔑 PASOS INMEDIATOS

### 1. Obtener tus keys de Stripe
- Ve a [stripe.com](https://stripe.com) e inicia sesión
- En el Dashboard, ve a **Developers > API keys**
- Copia la **Publishable key** (pk_test_...)
- Copia la **Secret key** (sk_test_...)

### 2. Actualizar el archivo .env.local
Reemplaza el contenido de `.env.local` con tus keys reales:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123DEF456GHI789JKL
STRIPE_SECRET_KEY=sk_test_51ABC123DEF456GHI789JKL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Reiniciar el servidor
```bash
# Detén el servidor (Ctrl+C)
# Luego vuelve a ejecutar:
npm run dev
```

## 🧪 PROBAR CON TARJETAS DE PRUEBA

Una vez configurado, usa estas tarjetas de prueba:

- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **Declinada**: `4000 0000 0000 0002`

## 🔍 VERIFICAR QUE FUNCIONE

1. Ve a la página de checkout
2. Completa la dirección
3. En el paso de pago deberías ver el formulario de Stripe
4. Si ves un mensaje de error, revisa la consola del navegador

## 📝 NOTAS IMPORTANTES

- **NUNCA** subas las keys a GitHub
- Las keys de test empiezan con `pk_test_` y `sk_test_`
- Para producción usarás `pk_live_` y `sk_live_`

## 🆘 SI SIGUE EL ERROR

1. Abre la consola del navegador (F12)
2. Busca mensajes de error
3. Verifica que el archivo `.env.local` esté en la raíz del proyecto
4. Asegúrate de haber reiniciado el servidor después de cambiar las variables
