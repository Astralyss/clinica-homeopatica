# Estructura de Componentes

Esta carpeta contiene todos los componentes de la aplicación organizados por categorías funcionales para facilitar el mantenimiento y la escalabilidad.

## 📁 Estructura de Carpetas

### 🛒 **ecommerce/**
Componentes relacionados con la funcionalidad de comercio electrónico:
- `ProductCard.jsx` - Tarjeta individual de producto
- `ProductCardList.jsx` - Lista de tarjetas de productos
- `ProductPanel.jsx` - Panel lateral para detalle/edición de productos
- `TarjetaProducto.jsx` - Componente de tarjeta de producto (legacy)

### 👨‍💼 **admin/**
Componentes específicos del panel de administración:
- `SidebarMinimal.jsx` - Sidebar minimalista para admin
- `AdminSidebar.jsx` - Sidebar completo de administración (legacy)

### 🏠 **landing/**
Componentes de la página principal y secciones del sitio:
- `HeroSection.jsx` - Sección hero principal
- `Navbar.jsx` - Barra de navegación
- `Footer.jsx` - Pie de página
- `CardsPadecimientos.jsx` - Tarjetas de padecimientos
- `PharmaSecction.jsx` - Sección farmacéutica
- `AboutUs.jsx` - Sección sobre nosotros
- `History.jsx` - Sección de historia

### 📝 **forms/**
Componentes de formularios y entrada de datos:
- `ConsultForm.jsx` - Formulario de consulta
- `ImageUploadSection.jsx` - Sección de subida de imágenes
- `MultipleImageUpload.jsx` - Subida múltiple de imágenes
- `ImageCropper.jsx` - Recorte de imágenes

### 🔐 **auth/**
Componentes de autenticación (futuro):
- Componentes de login, registro, etc.

### 🎨 **ui/**
Componentes de interfaz de usuario reutilizables (futuro):
- Botones, modales, tooltips, etc.

## 📋 Convenciones

### Nomenclatura
- **PascalCase** para nombres de componentes: `ProductCard.jsx`
- **camelCase** para archivos de utilidades: `imageUtils.js`

### Importaciones
- Usar rutas absolutas con `@/components/` para importaciones
- Ejemplo: `import ProductCard from '@/components/ecommerce/ProductCard'`

### Organización
- Cada componente debe estar en la carpeta que mejor represente su función
- Si un componente se usa en múltiples categorías, colocarlo en la más específica
- Mantener componentes relacionados juntos

## 🚀 Uso

### Importar componentes:
```jsx
// Componentes de e-commerce
import ProductCard from '@/components/ecommerce/ProductCard';
import ProductPanel from '@/components/ecommerce/ProductPanel';

// Componentes de admin
import SidebarMinimal from '@/components/admin/SidebarMinimal';

// Componentes de landing
import HeroSection from '@/components/landing/HeroSection';
import Navbar from '@/components/landing/Navbar';

// Componentes de formularios
import ConsultForm from '@/components/forms/ConsultForm';
import ImageUploadSection from '@/components/forms/ImageUploadSection';
```

## 🔄 Mantenimiento

### Agregar nuevos componentes:
1. Identificar la categoría apropiada
2. Crear el archivo en la carpeta correspondiente
3. Actualizar este README si es necesario
4. Usar las convenciones de nomenclatura establecidas

### Mover componentes existentes:
1. Actualizar todas las importaciones
2. Verificar que no haya referencias rotas
3. Actualizar documentación

## 📈 Beneficios

- **Mantenibilidad**: Fácil encontrar y modificar componentes
- **Escalabilidad**: Estructura preparada para crecimiento
- **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos
- **Reutilización**: Componentes organizados por función
- **Claridad**: Estructura intuitiva y fácil de entender 