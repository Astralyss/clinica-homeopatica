# Sistema de Loaders - Clínica Homeopática

Este sistema proporciona una solución completa para mostrar indicadores de carga en toda la aplicación, utilizando el logo de la clínica con un círculo giratorio.

## Componentes Disponibles

### 1. Loader Básico
```jsx
import Loader from '@/components/ui/Loader';

// Uso básico
<Loader />

// Con texto personalizado
<Loader text="Cargando productos..." />

// Diferentes tamaños
<Loader size="small" />
<Loader size="default" />
<Loader size="large" />
<Loader size="xl" />

// Sin texto
<Loader showText={false} />
```

### 2. Loader de Pantalla Completa
```jsx
import { FullScreenLoader } from '@/components/ui/Loader';

// Se muestra sobre toda la pantalla
<FullScreenLoader text="Cargando aplicación..." />
```

### 3. Loader de Página
```jsx
import { PageLoader } from '@/components/ui/Loader';

// Ocupa toda la altura de la pantalla
<PageLoader text="Cargando página..." />
```

### 4. Loader de Sección
```jsx
import { SectionLoader } from '@/components/ui/Loader';

// Para secciones específicas
<SectionLoader text="Cargando productos..." />
```

### 5. Loader de Botón
```jsx
import { ButtonLoader } from '@/components/ui/Loader';

// Para botones
<button disabled={isLoading}>
  {isLoading ? <ButtonLoader /> : 'Enviar'}
</button>
```

## Hooks Disponibles

### 1. useLoader (Hook Local)
```jsx
import { useLoader } from '@/utils/hooks/useLoader';

const { isLoading, loadingText, startLoading, stopLoading, withLoader } = useLoader();

// Uso básico
const handleSubmit = async () => {
  startLoading('Enviando formulario...');
  try {
    await submitForm();
  } finally {
    stopLoading();
  }
};

// Uso con withLoader (recomendado)
const handleSubmit = async () => {
  await withLoader(
    () => submitForm(),
    'Enviando formulario...'
  );
};
```

### 2. useMultiLoader (Múltiples Estados)
```jsx
import { useMultiLoader } from '@/utils/hooks/useLoader';

const { 
  isLoading, 
  getLoadingText, 
  startLoading, 
  stopLoading, 
  withLoader 
} = useMultiLoader();

// Para diferentes operaciones
const loadProducts = async () => {
  await withLoader('products', () => fetchProducts(), 'Cargando productos...');
};

const loadCategories = async () => {
  await withLoader('categories', () => fetchCategories(), 'Cargando categorías...');
};

// Verificar estado
if (isLoading('products')) {
  return <SectionLoader text={getLoadingText('products')} />;
}
```

### 3. useGlobalLoader (Loader Global)
```jsx
import { useGlobalLoader } from '@/utils/context/LoaderContext';

const { startLoading, withLoader } = useGlobalLoader();

// Se muestra sobre toda la aplicación
const handleGlobalOperation = async () => {
  await withLoader(
    () => performGlobalOperation(),
    'Procesando operación global...'
  );
};
```

## Casos de Uso Comunes

### 1. Carga de Página
```jsx
'use client';

import { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/Loader';

export default function ProductosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const data = await fetch('/api/productos');
        const productos = await data.json();
        setProductos(productos);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductos();
  }, []);

  if (isLoading) {
    return <PageLoader text="Cargando productos..." />;
  }

  return (
    <div>
      {/* Contenido de la página */}
    </div>
  );
}
```

### 2. Formulario con Loader
```jsx
'use client';

import { useLoader } from '@/utils/hooks/useLoader';
import { ButtonLoader } from '@/components/ui/Loader';

export default function ContactForm() {
  const { isLoading, withLoader } = useLoader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await withLoader(
      async () => {
        const formData = new FormData(e.target);
        await fetch('/api/contacto', {
          method: 'POST',
          body: formData
        });
      },
      'Enviando mensaje...'
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        {isLoading ? <ButtonLoader /> : 'Enviar Mensaje'}
      </button>
    </form>
  );
}
```

### 3. Lista con Loader de Sección
```jsx
'use client';

import { useMultiLoader } from '@/utils/hooks/useLoader';
import { SectionLoader } from '@/components/ui/Loader';

export default function ProductosList() {
  const { isLoading, withLoader } = useMultiLoader();

  const loadProductos = async () => {
    await withLoader('productos', () => fetchProductos(), 'Cargando productos...');
  };

  const loadCategorias = async () => {
    await withLoader('categorias', () => fetchCategorias(), 'Cargando categorías...');
  };

  if (isLoading('productos')) {
    return <SectionLoader text={getLoadingText('productos')} />;
  }

  return (
    <div>
      {/* Lista de productos */}
    </div>
  );
}
```

### 4. Operación Global
```jsx
'use client';

import { useGlobalLoader } from '@/utils/context/LoaderContext';

export default function AdminPanel() {
  const { withLoader } = useGlobalLoader();

  const handleBulkOperation = async () => {
    await withLoader(
      async () => {
        // Operación que afecta toda la aplicación
        await performBulkUpdate();
        await refreshAllData();
      },
      'Actualizando sistema...'
    );
  };

  return (
    <button onClick={handleBulkOperation}>
      Ejecutar Actualización Masiva
    </button>
  );
}
```

## Personalización

### Cambiar Colores
```jsx
// En el componente Loader.jsx, modifica la clase del círculo
<div 
  className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
  // Cambia border-t-blue-500 por el color que prefieras
  // Ejemplos: border-t-green-500, border-t-purple-500, border-t-red-500
/>
```

### Cambiar Animaciones
```jsx
// Modifica las clases de animación en Tailwind
// animate-spin: rotación
// animate-pulse: parpadeo
// animate-bounce: rebote
```

### Cambiar Tamaños
```jsx
// Agrega nuevos tamaños en el objeto sizeClasses
const sizeClasses = {
  tiny: 'w-4 h-4',
  small: 'w-8 h-8',
  default: 'w-16 h-16',
  large: 'w-24 h-24',
  xl: 'w-32 h-32',
  '2xl': 'w-48 h-48'
};
```

## Mejores Prácticas

1. **Usa `withLoader`** en lugar de `startLoading`/`stopLoading` manual
2. **Mantén textos descriptivos** para mejorar la experiencia del usuario
3. **Usa loaders apropiados** para cada contexto (botón, sección, página, global)
4. **Evita múltiples loaders** simultáneos en la misma área
5. **Considera el tiempo de carga** - no muestres loaders para operaciones muy rápidas

## Integración con APIs

```jsx
// Ejemplo de integración con fetch
const { withLoader } = useLoader();

const fetchData = async () => {
  await withLoader(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }
      return response.json();
    },
    'Cargando datos...'
  );
};
```

Este sistema proporciona una experiencia de usuario consistente y profesional en toda la aplicación de la Clínica Homeopática.
