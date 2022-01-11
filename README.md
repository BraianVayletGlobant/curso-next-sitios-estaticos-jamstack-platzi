# [Curso de Next.js: Sitios Estáticos y Jamstack](https://platzi.com/clases/nextjs-jamstack/)

### CMS usado en el proyecto: [Contentfull](https://app.contentful.com/)

---

## Metodos de rendering

### Apuntes

- Existen 3 formas de realizar un proceso de rendering:
  1. Client-side
     - Sucede bajo demanda en el navegador
     - El navegador cada vez que visite nuestro sitio, el trabajo lo realizara el navegador de tus usuarios
     - Ej.: Cada que agregas JS usando la etiqueta src, debido a que estamos diciendo al navegador que ejecute nuestra etiqueta, descargue y que procese el JS para convertirlo en HTML
     - Ej.: create-react-app ⇒ Es un boilerplate para crear aplicaciones React, sin agregar cambios y servidores, lo que terminaremos enviando a los usuarios, será una aplicación client-side
  2. Server-side
     - Significa que tenemos un servidor que se encarga ya sea de forma total o parcial de hacer el rendering de JS y transformarlo a HTML
     - El navegador recibe por parte del servidor HTML ya listo para mostrarse
     - Sucede bajo demanda en el servidor
     - La gran mayoría de lenguajes y frameworks backend
     - Symfony (PHP), WordPress clásico (PHP), Flash (Python), Django (Python), etc.
  3. Static rendering
     - Trata del que el HTML se construya en el proceso de compilación
     - Transformará el código JS a HTML una sola vez en "build time"
     - Jekill, Wintersmith, Gatsby, Hugo, Next.js

> Rendering procesar pedazos de código (JS) y datos para mostrar su resultado (HTML)

💡 Next.js te permite crear aplicaciones híbridas

- Next.js te permitirá escoger entre uno o más rendering modes para las diferentes páginas de tu aplicación

```cmd
📌 **RESUMEN:** Existen 3 formas de poder hacer un proceso de rendering, client side la cual el navegador
del cliente se encargará de transformar el JS a HTML, server side que significa que un servidor se encargara
de la transformación baja demando o Static rendering, en la cual el proceso de renderizado se realiza una 
única vez al momento de compilar la aplicación
```

---

## Trade-offs de SSG

### Apuntes

- Al final, solo son archivos estáticos (HTML, CSS y JS): el deployment es el más fácil y puede hacer en cualquier servidor
  - Sin contar que no necesita muchos recursos,
  - No necesita mucho trabajo por parte del servidor
  - Podemos almacenar en un CDN para que sea superveloz
- El SEO y performance de carga serán de los mejores
- No todos los sitios se pueden generar de forma estática. Debido a que los datos debes obtenerlos en tiempo real y no estarán incrustados directamente en el HTML Ej.:
  - Páginas de usuario
  - Información personalizada
  - Dashboard
- El build time mientras más páginas se tenga más lento será el proceso

---

## Incremental Static Generation

### Apuntes

[DOC Vercel](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration)

[POST](https://www.smashingmagazine.com/2021/04/incremental-static-regeneration-nextjs/)

- Incremental Static Site Generation te ermite poder crear nuevas páginas bajo demanda sin tener que volver a compilar la aplicacion otra vez
- Puedes generar un conjunto de páginas iniciales, y dejar otras por generar bajo demanda del usuario

![img](https://vercel.com/_next/image?url=%2Fdocs-proxy%2Fstatic%2Fdocs%2Fconcepts%2Fnext.js%2Fisr%2Fgeneration.png&w=1080&q=75)

- Lo que nos permite tener:
  - Compilaciones mucho más rápidas ⇒ Debido a que no tendrás que compilar todas las páginas al momento de correr el comando de compilación
  - Poder refrescar la información cada cierto tiempo

### Estrategias de generación

Debido a que Next.js te permite compilar previamente un conjunto de páginas que tú como desarrolladora puedes definir. Existen diferentes formas de usar esta característica del framework, las cuales puedes configurar al momento de devolver el objeto de configuración en `getStaticPaths`

- `fallback: blocking` Cuando se requiera una página que no se generó anteriormente ya sea en build time o bajo demanda, lo que hará Next.js será **inmediatamente generar la página** y mandarla al usuario
- `fallback: true` Cuando se requiera una página que no se generó anteriormente ya sea en build time o bajo demanda, lo que hará Next.js será **inmediatamente mandar una página estática de carga al usuario** y mandarla al usuario. Posteriormente, cuando esté lista la página se volverá a renderizar con la página generada

### Enfoque stale-while-revalidate

Consiste en el siguiente procedimiento

1. Generación de páginas (build)
2. Respuesta desde el caché

En caso de nuevo contenido:

1. Nueva página (background)
2. Respuesta de página vieja
3. Respuesta con la nueva página

Este enfoque se conoce por:

- Stale ⇒ Respondiendo con las páginas que están en caché
- while - revalidate ⇒ Next.js estará mirando que tiene que cambiar, actualizar y responderá con páginas vencidas o cache
- Cabe aclarar que las actualizaciones sucederán en segundo plano, lo importante es la información que tan actualizada este para el usuario

```cmd
📌 **RESUMEN:** Con ISSG puedes generar páginas bajo demanda, las cuales pueden estar generadas mediante dos
estrategias de forma bloqueante y de la forma en que el usuario esta consiente del estado de carga. También
puedes configurar una página de tal manera que cada cierto tiempo se actualice, esta técnica usa el enfoque 
state-while-revalidate, en la cual Next.js estará mirando que tiene que cambiar, actualizar y respondiendo 
con páginas guardadas en caché.
```

## Trade-off ISSG

### Apuntes

- La flexibilidad de server-side rendering con las bondades de static generation
- Requiere un servidor con Node.js
  - No siempre es posible contar con un servidor Node.js ya que pueden ocurrir casos en que tengas un proyecto legacy con servidor PHP u otro.
  - Si no lo tenemos, nuestra complejidad aumentara bastante al punto de no ser viable usar esta estrategia
- El build-time no aumenta con el número de páginas
- La revalidación brinda mucha más flexibilidad
  - Con un número podemos especificar a Next.js lo cual sera el tiempo de actualización de la información
- Así mismo puede ser peligroso, ej.: no poder ajustar los tiempos de revalidación ante un enlace que se vuelve viral.
- No es pato para todas las páginas. Ej.: páginas de usuario o información personalizada, dashboard en tiempo real.
- No es un problema en sitios con pocas páginas
  - Podemos utilizar este enfoque cuando tenemos miles de páginas

---

## Otras alternativas de build

### Apuntes

### **Server-Side Rendering**

- La información siempre estará actualizada
- Poder modificar la respuesta con base en la petición puede ser muy conveniente
- Golpear el servidor por cada petición puede ser costoso
  - Consume recursos = dinero

### **Exportar HTML**

- Se producen archivos estáticos y el servidor de Node.js es desacoplado

### **Trade-offs: Exportar**

- No hay backend, por tanto no hay servidores por mantener
- Se puede subir a servidores de archivos estáticos, como GitHub Pages
- Muchas funcionalidades se deshabilitarán:
  - Server-side rendering (getServerSideProps)
  - Incremental SIte Generation
  - Revalidación
  - Rutas API
  - Internacionalización
  - next/image\*

---

---

# Readme NextJs

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, create a `.env.local` file with your Contentful secrets:

```bash
cp .env.local.example .env.local
```

Create a new API Key in Contentful: "Your Space > Settings > API Keys", then replace `SPACE_ID` and `ACCESS_TOKEN` with your values.

Second, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## GraphQL type generation

```bash
SPACE_ID={SPACE_ID} ACCESS_TOKEN={ACCESS_TOKEN} yarn dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
