Len Notes:

- get code
- in root folder:
-  npm install
-  npm run build
-  cd playground
-  npm install
-  $env:NODE_OPTIONS="--openssl-legacy-provider"
-  npm start

It then displays in the react app in the playground folder, in the browser.

to deploy to npm:
- npm run build
- npm login (while in root folder?)
- npm publish --access public


the index.ts file that exports everything can't use the wildcard when using rollup packager.
so instead of:
export * from 'whatever'
have to instead
export {this,that,those,stuff} from 'whatever'


Absolutely cannot include react in dependencies OR dev dependencies (maybe it would work in prod but sure doesn't in dev).
You end up with multiple instances of React and so where on instance contains some global state the other doesn't, can calling
from one to the other gets null errors.

