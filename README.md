# args-command-router

Nodejs opinionated command-line argument router.

The idea behind **Args Command Router** is from the **ExpressJS** package, in which you can define different routes for different routines and functions based on the request.

![GitHub](https://img.shields.io/github/license/SHND/args-command-router)
[![Build Status](https://travis-ci.org/SHND/args-command-router.svg?branch=master)](https://travis-ci.org/SHND/args-command-router)
[![Coverage Status](https://coveralls.io/repos/github/SHND/args-command-router/badge.svg?branch=master)](https://coveralls.io/github/SHND/args-command-router?branch=master)

## Installation

```bash
npm install args-command-router
```

## Usage

### Scenario

Let's say we want to create a nodejs application called _Fetcher_. It can download a file, crawl a website, and so more.

On the CLI, you've decided that your application should work like this:

```bash
node fetcher.js version
node fetcher.js check file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg
node fetcher.js download file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg
node fetcher.js download file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg --output ~/Downloads
node fetcher.js download folder https://nodejs.org/dist/ --depth 2
```

Let's try to route `version` path to its implementation:

```js
const { argsCommandRouter } = require('args-command-router')
const app = argsCommandRouter()

const APP_VERSION = '1.0.1'

// node fetcher.js version
app.route('version', () => {
  console.log(APP_VERSION)
})

app.run()
```

Here we are importing _args-command-parser_ and create an _app_ object from it. Then we are defining a route for _version_ and specify a callback to be run whenever the application receives _version_ first thing in its arguments.

In the end, we need to call the `run()` method to tell **Args Command Parser** that we are done with our route definitions, and we are ready to analyze CLI arguments and route them to the correct callback.

## Routes

For the next one, let's do the `check file <file_url>` and `download file <file_url>` in our Scenario on the top:

```js
// initializing app constant like above...

// node fetcher.js check file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg
app.route('check/file/:file_url', inputs => {
  const fileUrl = inputs.params.file_url

  console.log('Check whether the file ' + fileURL + 'exists.')
})

// node fetcher.js download file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg
app.route('download/file/:file_url', inputs => {
  const fileUrl = inputs.params.file_url

  console.log('Download the file ' + fileURL + ' to the Desktop')
})
```

Here `check` and `file` are fixed values, and `file_url` is a parameter, meaning that the user of our application can put any value in `file_url` position, and we're going to capture that. Parameters in CLI arguments are prefixed with a colon (`:`) in the route string.

Now let's add a condition that if the `download file <file_url>` has an `--output` switch route to another implementation:

```js
// node fetcher.js download file https://nodejs.org/dist/v10.16.3/node-v10.16.3.pkg --output ~/Downloads
app.route('download/file/:file_url[output]', inputs => {
  const fileUrl = inputs.params.file_url
  const outputDir = inputs.switches.output

  console.log('Download the file ' + fileURL + ' to ' + outputDir)
})
```

As you see here, you can have extra conditions in your route strings inside brackets (`[]`).

Now let's try to route `download folder <folder_url>` with switch `--depth`. Let's say for different depths, we want to have different implementations:

```js
// node fetcher.js download folder https://nodejs.org/dist/ --depth 1
app.route('download/folder/:folder_url[depth=="1"]', inputs => {
  const folderUrl = inputs.params.folder_url

  console.log('Download only the files inside ' + folderUrl + ' url folder')
})

// node fetcher.js download folder https://nodejs.org/dist/ --depth 0
app.route('download/folder/:folder_url[depth < "1"]', inputs => {
  console.log('There is nothing to download')
})

// node fetcher.js download folder https://nodejs.org/dist/ --depth 3
app.route('download/folder/:folder_url[depth]', inputs => {
  const folderUrl = inputs.params.folder_url
  const depth = inputs.params.depth

  console.log(
    'Crawl and download to maximum ' + depth + ' levels in ' + folderUrl
  )
})

app.route('download/folder/:folder_url', inputs => {
  const folderUrl = inputs.params.folder_url

  console.log('Crawl and download eveything inside ' + folderUrl)
})
```

### Route Arguments

When a Route callback is called, some data will be passed to it through its parameters.

The first parameter is **input** object. It contains properties and methods about the input to the application:

- `command` property returns the Command for the current route.
- `params` property returns the parameters passed inside the command arguments passed to the app.
- `shortSwitches` property returns all short switches.
- `longSwitches` property return all long switches.
- `switches` property returns an aggregate of short and long switches
- `all` property returns aggregate of params, shortSwitches, and longSwitches.

The second parameter is **next()** method. By default, whenever a route is matched, no further routes will be checked. By calling `next()` in your routes, you are specifying that after finishing executing the current route, go for the next matched route and run that.

```js
app.route('check/file/:file_url', (inputs, next) => {
  const fileUrl = inputs.params.file_url

  console.log('Check whether the file ' + fileURL + 'exists.')
  next()
})
```

Remember that routes that are defined sooner have a higher priority to get matched.

## Hooks

Hooks are functions that are getting executed at different stages of the execution of the application.

Currently, there are three different hooks:

- **NoRoute Hooks**: These hooks are executed when no matches found in the routes.

```js
app.noroute((input, next) => {
  // do some stuff

  next()
})
```

- **Before Hook**: These hooks are executed before executing route callbacks.

```js
app.before((input, next) => {
  // do some stuff

  next()
})
```

- **After Hook**: These hooks are executed after executing route callbacks.

```js
app.after((input, next) => {
  // do some stuff

  next()
})
```

By default, whenever a hook is run, no further hooks of the same type will be checked and run. The `next()` method tells **Args Command Router** to execute the next hook of the same type. Without calling `next()`, **Args Command Router** will stop executing hooks of that type and move to the next stage.

```js
app.route('check/file/:file_url', (inputs, next) => {
  const fileUrl = inputs.params.file_url

  console.log('Check whether the file ' + fileURL + 'exists.')
  next()
})
```

## Help (Usage)

**Args Command Router** generates help (usage) output out of the box. **Helps** are commands same as other commands in the application.

```sh
node fetcher.js download help
```

In order to get better help output, you can set descriptions and define switches for commands. This will be discussed more in the **Command** section.

## More Details on the Format

**args-command-router** is opinionated command-line router based on the package [args-command-parser](https://www.npmjs.com/package/args-command-parser). The idea is that the commands are in the format below:

```
node <file.js> [command1 [command2 [...]]] [switches]
```

### Command

Commands are the first arguments showing up. These are names without `-` or `--`. As soon as a switch is seen, the sequence of commands is considered finished.

### Switch

Switches can be in short or long format.

#### Short Switch

Short Switches are prefixed with `-` followed by one or more single-character switch. If more than one character is specified, each character is considered a Short Switch. Short Switches can be followed by zero to any number of values.

#### Long Switch

Long Switches are prefixed with `--` followed by the switch name. Long Switches can be followed by zero to any number of values.

## More Details on Routes

**Be careful about the order of the routes you're defining. The routes that are defined sooner will be matched and run sooner.**

~~If there are multiple matches, the latest matched route callback will be triggered.~~

The `noroute()` method can be used for when no routes are matched:

```js
app.noroute(inputs => {
  console.log('No routes matched.')
})
```

After defining all your routes, you need to call the `run()` method on the application instance.

```
app.run()
```

The `run()` method use currently passed arguments to find the route match, but you can pass an array of strings to `run()`, and args-command-router will use those instead of the currently passed arguments.

## More Details on Commands and Switches

Routes are consist of two parts:

- Commands
- Condition

### Commands

Commands are specifying an argument path to the user's implementation. Command path can be specified in string in `route()` or by creating a `Command` object.

Command _string_ items (fixed or parameter) are separated by a slash (`/`), and parameters are prefixed by a colon (`:`).

The _Command_ objects give you better control over organizing and externalizing routes and code.

```js
const { argsCommandRouter, Command } = require('args-command-router')
const downloadFile = require('./downloadFile.js')
const app = argsCommandRouter()

const downloadFileCommand = new Command('download/file')
app.route(downloadFileCommand, downloadFile)
```

By having a reference to the Command, you can set additional properties for documentation and control.

Just remember that when you are creating a `Command` object, the command path string shouldn't contain any brackets and conditions.

```
const downloadFileCommand = new Command('download/file')
downloadFileCommand
  .description('Downloads a specific file given by its url')
  .valuedSwitch('o', 'output', null, 'Destination file local path')
  .booleanSwitch('p', 'progress', 'Show download progress bar')
  .requiredSwitch('f', 'force', 'This is just to a show required switch feature')
```

The other thing is, each Command item comes with a fixed Command child `help` to display a help message for that command. So you can do:

```bash
node fetcher.js help
node fetcher.js download help
node fetcher.js download file help
...
```

I'm generating help outputs using the [command-line-usage](https://www.npmjs.com/package/command-line-usage) package.

You can override the `help` command in the same way that you defined a new route:

```js
app.route('download/file/:file_url/help', inputs => {
  console.log('I want my own help message')
})
```

### Condition

Conditions add extra control over routing the command arguments. They can be specified inside the route path or by creating a `Condition` object.

You can use _Command Parameters_ and _switches that passed at runtime_ in your conditions.

We have already seen conditions inside route (using brackets `[]`). Let's have an example of `Condition` objects.

```js
const { argsCommandRouter, Command } = require('args-command-router')
const downloadFile = require('./downloadFile.js')
const app = argsCommandRouter()

const downloadFileCommand = new Command('download/folder/:folder_url')
const downloadFileDepthOneCondition = new Condition('depth=="1"')
app.route(downloadFileCommand, downloadFileDepthOneCondition, downloadFile)
```

Or you can specify each of them in the route separately by route string path:

```
app.route('download/folder/:folder_url', downloadFileDepthOneCondition, downloadFile)
app.route(downloadFileCommand, 'depth=="1"', downloadFile)
app.route('download/folder/:folder_url', 'depth=="1"', downloadFile)
app.route('download/folder/:folder_url[depth=="1"]', downloadFile)
```

The condition string follows the extended [expr-eval](https://www.npmjs.com/package/expr-eval) conditional syntax and doesn't follow the JavaScript syntax.

| Operator | Description         | Example                            | Example explained                            |
| -------- | :------------------ | :--------------------------------- | :------------------------------------------- |
| ==       | equal               | a == "2"                           | a is equal to 2                              |
| !=       | not equal           | a != "2"                           | a is not equal to 2                          |
| >=       | greater or equal    | a >= "2"                           | a is greater or equal 2                      |
| <=       | lesser or equal     | a <= "2"                           | a is lesser or equal 2                       |
| >        | greater             | a > "2"                            | a is greater 2                               |
| <        | lesser              | a < "2"                            | a is lesser 2                                |
| and      | logical AND         | b and a == "2"                     | b is present and a is equal to 2             |
| or       | logical OR          | b or a == "2"                      | b is present or a is equal to 2              |
| not      | logical Not         | not a                              | a is not present                             |
| (...)    | Grouping conditions | (a and b) or ((not a) and (not b)) | both a and b are present or both not present |

## License

[MIT](https://choosealicense.com/licenses/mit/)
