
⚠️ **EXPERIMENTAL** ⚠️

# ts-watchmon

This is an experiment of taking a subset of the Typescript compiler and combining it with nodemon for a faster workflow when developing with Typescript.

This is experimental at best right now. If there are specific features you would like to see, please [open an issue](https://github.com/olingern/ts-watchmon/issues).

## Installation

    $ npm install -g ts-watchmon

## Configuration

First, you need to tell ts-watchmon where your Typescript lives. This is done by adding a `project` section to your **package.json**.

**package.json**

```json
"project": {
    "tsDir": "."
}
```

**nodemon.json**
```json
{
    "ext": "js",
    "delay": 0,
    "exec": "node ./path/to_your_entry.js",
    "watch": "./js_output_path/**/*"
}
```

## License

This project is available under the MIT license. See LICENSE for details.
