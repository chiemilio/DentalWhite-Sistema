# Guía de Diseño Responsive - Dental White

## 📱 Principios de Diseño Responsive

Esta guía establece los estándares para crear componentes responsive en el sistema Dental White utilizando Tailwind CSS v4.

---

## 🎯 Breakpoints de Tailwind CSS

```css
/* Tailwind CSS v4 Breakpoints */
sm:  640px   /* Teléfonos grandes / tablets pequeñas */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Pantallas grandes */
```

---

## 📐 Estructura Base Responsive

### Layout Principal
```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Contenido del header */}
    </div>
  </header>

  {/* Contenido Principal */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Tu contenido aquí */}
  </main>

  {/* Footer */}
  <footer className="bg-gray-800 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Contenido del footer */}
    </div>
  </footer>
</div>
```

### Padding Responsive
```tsx
{/* Aumenta el padding en pantallas más grandes */}
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  Contenido con padding responsive
</div>
```

---

## 🗂️ Grids Responsive

### Grid de Tarjetas
```tsx
{/* 1 columna en móvil, 2 en tablet, 3 en desktop, 4 en pantallas grandes */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow p-4">
      {/* Contenido de la tarjeta */}
    </div>
  ))}
</div>
```

### Grid de Formulario
```tsx
<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* En móvil: 1 columna, en tablet+: 2 columnas */}
  <div>
    <label>Nombre</label>
    <input type="text" className="w-full" />
  </div>
  <div>
    <label>Apellido</label>
    <input type="text" className="w-full" />
  </div>
  <div className="md:col-span-2">
    {/* Este campo ocupa las 2 columnas en tablet+ */}
    <label>Dirección</label>
    <input type="text" className="w-full" />
  </div>
</form>
```

---

## 📊 Tablas Responsive

### Opción 1: Scroll Horizontal (Recomendado para tablas complejas)
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left">Nombre</th>
        <th className="px-6 py-3 text-left">Email</th>
        <th className="px-6 py-3 text-left">Teléfono</th>
        <th className="px-6 py-3 text-left">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {/* Filas */}
    </tbody>
  </table>
</div>
```

### Opción 2: Tarjetas en Móvil, Tabla en Desktop
```tsx
{/* Vista móvil: tarjetas */}
<div className="md:hidden space-y-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{item.nombre}</h3>
        <span className="text-sm text-gray-500">{item.fecha}</span>
      </div>
      <p className="text-sm text-gray-600">{item.email}</p>
      <p className="text-sm text-gray-600">{item.telefono}</p>
      <div className="mt-4 flex gap-2">
        <button className="btn-primary">Ver</button>
        <button className="btn-secondary">Editar</button>
      </div>
    </div>
  ))}
</div>

{/* Vista desktop: tabla */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full">
    {/* Tabla normal */}
  </table>
</div>
```

---

## 🔘 Botones Responsive

### Botones Apilados en Móvil
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded">
    Guardar
  </button>
  <button className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded">
    Cancelar
  </button>
</div>
```

### Tamaños de Botones Responsive
```tsx
<button className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded text-sm sm:text-base">
  Agendar Cita
</button>
```

---

## 📝 Formularios Responsive

### Ejemplo Completo
```tsx
<form className="space-y-6">
  {/* Sección 1: Datos Personales */}
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">Datos Personales</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre Completo</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">CURP</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input 
          type="email" 
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input 
          type="tel" 
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" 
        />
      </div>
    </div>
  </div>

  {/* Botones */}
  <div className="flex flex-col sm:flex-row gap-3 justify-end">
    <button type="button" className="w-full sm:w-auto px-6 py-2 border rounded">
      Cancelar
    </button>
    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded">
      Guardar
    </button>
  </div>
</form>
```

---

## 🎴 Tarjetas Responsive

### Tarjeta de Cita
```tsx
<div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
  {/* Header de la tarjeta */}
  <div className="p-4 sm:p-6 border-b">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h3 className="text-lg font-semibold">Juan Pérez</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 w-fit">
        Confirmada
      </span>
    </div>
  </div>

  {/* Cuerpo de la tarjeta */}
  <div className="p-4 sm:p-6 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <p className="text-sm text-gray-500">Fecha</p>
        <p className="font-medium">15 de Abril, 2026</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Hora</p>
        <p className="font-medium">10:00 AM</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Servicio</p>
        <p className="font-medium">Limpieza Dental</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Doctor</p>
        <p className="font-medium">Dr. Faustino Vázquez</p>
      </div>
    </div>
  </div>

  {/* Footer con acciones */}
  <div className="p-4 sm:p-6 bg-gray-50 rounded-b-lg">
    <div className="flex flex-col sm:flex-row gap-2">
      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
        Ver Detalles
      </button>
      <button className="flex-1 px-4 py-2 border rounded">
        Cancelar
      </button>
    </div>
  </div>
</div>
```

---

## 📅 Calendario Responsive

```tsx
<div className="bg-white rounded-lg shadow">
  {/* Header del calendario */}
  <div className="p-4 sm:p-6 border-b">
    <div className="flex items-center justify-between">
      <button className="p-2 hover:bg-gray-100 rounded">
        ← Anterior
      </button>
      <h2 className="text-lg sm:text-xl font-semibold">Abril 2026</h2>
      <button className="p-2 hover:bg-gray-100 rounded">
        Siguiente →
      </button>
    </div>
  </div>

  {/* Grid del calendario */}
  <div className="p-4">
    {/* Días de la semana */}
    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
        <div key={dia} className="text-center text-xs sm:text-sm font-medium text-gray-600">
          {dia}
        </div>
      ))}
    </div>

    {/* Días del mes */}
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {/* Renderizar días */}
      {dias.map(dia => (
        <button
          key={dia}
          className="aspect-square p-1 sm:p-2 text-xs sm:text-sm rounded hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
        >
          {dia}
        </button>
      ))}
    </div>
  </div>
</div>
```

---

## 🍔 Navegación Responsive

### Navbar con Menú Hamburguesa
```tsx
import { useState } from 'react';

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Dental White" className="h-8 sm:h-10" />
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="px-3 py-2 rounded hover:bg-gray-100">Inicio</a>
            <a href="/servicios" className="px-3 py-2 rounded hover:bg-gray-100">Servicios</a>
            <a href="/citas" className="px-3 py-2 rounded hover:bg-gray-100">Citas</a>
            <a href="/contacto" className="px-3 py-2 rounded hover:bg-gray-100">Contacto</a>
          </div>

          {/* Botón Hamburguesa (Móvil) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 rounded hover:bg-gray-100">Inicio</a>
            <a href="/servicios" className="block px-3 py-2 rounded hover:bg-gray-100">Servicios</a>
            <a href="/citas" className="block px-3 py-2 rounded hover:bg-gray-100">Citas</a>
            <a href="/contacto" className="block px-3 py-2 rounded hover:bg-gray-100">Contacto</a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

---

## 🎨 Tipografía Responsive

```tsx
{/* Títulos */}
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Título Principal
</h1>

<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
  Subtítulo
</h2>

<h3 className="text-lg sm:text-xl md:text-2xl font-medium">
  Sección
</h3>

{/* Texto */}
<p className="text-sm sm:text-base md:text-lg">
  Párrafo de texto que se ajusta al tamaño de pantalla
</p>
```

---

## 📏 Espaciado Responsive

```tsx
{/* Márgenes */}
<div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12">
  Contenido con margen superior responsive
</div>

{/* Padding */}
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  Contenido con padding responsive
</div>

{/* Gap en Flex/Grid */}
<div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8">
  {/* Elementos */}
</div>
```

---

## 🖼️ Imágenes Responsive

```tsx
{/* Imagen que se ajusta al contenedor */}
<img 
  src="/imagen.jpg" 
  alt="Descripción" 
  className="w-full h-auto rounded-lg object-cover"
/>

{/* Imagen con altura fija responsive */}
<img 
  src="/imagen.jpg" 
  alt="Descripción" 
  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
/>

{/* Imagen circular para avatares */}
<img 
  src="/avatar.jpg" 
  alt="Usuario" 
  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover"
/>
```

---

## ✅ Checklist de Responsive

Al crear un nuevo componente, verifica:

- [ ] **Móvil First**: Diseña primero para móvil, luego escala
- [ ] **Breakpoints**: Usa `sm:`, `md:`, `lg:`, `xl:` apropiadamente
- [ ] **Touch Targets**: Botones de al menos 44x44px
- [ ] **Texto Legible**: Tamaño mínimo 16px en móvil
- [ ] **Imágenes Optimizadas**: Usa tamaños apropiados para cada dispositivo
- [ ] **Scroll Horizontal**: Evítalo excepto en tablas complejas
- [ ] **Menú Hamburguesa**: Para navegación en móvil
- [ ] **Grids Flexibles**: Ajusta columnas según pantalla
- [ ] **Espaciado Consistente**: Usa escala de Tailwind
- [ ] **Prueba en Dispositivos**: Verifica en móvil, tablet y desktop

---

## 🔧 Utilidades Comunes

```tsx
{/* Ocultar en móvil, mostrar en desktop */}
<div className="hidden md:block">Solo desktop</div>

{/* Mostrar en móvil, ocultar en desktop */}
<div className="block md:hidden">Solo móvil</div>

{/* Cambiar orden en diferentes pantallas */}
<div className="flex flex-col md:flex-row">
  <div className="order-2 md:order-1">Primero en desktop</div>
  <div className="order-1 md:order-2">Segundo en desktop</div>
</div>

{/* Ancho máximo centrado */}
<div className="w-full max-w-7xl mx-auto px-4">
  Contenido centrado con padding
</div>

{/* Container responsive */}
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  Contenido en container
</div>
```

---

## 📱 Testing Responsive

### Herramientas
1. **Chrome DevTools**: F12 → Toggle Device Toolbar
2. **Responsive Design Mode**: Simula diferentes dispositivos
3. **Real Device Testing**: Prueba en dispositivos reales

### Dispositivos a Probar
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1920px)

---

## 🚀 Mejores Prácticas

1. **Mobile First**: Escribe estilos base para móvil, luego agrega breakpoints
2. **Consistencia**: Usa la escala de spacing de Tailwind (4px, 8px, 12px, 16px...)
3. **Performance**: Carga imágenes responsive con `srcset`
4. **Accesibilidad**: Mantén contraste y tamaños de fuente legibles
5. **Touch-Friendly**: Botones y enlaces de mínimo 44x44px
6. **Evita Overflow**: No uses widths fijos que causen scroll horizontal
7. **Flexbox/Grid**: Prefiere layouts flexibles sobre posicionamiento absoluto

---

**Última actualización:** Abril 2026
**Versión Tailwind:** v4.0
