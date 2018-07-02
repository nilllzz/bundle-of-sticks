# bundle-of-sticks

**Real gud manga viewer**

![](https://i.imgur.com/nAaTFya.png)

## What it do

Bundle of Sticks pulls together manga information from various websites and funnels them through its backend to the frontend, which displays the resulting data in an overengineered design.

It doesn't store any data itself, it only caches responses in RAM for a short amount of time to reduce server load.

Features include:

-   Combining search results from various Manga providers
-   Read Manga with a sophisticated viewer that can cache up to 10 pages ahead for slow connections
-   Manga Outline with chapters and volumes
-   Continue reading and reading history
-   Bookmark Mangas to set them aside for later
-   Privacy mode while active will not automatically store your activity
-   Memes and Emojis

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

## Simpleton explanation of how this application works:

Bundle of Sticks is actually two applications in disguise: A frontend and a backend.

The backend serves all the frontend files (HTML, CSS, JS) to your browser.
The frontend can then send requests to the backend's `/api/` endpoint, which supplies it with data.

The backend doesn't store any data itself at any point, it only funnels data from other sources to the frontend, when required.

The source code for the backend is in `index.js` and all files in the `api` folder.

The source code for the frontend is in `pages/index`
`/public/` holds all static resources that a browser can access, like HTML files and images.
When the frontend is built, this is also where the build results end up, named `bundle.js` and `/css/style.min.css`.
The JavaScript and CSS sources are stored in `/src/`.

## To run or develop locally:

### Required software

The backend runs on a **NodeJS server** that also serves the frontend application. Both require modules from the npm registry, meaning **npm** needs to be installed as well.

To install both, go here: https://nodejs.org/en/

For more detailed instructions, check here: https://www.npmjs.com/get-npm

### Running

If you want to just run the application on your machine and use it, open a terminal in the root folder of the project and run
`npm run start`.

That will download all required npm modules, build the frontend application and start the node server.

Once you see `Express server started on port 8080` in the terminal, head over to `localhost:8080` in your browser.

### Develop

Open a terminal in the root of the project and run `npm run build`.

Then, if you want to work on the frontend, navigate to `/pages/index` and execute `npm run watch`.

That will ensure that the frontend automagically rebuilds itself when you save changes to any of its files. Afterwards, you have to refresh the page in your browser if you had it open already.

To only run the server and not check for module updates/build the frontend, open a terminal in the root of the project and run `node index.js`.

You have to manually quit the server (Ctrl+C or close terminal) and restart it to apply changes you made to any of its files.

By default, the frontend is served on port **8080**.
If you already have something running on port 8080 or want to change it for some other reason, open `index.js` in the root directory and change `const port =` to whatever you want, then restart the node server.
