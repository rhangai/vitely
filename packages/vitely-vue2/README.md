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

## Layouts

By using the `<vitely-layout-manager>` component, you can set the `layout: "layout-name"` property on every page to use a Layout as a wrapper component.

Every file in your `layouts` directory is a layout.

Ex:

On your `app.vue`

```vue
<template>
    <vitely-layout-manager>
        <router-view />
    </vitely-layout-manager>
</template>
```

With a filesystem like this

```
layouts
 ├── default.vue
 ├── admin.vue
 └── client.vue
```

Now you can use `layout: "admin"` (or client or default) on every page.

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
1. Create an `app.vue`
    ```vue
    <template>
        <vitely-layout-manager>
            <router-view />
        </vitely-layout-manager>
    </template>
    ```
1. Create an `index.ts`
    ```ts
    import 'virtual:vitely/core/entry';
    ```
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
            <script type="module" src="/index.ts"></script>
        </body>
    </html>
    ```

# Configuration Reference

## `ssr: boolean`

Enables or disable SSR
