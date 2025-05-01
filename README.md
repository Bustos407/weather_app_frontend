# WeatherApp - Aplicación de Clima Inteligente

Aplicación web full-stack para consulta del clima con funcionalidades avanzadas de seguimiento meteorológico y gestión de ubicaciones favoritas.

## Características Principales
-  Búsqueda de condiciones climáticas en tiempo real
-  Historial automático de últimas 30 búsquedas
-  Sistema de favoritos con persistencia en backend
-  Autenticación JWT con protección de rutas
-  Visualización tabular de datos climáticos
-  Diseño responsive para todos los dispositivos
-  Manejo robusto de errores y estados de carga

## Detalles Tecnicos

1. **Gestión de Estado Local**
   - Historial almacenado en localStorage para persistencia
   - Estado local para manejo eficiente de UI
   - Optimización de re-renderizados con memoización

2. **Arquitectura de Datos**
   - Paginación de resultados en tablas grandes (20 items/página)
   - Normalización de datos climáticos para consistencia
   - Validación de inputs en tiempo real

   
3. **Seguridad**
   - Protección de rutas con componente ProtectedRoute
   - Almacenamiento seguro de tokens JWT
   - Validación de sesión en cada solicitud

   4. **Optimización**
   - Debouncing en búsquedas automáticas
   - Cacheo de respuestas API
   - Lazy loading de componentes pesados

## Manejo de Errores
| Tipo de Error              | Mecanismo de Manejo               |
|----------------------------|------------------------------------|
| Errores de API             | Notificaciones visuales + logs    |
| Ciudades no encontradas    | Mensajes descriptivos al usuario  |
| Sesión expirada            | Redirección automática a login    |
| Favoritos duplicados       | Validación en frontend/backend    |
| Datos corruptos            | Reset local storage + notificación|

## Pruebas Unitarias Implementadas en el Frontend

### Componente History
- ✅ Renderiza máximo 12 elementos
- ✅ Manejo correcto de lista vacía
- ✅ Formato correcto de ciudades/países
- ✅ Interacción con clicks

### Componente Favorites
- ✅ Carga y muestra lista de favoritos
- ✅ Eliminación de elementos con confirmación
- ✅ Estados de carga y error
- ✅ Protección de rutas no autenticadas

## Instalación y Despliegue

1. Clonar repositorio
```bash
git clone https://github.com/Bustos407/weather_app_frontend.git
cd weatherapp
#Installar dependencias
npm install

# API Principal
VITE_API_URL=

#Iniciar Proyectos
npm run dev

## Ejecutar Pruebas Unitarias
npm test
