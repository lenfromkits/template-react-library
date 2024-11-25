# Notes:

- get code
- in root folder:
-  npm install
-  npm run build
-  Optional:
    -  cd playground
    -  npm install
    -  $env:NODE_OPTIONS="--openssl-legacy-provider"
    -  npm start

It then displays in the react app in the playground folder, in the browser.

to deploy to npm:
- npm run build
- npm login
- npm publish --access public


the index.ts file that exports everything can't use the wildcard when using rollup packager.
so instead of:
export * from 'whatever'
you have to instead:
export {this,that,those,stuff} from 'whatever'




# REACT PACKAGES:
## Don't include React:
You cannot put the react packages into the package folder's dependency list, or the calling application that uses this library will end up with two copies of react in memory, causing big problems when interacting with each other when one has some sort of global state while the other doesn't but is expected to, etc.

You instead add them to the peerDependencies in the package.json file. Then when you deploy and it runs, it'll look for reach in the parent's node_modules.

## Problem:
But, if you want to execute code in this library alone for testing, say from the child "playground" react app or Jest, etc, it will need React to exist in the node_modules. So you could add it to devDependencies and install it BUT, then if you want to execute this library from the calling React application using npm link, this library would use the local node_module's React installation instead of the parent's. That doesn't work so you'd have to install/uninstall React constantly depending on how you're executing it.

## Solution:
The solution is to: Hide the React folders when executing from the calling React application. You'll have to manually run a script to switch it back and forth.
The library will build even without React available, but it'll complain about references. Code editors will highlight unknown react components.

```shell
npm run hideReact
npm run showReact
```

## Solution Implemenation:
The script could just rename the React folders that are in the node_modules to hide them, but, that would require closing the IDE since it has the folders locked. 
Instead, we will keep all the React folders in a separate folder called "node_modules_react" that sits adjacent to the "node_modules" folder.

Links will be added under the node_modules folder that point to the React folders that are under the node_modules_react folder. This is similar to how "npm link" works. We just use virtual folders. (only tested in Windows so far)

The script will then simply add/delete those links since they are not locked by the IDE (at least on Windows that is).
The script will also initially install React and then move those folders to the node_modules_react folder if they aren't already there. But, if the IDE locks those folders right after React is installed, the script will notify you to manully cut/paste them from the node_modules folder into the node_modules_react folder.

### Environment Setup
Typical setup:
- a create-react-app application in a folder.
- this react library in some other folder 
- a link inside the node_modules folder of the create-react-app that points to this library.
- the create-react-app will think it's actually in its node_modules folder
- NPM link will set this up but it gets confused with hiearchies of librarys that share grandchild libraries, so
    consider using your own "function" type links instead, like what's used here to show/hide react.
- keep react hidden when running your create-react-app or you'll get errors because two separate react enviroments will be loaded. 
- you can build this library using rollup with or without react showing
- show the react when you want to do development on this library because without react, the IDE doesn't know what anything is.

### Nuances
- Building this library with react 'showing', while the create-react-app webserver is running and using this library, will
    cause you to have to restart the react webserver since it will see the react in this library and not forget even if you
    recopile with react hidden.


