# @vitely/vue2

Vitely for vue 2.7

# Introduction

Vitely is a simple (yet powerful) framework built to enhance your vite experience and boost your productivity.
It has builtin support for:

-   Routes from Directory
-   Store (Vuex, Pinia)
-   Plugins
-   Layouts
-   Middlewares
-   Server Side Rendering

## Getting Started

On your `vite.config`

```js
import vitelyVue2 from '@vitely/vue2';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vitelyVue2({
            /* Your config */
        }),
    ],
});
```

# Features

## App entry file

The default app file is an `app.vue` file on your vite root

If there is none, a default one will be used:

```vue
<template>
    <vitely-layout-manager>
        <router-view />
    </vitely-layout-manager>
</template>
```

The App component is the main component of your application, every other component (pages, layout, etc) will be a descendent of the App.

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

## Layouts

By using the `<vitely-layout-manager>` component, you can set the `layout: "layout-name"` property on every page to use a Layout as a wrapper component.

A layout is a normal component with a <slot>

```vue
<template>
    <div>
        <h1>Some fancy header</h1>
        <div class="content">
            <slot />
        </div>
    </div>
</template>
```

Every file in your `layouts` directory is a layout.

Ex:
With a filesystem like this

```
layouts
 ├── default.vue
 ├── admin.vue
 └── client.vue
```

Now you can use `layout: "admin"` (or client or default) on every page.
The layout `default` will be used if no layout is used in the chain or no layout can be found.

## Plugins

A plugin is simply a file to be run before the app is setup.

Example of a vuetify plugin `plugins/vuetify.ts`

```ts
import Vuetify from 'vuetify';
import Vue from 'vue';
import 'vuetify/dist/vuetify.min.css';
import { definePlugin } from '@vitely/vue2/runtime';

Vue.use(Vuetify);

export default definePlugin((context) => {
    const { options } = context;
    // Options will be passed to the Vue constructor
    options.vuetify = new Vuetify({});
});
```

And in your `vite.config`

```js
export default defineConfig({
    plugins: [
        vitelyVue2({
            // ...
            plugins: ['/plugins/vuetify.ts'],
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

# Migrating from other Frameworks

## Nuxt2

By using this `shim.nuxt2` config, you will enable a few features

-   Dynamic routes files must start with underscore `_id.vue` instead of `[id].vue`
-   `@nuxtjs/composition-api` will be shimed. Currently `useStore`, `useRoute` and `useRouter` only.
-   `nuxt-child` and `nuxt-link` components will be aliased to `router-view` and `router-link`

### How to migrate

1. Edit your `vite.config`

    ```js
    import vitelyVue2 from '@vitely/vue2';
    import { defineConfig } from 'vite';

    export default defineConfig({
        plugins: [
            vitelyVue2({
                // ...
                shim: {
                    nuxt2: true,
                },
            }),
        ],
        resolve: {
            alias: {
                '~': __dirname,
                '@': __dirname,
            },
        },
    });
    ```

1. Change your layouts from `<nuxt/>` to `<slot />`
1. Create an `index.html`
    ```html
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>My application</title>
        </head>
        <body>
            <div id="app"></div>
        </body>
    </html>
    ```

# Configuration Reference

## `ssr?: boolean (default: false)`

Enables or disable SSR. See [Server Build](#server-build)

## `server.standalone?: boolean (default: false)`

Enables or disable the standalone server build. See [Server Build](#server-build)

## `pages?: string (default: "pages")`

Pages directory to scan for routes
