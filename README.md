# Flashcards Editor

The Flashcards Editor is a [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for Standard Notes. It is currently in development and not ready for use.

## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Run `npm install` to locally install the packages in `package.json`
1. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8002/dist/index.html"`. Optionally, create your `ext.json` from `ext.json.sample`.
1. Start the server using `npm run server`
1. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app using `http://localhost:8002/ext.json`.
1. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.
