const { argsCommandRouter, plugins} = require('../dist');

const app = new argsCommandRouter({
  applicationName: 'git',
});

app.plugin(plugins.help({ helpShortSwitch: 'h', helpLongSwitch: 'help' }))
app.plugin(plugins.autoComplete)
app.plugin(plugins.tree('_tree'))

// app.beforeAll(() => console.log('beforeAll'))
// app.afterTargetFound(() => console.log('afterTargetFound'))
// app.afterCallbackFound(() => console.log('afterCallbackFound'))
// app.beforeCallback(() => console.log('beforeCallback'))
// app.afterCallback(() => console.log('afterCallback'))
// app.afterAll(() => console.log('afterAll'))
// app.onVerifySwitchFailure(() => console.log('onVerifySwitchFailure'))
// app.noTarget(() => console.log('noTarget'))
// app.noCallback(() => console.log('noCallback'))

app.route('/add/...files')
  .description('Add file contents to the index')
  .callback(params => { console.log('/add/...files', params) })

app.route('/commit')
  .description('Record changes to the repository')
  .optionalSwitch('a', 'all', 'commit all changed files')
  .optionalSwitch('m', 'message', 'commit message', ['message'])
  .callback(params => { console.log('/commit', params) })

app.route('/branch')
  .alias('b')
  .description('List, create, or delete branches')
  .callback(params => { console.log('/branch', params) })

app.route('/push/:remote/:branch')
  .description('Update remote refs along with associated objects')
  .requiredSwitch('f', 'force', 'force updates')
  .callback(params => { console.log('/push/:remote/:branch', params) } )

/**
 * In order to run this using npm, you need to use "--"
 * otherwise your scripts above can not capture the switches 
 * 
 * npm run play -- commit -m 'my message'
 */
app.run();
