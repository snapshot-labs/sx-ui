/// <reference types="histoire" />

import path from 'path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import GlobalPolyFill from '@esbuild-plugins/node-globals-polyfill';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import visualizer from 'rollup-plugin-visualizer';
import inject from '@rollup/plugin-inject';
import UnoCSS from 'unocss/vite';
import presetWind from '@unocss/preset-wind';

const ELECTRON = process.env.ELECTRON || false;

const target = ['esnext'];

export default defineConfig({
  base: ELECTRON ? path.resolve(__dirname, './dist') : undefined,
  define: {
    'process.env': process.env
  },
  plugins: [
    vue({ reactivityTransform: true }),
    UnoCSS({
      presets: [presetWind()],
      rules: [
        // [
        //   'border-b',
        //   { borderBottom: '1px solid red' }
        // ]
      ],
      theme: {
        // borderColor: {
        //   DEFAULT: 'var(--border-color)',
        //   red: '#ff3856'
        // },
        colors: {
          primary: 'var(--primary-color)',
          'skin-border': 'var(--border-color)',
          'skin-text': 'var(--text-color)',
          'skin-link': 'var(--link-color)',
          'skin-bg': 'var(--bg-color)',
          'skin-block-bg': 'var(--block-bg)',
          'skin-heading': 'var(--heading-color)',
          blue: '#384aff',
          green: '#21b66f',
          red: '#ff3856'
        },
        // animation: {
        //   'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        // },
        // screens: {
        //   xs: '420px',
        //   sm: '544px',
        //   md: '768px',
        //   lg: '1012px',
        //   xl: '1280px'
        // },
        spacing: {
          0: '0px',
          1: '4px',
          2: '8px',
          3: '16px',
          4: '24px',
          5: '32px',
          6: '40px',
          7: '48px',
          8: '64px'
        },
        fontFamily: {
          serif:
            'Calibre, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji'
        },
        fontSize: {
          '2xl': '34px',
          xl: '28px',
          lg: '22px',
          md: '20px',
          base: '18px',
          sm: '17px',
          xs: '13px'
        }
      }
    }),
    Components({
      directoryAsNamespace: true,
      resolvers: [
        IconsResolver({
          alias: {
            h: 'heroicons-outline',
            s: 'heroicons-solid'
          }
        })
      ]
    }),
    visualizer({
      filename: './dist/stats.html',
      template: 'sunburst',
      gzipSize: true
    }),
    Icons({
      compiler: 'vue3',
      iconCustomizer(collection, icon, props) {
        props.width = '20px';
        props.height = '20px';
      }
    })
  ],
  optimizeDeps: {
    include: ['@snapshot-labs/sx', '@snapshot-labs/snapshot-oc'],
    esbuildOptions: {
      target,
      plugins: [
        GlobalPolyFill({
          buffer: true
        })
      ]
    }
  },
  build: {
    target,
    commonjsOptions: {
      include: [/sx.js/, /soc.js/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer']
        })
      ]
    }
  },
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
      // polyfills
      // stream: fileURLToPath(new URL('node_modules/stream-browserify', import.meta.url)),
      // events: fileURLToPath(new URL('node_modules/events', import.meta.url)),
      // util: fileURLToPath(new URL('node_modules/util', import.meta.url)),
      // buffer: fileURLToPath(new URL('node_modules/buffer', import.meta.url))
      '@': path.resolve(__dirname, './src'),
      // polyfills
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      events: path.resolve(__dirname, 'node_modules/events'),
      util: path.resolve(__dirname, 'node_modules/util'),
      buffer: path.resolve(__dirname, 'node_modules/buffer')
    },
    dedupe: ['@popperjs/core']
  }
});
