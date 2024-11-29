import swc from 'unplugin-swc';
import { defineConfig, configDefaults  } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        globals: true,
        root: './',
        exclude: [
            ...configDefaults.exclude,
            '**/*.e2e.spec.ts', // Exclui testes e2e
          ],
    },
    plugins: [
        tsConfigPaths(),
        swc.vite({
            module: {
                type: 'es6'
            }
        })
    ]
});