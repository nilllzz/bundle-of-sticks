# bundle-of-sticks

**Real gud manga viewer**

Webified to absolute shit with the following completely unnecessary technologies:

-   NodeJS server
-   webpack
-   babel
-   Typescript
-   ES5, ES6, ESNext
-   React
-   TSX
-   Bootstrap
-   CSS Minifier
-   serve
-   express

## How to run locally:

0.  fork/clone the project
1.  install npm (https://www.npmjs.com/get-npm)
1.  open a terminal in the root of the project, run `npm install`
1.  cd to `/pages/index` and run `npm install` there too
1.  cd back to the root of the project, run `npm run build`
1.  run `node index.js` (if that gives you an ENODE error about not being able to register the port, run it with sudo)
1.  go to `localhost:80`

If you already have something running on port 80 or want to change it for some other reason, open `index.js` and change `const port =` to whatever you want, then restart the node server.

In case you want to develop with this, instead of running `npm run build` every time you change a file, cd into `/pages/index` and run `npm run watch`. This will automatically rebuild the application and sometimes also auto refresh your open application window. To be on the safe side, refresh it if you make major changes.
