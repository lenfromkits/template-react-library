import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true }, // Add sourcemap: true
        { file: pkg.module, format: 'esm', sourcemap: true } // Add sourcemap: true
    ],
    plugins: [
        external(),
        resolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }),
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled' 
        }),
        del({ targets: ['dist/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
};