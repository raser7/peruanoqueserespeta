# Panel de canales con Cloudinary

## Configuración local

El archivo `.env` ya está creado y excluido de Git. Completa:

```dotenv
CLOUDINARY_CLOUD_NAME=nombre_de_tu_cloud
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
ADMIN_PASSWORD=una_contrasena_larga_de_al_menos_8_caracteres
ADMIN_SESSION_SECRET=una_clave_aleatoria_de_al_menos_32_caracteres
```

La clave de sesiones del `.env` inicial ya se generó. No hace falta cambiarla.
Los tres datos de Cloudinary se encuentran en la configuración de API Keys de tu cuenta Image & Video APIs. No basta con una sola clave.

1. Ejecuta `npm run dev` y abre `/admin` en la dirección local que indique la terminal.
2. Entra con ADMIN_PASSWORD.
3. Pulsa **Importar las 5 tarjetas originales** para migrar las imágenes y enlaces actuales. Se omiten los identificadores originales ya importados, por lo que una importación interrumpida se puede reintentar.
4. Crea tarjetas o edita las existentes. La imagen admite JPG, PNG o WebP de hasta 3 MB. Para cambiar solo el enlace no necesitas volver a subir la imagen.
Los colores se asignan automáticamente según la posición entre las tarjetas visibles, alternando rosado, amarillo, crema, verde y celeste. Al reordenar, ocultar o eliminar tarjetas, la paleta se ajusta sin repetir colores consecutivos.

5. El orden más bajo aparece primero; puedes ocultar una tarjeta sin eliminarla. Eliminar también borra su imagen de Cloudinary y pide confirmación.

Sin configurar Cloudinary, la home muestra las cinco tarjetas locales. Al configurarlo, Cloudinary pasa a ser la fuente de contenido: importa las tarjetas antes de entregar la web al cliente. Si no hay tarjetas o se eliminan todas, se muestra el estado vacío; las tarjetas locales no reaparecen. Si Cloudinary falla, la página devuelve 503 y un mensaje de disponibilidad temporal.

## Vercel

En **Project → Settings → Environment Variables**, usa **Import .env** y selecciona el archivo local `.env` con los cinco valores completos. Aplícalos a **Production** y **Preview**, guarda y despliega de nuevo (o fusiona la PR después de guardarlos). También puedes introducir esos cinco valores manualmente. El archivo `.env` local no se sube y no configura Vercel automáticamente. No uses el prefijo PUBLIC_ en ninguna clave.

El adaptador oficial de Vercel ejecuta el panel y la home en el servidor; sitemap y robots siguen siendo estáticos. El contenido público tiene una caché de 60 segundos y puede permanecer hasta unos minutos mientras se actualiza. Los cambios no necesitan commits ni despliegues nuevos.

Se almacenan únicamente imágenes con identificadores dentro de `pqsr/channels/`. Cada imagen lleva enlace, orden, color, texto alternativo automático y estado visible en sus metadatos contextuales. No se utiliza una base de datos adicional. No renombres esa carpeta ni borres sus metadatos desde Cloudinary.

Las sesiones duran ocho horas, usan cookies HttpOnly y SameSite Strict, y son Secure en HTTPS. La API comprueba sesión y origen en las operaciones de escritura. La contraseña admite desde 8 caracteres y debe ser exclusiva. Existe un límite de intentos por proceso, pero no un bloqueo distribuido entre todas las funciones de Vercel. Cambiar la contraseña o la clave de sesiones invalida las sesiones anteriores.

La página se adapta al número de canales; en pantallas pequeñas un número elevado de tarjetas puede necesitar más espacio. El diseño de cinco tarjetas conserva una sola pantalla.

Cloudinary Free tiene cuotas de API, tráfico y almacenamiento; revisa Usage en su panel. La caché evita consultar su API por cada visita. No se garantiza uso ilimitado ni se cambia el plan de hosting actual.
