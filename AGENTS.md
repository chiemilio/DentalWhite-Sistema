# Instrucciones para OpenCode - SistemaGestionDental

## ⛔ REGLAS ABSOLUTAS - NUNCA VIOLAR

### DISEÑO - PROHIBIDO MODIFICAR
- NUNCA modificar archivos CSS o estilos
- NUNCA modificar archivos Tailwind (tailwind.config, postcss.config)
- NUNCA modificar componentes de UI en src/components
- NUNCA cambiar colores, tipografías, espaciados o layouts
- NUNCA modificar default_shadcn_theme.css
- NUNCA cambiar clases de Tailwind existentes en los componentes
- NUNCA modificar archivos en src/styles (si existen)
- NUNCA cambiar imports de estilos
- NUNCA tocar animaciones o transiciones existentes
- NUNCA modificar shadcn/ui components

### ARCHIVOS DE CONFIGURACIÓN - PROHIBIDO MODIFICAR
- NUNCA modificar vite.config.ts
- NUNCA modificar package.json sin autorización explícita
- NUNCA modificar pnpm-workspace.yaml
- NUNCA modificar turbo.json
- NUNCA modificar nginx.conf
- NUNCA modificar docker-compose.yml sin autorización explícita

## ✅ LO QUE SÍ PUEDES HACER
- Modificar lógica de negocio en el backend
- Modificar archivos en la carpeta backend/
- Agregar o modificar endpoints de FastAPI
- Modificar consultas a la base de datos
- Modificar lógica en archivos .ts/.tsx SOLO en la parte funcional, nunca en JSX/estilos
- Agregar nuevas funciones o hooks sin tocar el diseño

## 📋 ANTES DE CADA CAMBIO
1. Confirma qué archivos vas a modificar
2. Confirma que ninguno es de diseño o estilos
3. Si tienes duda, PREGUNTA antes de modificar
