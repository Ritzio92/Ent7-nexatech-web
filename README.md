# NexaTech — Tienda tecnológica demo

Mini tienda web creada como MVP para la **Sesión 7: Crea y Publica tu Primera App o Web con IA**.

**Objetivo:** permitir que cualquier persona explore un catálogo de productos tecnológicos y simule una compra con un carrito interactivo. Esta es una **demostración académica**: no existen pedidos, stock, cuentas de usuarios ni pagos reales.

## Funciones incluidas

- Catálogo ficticio de 12 productos con imágenes SVG propias y precios ilustrativos en soles (PEN).
- Filtros por categoría, buscador por nombre o descripción y ordenación por precio o nombre.
- Lista de favoritos.
- Detalle de productos, carrito con ajuste de cantidades y subtotal automático.
- Persistencia local opcional del carrito y favoritos en el navegador mediante `localStorage`.
- Botón **Simular compra**, que muestra una confirmación académica (sin pagos ni envío de datos).
- Diseño adaptable a celular, tableta y computadora.

## Estructura de archivos

```text
nexatech-web/
├── index.html         # Estructura y contenido HTML
├── styles.css         # Diseño visual y responsive
├── script.js          # Catálogo, filtros, favoritos, carrito y simulación
├── assets/            # Ilustraciones SVG locales y favicon
├── docs/
│   └── PROMPT_Y_ENTREGABLE.md
└── README.md
```

## Cómo abrir en tu equipo

1. Descarga y descomprime el ZIP.
2. Entra a la carpeta `nexatech-web`.
3. Abre `index.html` en Chrome, Edge u otro navegador.

Para servirla localmente opcionalmente, desde la carpeta ejecuta:

```bash
python -m http.server 8000
```

Luego visita http://localhost:8000.

## Cómo subir a GitHub (sin instalar Git)

1. Inicia sesión en https://github.com y elige **New repository**.
2. Asigna, por ejemplo, el nombre `nexatech-web`. Marca el repositorio como **Public** si necesitas compartirlo con tu docente.
3. Crea el repositorio y pulsa **uploading an existing file** o **Add file → Upload files**.
4. **Sube los archivos y carpetas que están dentro de `nexatech-web`, no el ZIP ni la carpeta contenedora**. Confirma con **Commit changes**.
5. Comprueba que `index.html` esté en la raíz del repositorio.

Si usas Git en la terminal (opcional):

```bash
git init
git add .
git commit -m "feat: crear MVP NexaTech"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/nexatech-web.git
git push -u origin main
```

## Cómo publicar en Vercel

1. En https://vercel.com crea una cuenta o inicia sesión con GitHub.
2. Selecciona **Add New → Project** e importa `nexatech-web`.
3. En **Framework Preset**, selecciona **Other**.
4. En **Root Directory**, deja `./` (la raíz); no se necesita instalar dependencias.
5. En la configuración de compilación, habilita **Override** para **Build Command** y déjalo **vacío**. No se requiere paso de build. La salida usa `.` (raíz), porque no existe una carpeta `public`.
6. Pulsa **Deploy**. Vercel te mostrará una URL `https://...vercel.app`.
7. Prueba los filtros, carrito, favoritos y la simulación en la URL pública.

Cada vez que actualices la rama de producción de GitHub, Vercel podrá redesplegar la web automáticamente.

## Prueba rápida sugerida

1. Buscar `mouse` y verificar que aparezca PulseMouse Pro.
2. Filtrar por Audio y verificar NovaSound ANC y StudioMic USB.
3. Agregar 2 unidades de un producto, abrir el carrito y comprobar el subtotal.
4. Recargar la página y verificar que el carrito persista en el mismo navegador.
5. Simular compra y confirmar que no solicita datos personales ni de pago.
6. Probar con el navegador en modo móvil.

## Seguridad, privacidad y alcance

- No hay claves, tokens, API, formularios de pago ni datos privados en el repositorio.
- Los precios, productos, calificaciones y descripciones son **ilustrativos, no ofertas reales**.
- `localStorage` es solo almacenamiento en el dispositivo; no hay base de datos compartida ni sincronización entre dispositivos.
- Esta versión es una tienda **de demostración**, no un e-commerce listo para ventas reales.
- Las ilustraciones SVG originales se incluyen como recursos locales; la tipografía usa Google Fonts si existe conexión y fuentes locales de respaldo en caso contrario.
