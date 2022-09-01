# @vitely/vue

Vitely for vue 3

# Introduction

Vitely is a simple (yet powerful) framework built to enhance your vite experience and boost your productivity.
It has builtin support for:

-   Routes from Directory
-   Store (Pinia)
-   Plugins
-   Middlewares
-   Server Side Rendering
-   Coming soon:
    -   Layouts

## Getting Started

On your `vite.config`

```js
import vitelyVue from '@vitely/vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vitelyVue({
            /* Your config */
        }),
    ],
});
```

On your `index.ts`

```ts
import 'virtual:vitely/core/entry';
```

Create an `app.vue`

```vue
<template>
    <router-view />
</template>
```

# Features

## Routes

Every file in your `pages` directory is treated as a route.

```
pages
 ├── index.vue
 ├── about.vue
 ├── [[404]].vue
 ├── client
 │    ├── index.vue
 │    └── [client].vue
 └── products
      ├── index.vue
      └── [product]
           ├── index.vue
           └── create.vue
```

The following routes will be created

-   `/`
-   `/about`
-   `/client`
-   `/client/:client`
-   `/products`
-   `/products/:product`
-   `/products/:product/create`

And a 404 route for non existing navigation

### Nested routes

If there is a folder and a file with the same param name, the file will be considered a parent route for the folder.

```
some-dir
 ├── [param].vue
 └── [param]
      ├── edit.vue
      └── create.vue
```

## Plugins

A plugin is simply a file to be run before the app is setup.

Example of a element-plus plugin `plugins/element-plus.ts`

```ts
import { definePlugin } from '@vitely/vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

export default definePlugin(({ app }) => {
    app.use(ElementPlus);
});
```

And in your `vite.config`

```js
export default defineConfig({
    plugins: [
        vitelyVue2({
            // ...
            plugins: ['/plugins/element-plus.ts'],
        }),
    ],
});
```

## Middlewares

A middleware run befores every route

Example of a middleware `midlewares/auth.ts`

```ts
import { defineMiddleware } from '@vitely/vue2/runtime';

export default defineMiddleware(({ next, route }) => {
    if (route.path === '/forbidden') {
        next('/allowed');
        return;
    }
});
```

And in your `vite.config`

```js
export default defineConfig({
    plugins: [
        vitelyVue2({
            // ...
            middlewares: ['/midlewares/auth.ts'],
        }),
    ],
});
```

## Server Build

Vitely also supports a custom server build. (This is what allows standalone servers and SSR rendering)

```json
"scripts": {
    "build:client": "VITELY_TARGET=client vite build",
    "build:server": "VITELY_TARGET=server vite build",
    "build": "npm run build:client && npm run build:server"
}
```

**For Windows users**: You can use the cross-env package `cross-env VITELY_TARGET=client vite build`

### Standalone server (_Experimental_)

Using the `server: { standalone: true }`option, vitely will create a full server contained build powered by [fastify](https://www.fastify.io/)

Everything your bundle will need will be on the dist folder

To start the standalone script run `node dist/server/index.js dist/client`

### Server Side Rendering (_Experimental_)

With the `ssr: true ` option, vitely will render your apps on the server side. This mode **requires** you to setup the build scripts above.

# Configuration Reference

## `ssr?: boolean (default: false)`

Enables or disable SSR. See [Server Build](#server-build)

## `server.standalone?: boolean (default: false)`

Enables or disable the standalone server build. See [Server Build](#server-build)

## `pages?: string (default: "pages")`

Pages directory to scan for routes
