# args-command-router

Nodejs opinionated command-line argument router.

The idea behind **Args Command Router** is from the **ExpressJS** package, in which you can define different routes for different routines and functions based on the request.

![GitHub](https://img.shields.io/github/license/SHND/args-command-router)
[![Build Status](https://travis-ci.org/SHND/args-command-router.svg?branch=master)](https://travis-ci.org/SHND/args-command-router)
[![Coverage Status](https://coveralls.io/repos/github/SHND/args-command-router/badge.svg?branch=master)](https://coveralls.io/github/SHND/args-command-router?branch=master)

## Installation

```bash
npm install --save args-command-router@next
```

## Usage

Lets say we want to create a simplified git command line interface:

```bash
$ git add .
$ git commit -a -m "My message"
$ git branch
$ git push origin master --force
```

You can implement the routing of commands above like this:

```js
const { argsCommandRouter } = require('args-command-router')

const app = argsCommandRouter({
  applicationName: 'git',
})

app
  .route('/add/:filename')
  .description('Add file contents to the index')
  .callback(() => {
    /* Add command routine */
  })

app
  .route('/commit')
  .description('Record changes to the repository')
  .optionalSwitch('a', 'all', 'commit all changed files')
  .optionalSwitch('m', 'message', 'commit message', ['message'])
  .callback(() => {
    /* Commit command routine */
  })

app
  .route('/branch')
  .description('List, create, or delete branches')
  .callback(() => {
    /* Branch command routine */
  })

app
  .route('/push/:remote/:branch')
  .description('Update remote refs along with associated objects')
  .requiredSwitch('f', 'force', 'force updates')
  .callback(() => {
    /* Push command routine */
  })

app.run()
```

## Routes

The `route()` method on the Application instance specifies, what routine (callback) should be called for each series of commands and switches.

It receives a series of names separated by `/` and series of optional switches at the end of the path each inside `[]`.

```js
app.route('/cmd1/:cmd2[switch1=123][s]')
```

On each run, Application goes through the routes in order they are defined and compares the passed arguments (commands and switches) with each route, and execute the first matched route callback.

All arguments below, would matched the route above:

```bash
$ APP cmd1 hi --switch1 123 -s
$ APP cmd1 hello -s --switch1 123
$ APP cmd1 'hey all' -s --switch1 123
```

Each `cmd1`, `:cmd2` and `[switch1=123][s]` are called **PathItem**.

- `cmd1` is a **Static PathItem**, since it always tries to match the exact name.

- `:cmd2` is a **Dynamic PathItem**, and it can be matched to any value in its place.

- `[switch1=123][s]` is a **Switch PathItem**, and it is matched to existence of switch `-s` (either with value or not) and existence of switch `--switch1` with the exact value of _123_. If you have special characters in the value, you can put that value in single or double quotes.

## Callbacks

Callbacks specifies what routine (function) should be called when a matched route is found.

```js
route('/call/my/callback').callback(function(inputs) {
  const {
    commands,
    pathParams,
    shortSwitches,
    longSwitches,
    switches,
    context,
  } = inputs

  const pathItem = this
})
```

Your callbacks are called with data about the current execution of your application.

- **commands** is an array of strings passed to your application as commands.
- **pathParams** is an object of dynamic pathItem names and values that are passed to your application.
- **shortSwitches** is an object of short switch names and array of values that are passed to your application.
- **longSwitches** is an object of long switch names and array of values that are passed to your application.
- **switches** is **shortSwitches** and **longSwitches** in one object.
- **context** is an object that hooks can use to pass values to the next hooks and callbacks.
- **this** points to the matched pathItem or it's _null_ if no pathItem is associated with the callback.

You can also add new properties to the input object in hooks and access them in the your callbacks.

## Switches

In order to pass switches to your application, you need to define them on your routes.

Switches can be either **Required** or **Optional**.

### Required Switches

These switches should be present when running your application for a specific route, otherwise your callback won't be called, even if you are mentioning them in your route string. (This behavior can be changed by the configuration option `verifySwitches`)

```js
app
  .route('/video/download')
  .requiredSwitch('u', 'url', 'URL of the video', ['address'])
  .callback(input => console.log(input.switches.url))
```

Here we are defining a Required Switch `u`, `url` for `/video/download` that gets one parameter with a name address. So an example of a shell execution could be:

```bash
$ App video download -u http://myvideo.com/v.avi
$ App video download --url http://myvideo.com/v.avi
```

### Optional Switches

These switches can be absent when running your application.

```js
app.route('/video/formats').optionalSwitch('a', 'all', 'Show all formats')
```

Examples of a shell execution could be:

```bash
$ App video formats
$ App video formats -a
$ App video formats --all
```

If your switch expects parameters, you can list them in the switch definition.

```js
app
  .route('/video/formats')
  .optionalSwitch('f', 'filter', 'Filter format lists', ['pattern'])
```

### Common Required, Optional Switches

These type of switches can be defined on a route and will be inherited by all the subordinate routes.

```js
app
  .route('/video')
  .commonRequired('k', 'key', 'Api key', ['key'])
  .commonOptional('v', 'verbose', 'Verbose output')
```

Examples of a shell execution could be:

```bash
$ App video -k abc123
$ App video download --key abc123
$ App video formats --key abc123 -v
```

## Hooks

Hooks are functions that are getting executed at different stages of the execution of the application. You can view the order of execution of the callback and hooks from [this diagram](https://raw.githubusercontent.com/SHND/args-command-router/master/docs/hooks_order.png).

- **beforeAll Hook:** is called before all executions.

```js
app.beforeAll(inputs => {
  // do some stuff
})
```

- **afterTargetFound Hook:** is called after a PathItem for the passed commands is found.

```js
app.afterTargetFound(inputs => {
  // do some stuff
})
```

- **afterCallbackFound Hook:** is called when PathItem is found and at least one callback is set on it.

```js
app.afterCallbackFound(inputs => {
  // do some stuff
}
```

- **beforeCallback Hook:** is called right before callback execution.

```js
app.beforeCallback(inputs => {
  // do some stuff
}
```

- **afterCallback Hook:** is called right after callback execution.

```js
app.afterCallback(inputs => {
  // do some stuff
}
```

- **noTarget Hook:** is called when no PathItems could be associated with passed commands.

```js
app.noTarget(inputs => {
  // do some stuff
}
```

- **noCallback Hook:** is called when PathItem is found but no callbacks are set on the PathItem.

```js
app.noCallback(inputs => {
  // do some stuff
}
```

- **onVerifySwitchFailure Hook:** is called when Callback is found but passed switches are not matched with defined switches for that PathItem.

```js
app.onVerifySwitchFailure(inputs => {
  // do some stuff
}
```

You can also add new properties and values to your inputs for the next hooks and callbacks. In order to do that just return an object with those properties.

```js
app.beforeAll(inputs => {
  return {
    hello: 'hi',
  }
})

app.route('/video/formats').callback(inputs => {
  console.log(inputs.context.hello)
})
```

If you want to stop the next hooks and callbacks to be called, return a string 'stop' from your callbacks.

```js
app.beforeAll(inputs => {
  if (new Date().getHours() < 6) {
    return 'stop'
  }
})
```

## Help

Args Command Router generates help (usage) output out of the box for you. By including `-h` or `--help` the help (usage) will be display on the console.

Help switches are configurable when instantiating the Application.

In case you want to disable default help set the configuration option `helpType` to `null`.

## Application Configuration

You can configure the args-command-router behavior when instantiating the Application.

These are the default values:

```js
const app = new Application({
  applicationName: '<App>',
  verifySwitches: true,
  helpType: 'switch',
  helpShortSwitch: 'h',
  helpLongSwitch: 'help',
  helpOnNoTarget: true,
  helpOnNoCallback: true,
  helpOnVerifySwitchFailure: true,
  helpOnAskedForHelp: true,
})
```

- `applicationName`: The name of the application used in generating the help (usage) output.
- `verifySwitches`: Verify if the passed switches are matched with switches defined on the found pathItem.
- `helpType`: If you want to disable the help functionality, set this to `null`.
- `helpShortSwitch`: The short switch name for showing help (usage) output.
- `helpLongSwitch`: The long switch name for showing help (usage) output.
- `helpOnNoTarget`: Show help when no PathItem found for the passed commands.
- `helpOnNoCallback`: Show help when PathItem is found but no callbacks are defined on that pathItem.
- `helpOnVerifySwitchFailure`: Show help if the `verifySwitches` config is set to true but switches for that pathItem not matched.
- `helpOnAskedForHelp`: Show help when user deliberatly asks for help. e.g. when user pass `-h`.
