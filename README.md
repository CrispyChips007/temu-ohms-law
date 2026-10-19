# VEMU: Spin & Win

A portrait-first Ohm's Law formula game wrapped in an over-the-top bargain-shopping parody.

## Play locally

Open `index.html`, or serve the folder with any static file server.

## How it works

- Read an Ohm's Law question.
- Spin up to three times; exactly one spin will land on the correct formula.
- Keep the formula you think is right, or risk spinning past it.
- Correct answers unlock a gloriously dubious imaginary prize.

All voltage formulas use **V**, not E.

This project is an unaffiliated educational parody. No actual products, discounts, prizes, or alarming delivery fees are offered.

## Publishing updates

The HTML shell requests no-cache behaviour and loads `styles.css` and `app.js` with a release query string. When publishing a future update, bump the matching `?v=` value on both asset URLs in `index.html` so browsers immediately request the new files.
