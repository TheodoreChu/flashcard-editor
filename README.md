# Flashcards Editor

The Flashcards Editor is a [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for Standard Notes. It is currently in development and not ready for use.

## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Run `npm install` to locally install the packages in `package.json`
2. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8002/dist/index.html"`. Optionally, create your `ext.json` as a copy of `ext.json.sample`.
3. Install http-server using `npm install -g http-server`
4. Start the server at `http://localhost:8002` using `npm run server`
5. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:8002/ext.json`.
6. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.
