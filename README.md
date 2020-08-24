# Flashcard Editor

<div align="center">

[![License](https://img.shields.io/github/license/theodorechu/flashcard-editor?color=blue)](https://github.com/theodorechu/flashcard-editor/blob/master/LICENSE)
[![Not ready for use](https://img.shields.io/badge/Ready%20for%20use%3F-no-red)](https://github.com/theodorechu/flashcard-editor#development)
[![GitHub issues](https://img.shields.io/github/issues/theodorechu/flashcard-editor.svg)](https://github.com/theodorechu/flashcard-editor/issues/)
[![Slack](https://img.shields.io/badge/slack-standardnotes-CC2B5E.svg?style=flat&logo=slack)](https://standardnotes.org/slack)

</div>

## Introduction

The Flashcard Editor is an **unofficial** [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org), a free, open-source, and [end-to-end encrypted](https://standardnotes.org/knowledge/2/what-is-end-to-end-encryption) notes app.It is currently in development and not ready for use. :smile:

You can find the beta demo at [beta.flashcardeditor.com](https://beta.flashcardeditor.com).

The editor supports Markdown, $\LaTeX/ \KaTeX$, emoji codes, syntax highlighting, inline HTML, table of contents, footnotes, auto-linking, and more.

## Features

- [Markdown](https://guides.github.com/features/mastering-markdown/) support provided by [Unified/Remark](https://github.com/remarkjs/remark)
- $\LaTeX/\KaTeX$ provided by hosted [KaTeX](https://github.com/KaTeX/KaTeX)
- Emojis provided by [emoji codes](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- Google Code and GitHub Gist flavored Syntax Highlighting provided by [highlight.js](https://github.com/highlightjs/highlight.js) stylesheets
- Table of Contents (links don't work on mobile) provided by [Remark TOC](https://github.com/remarkjs/remark-toc)
- Footnotes (links don't work on mobile) provided by [Remark footnotes](https://github.com/remarkjs/remark-footnotes)
- Notes are stored in plaintext (great for longevity)

## Installation

1. Register for an account at Standard Notes using the [Desktop App](https://standardnotes.org/download) or [Web app](https://app.standardnotes.org). Remember to use a strong and memorable password.
1. Click **Extensions** in the lower left corner.
1. Click **Import Extension**.
1. Paste this into the box:
   ```
   https://notes.theochu.com/p/FV2A4HJFRN
   ```
1. Press Enter or Return on your keyboard.
1. Click **Install**.
1. At the top of your note, click **Editor**, then click **Flashcard Editor - Beta**.

After you have installed the editor on the web or desktop app, it will automatically sync to your [mobile app](https://standardnotes.org/download) after you log in.

## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Fork the [repository](https://github.com/theodorechu/flashcard-editor) on GitHub
2. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your fork of the repository
3. Type `cd flashcard-editor`
4. Run `npm install` to locally install the packages in `package.json`
5. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8002/dist/index.html"`. Optionally, create your `ext.json` as a copy of `ext.json.sample`.
6. Install http-server using `sudo npm install -g http-server`
7. Start the server at `http://localhost:8002` using `npm run server`
8. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:8002/ext.json`.
9. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.

## License

Copyright (c) Theodore Chu. All Rights Reserved. Licensed under [AGPL-3.0](https://github.com/TheodoreChu/flashcard-editor/blob/master/LICENSE) or later.

## Further Resources

- [GitHub](https://github.com/theodorechu/flashcard-editor)
- [Docs](https://docs.theochu.com/flashcard-editor)
- [Contact](https://theochu.com/contact)
