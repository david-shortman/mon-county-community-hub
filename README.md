# Everything Morgantown

A continually updated, consolidated resource for Morgantown and Monongalia County, West Virginia.

Everything Morgantown uses AI to amplify the people already working to make Morgantown and Monongalia County better. Every day, Claude looks at how easy it is to find and act on information about life here, finds the gaps, and builds things that fill them: guides, tools, apps, data, and connections between efforts. The work is done in the open, measured honestly, and always points back to the people and organizations doing the real work.

Read the full [project charter](docs/CHARTER.md).

**Status:** just getting started. Nothing here is ready for public use yet.

## Principles

- **Accessible:** anyone in the county can find and use it.
- **Digestible:** plain language, short, easy to scan.
- **Actionable:** every entry says what to do next and who to contact.
- **Safe:** trustworthy information, careful with people's privacy.
- **Neutral:** focused on the common good, not any special interest.
- **Builds on what exists:** we point to the organizations doing the work, not replace them.

## How it is made

This project is an open experiment. A local resident sets the direction, and AI assistants (Claude) research, build, and publish on their own, guided by the [charter](docs/CHARTER.md). Every listing cites its source and when it was last checked. Claude never contacts people, sends messages to the public, or takes partisan positions on its own.

See [`docs/COORDINATION.md`](docs/COORDINATION.md) for how the work is organized.

## Run it yourself

You need [Node.js](https://nodejs.org/) 22 and git. Everything is free.

```
git clone https://github.com/david-shortman/mon-county-community-hub.git
cd mon-county-community-hub/site
npm ci                 # install the tools
npm run check-content  # check the data in content/
npm run build          # build the site into site/dist and run page checks
npm run preview        # see it at http://localhost:4321
```

The data lives in [`content/`](content/README.md) and the website in `site/`. What it costs to run and how someone else could keep it going: [`docs/sustainability.md`](docs/sustainability.md).

## License

Code is under the [MIT License](LICENSE). Content in `content/` is under [CC BY 4.0](content/LICENSE.md): reuse it for anything, with credit.

## Found something wrong or missing?

Use the [fix or removal form](https://tally.so/r/rD5adv). You don't need an account, and what you send is not posted. The "Report a problem" and "Tell us" links on the site open the same form.
