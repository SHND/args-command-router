const { argsCommandRouter, plugins } = require('../dist');

/**
 * Before running the example, you need to run `npm install` in the root of the project.
 * Run this example using: `node ./npm.js`
 */

const app = argsCommandRouter({
  applicationName: 'npmx',
})

app.plugin(plugins.debug);
app.plugin(plugins.autoComplete);

app.route('/')
  .option('l')

app.route('/help/:term')

app.route('/help/npm')

app.route('/access/public/:package')
app.route('/access/restricted/:package')
app.route('/access/grant/read-only/:scope-team/:package')
app.route('/access/grant/read-write/:scope-team/:package')
app.route('/access/revoke/:scope-team/:package')
app.route('/access/2fa-required/:package')
app.route('/access/2fa-not-required/:package')
app.route('/access/ls-packages/:param')
app.route('/access/ls-collaborators/:package/:user')
app.route('/access/edit/:package')

app.route('/adduser')
  .alias('login')
  .alias('add-user')
  .option(null, 'registry', null, ['url'])
  .option(null, 'scope', null, ['orgname'])
  .option(null, 'auth-type', null, ['legacy'])
  .option(null, 'always-auth')

app.route('/audit')
  .option(null, 'json')
  .option(null, 'production')

app.route('/audit/fix')
  .option(null, 'force')
  .option(null, 'package-lock-only')
  .option(null, 'dry-run')
  .option(null, 'production')
  .option(null, 'only', null, ['devorprod'])

app.route('/bin')
  .option(null, 'global')

app.route('/bugs/:pkgname')

app.route('/issues/:pkgname')

app.route('/cache/add/:pkg')
app.route('/cache/add/:pkg')
app.route('/cache/add/clean')
app.route('/cache/add/verify')

app.route('/ci')

app.route('/completion')

app.route('/config')
  .alias('c');

app.route('/config/set/:key/:value')
app.route('/config/get/:key')
app.route('/config/delete/:key')
app.route('/config/edit')
app.route('/config/list')
  .option(null, 'json')
  
app.route('/set/:key/:value')
app.route('/get/:key')

app.route('/dedupe')
app.route('/ddp')
app.route('/find-dupes')

app.route('/deprecate/:pkg/:message')

app.route('/dist-tag')
  .alias('dist-tags');

app.route('/dist-tag/add/:pkg')
app.route('/dist-tag/add/:pkg/:tag')
app.route('/dist-tag/rm/:pkg/:tag')
app.route('/dist-tag/ls/:pkg')

app.route('/docs')
  .alias('home')
app.route('/docs/:pkgname')

app.route('/doctor')

app.route('/edit/...packages')

//TODO: need to check
// app.route('/explore/:pkg/--/:command')

app.route('/fund')
  .option(null, 'json')

app.route('/fund/:pkg')
  .option(null, 'json')
  .option(null, 'browser')
  .option(null, 'which', null, ['fundingSourceNumber'])

app.route('/help')

app.route('/help-search/:text')

app.route('/hook')

app.route('/init')
  .alias('create')
  .alias('innit')
  .option('f', 'force')
  .option('y', 'yes')
  .option(null, 'scope')

app.route('/init/:name')

app.route('/install')
  .alias('i')
  .alias('isntall')
  .alias('add')
  .commonOption(null, 'save-prod')
  .commonOption(null, 'save-dev')
  .commonOption(null, 'save-optional')
  .commonOption(null, 'save-exact')
  .commonOption(null, 'no-save')

app.route('/install/:pkg')

app.route('/install-ci-test')
  .alias('cit')
app.route('/install-ci-test/:args')

app.route('/install-test')
  .alias('it')
app.route('/install-test/:args')

app.route('/link')
  .alias('ln')
app.route('/link/:pkg')

app.route('/logout')
  .option(null, 'registry', null, ['url'])
  .option(null, 'scope', null, ['scope'])

app.route('/ls')
  .alias('list')
  .alias('la')
  .alias('ll')
app.route('/ls/...pkg')

app.route('/org/set/:orgname/:username/:role')
app.route('/org/rm/:orgname/:username')
app.route('/org/ls/:orgname')
app.route('/org/ls/:orgname/...usernames')

app.route('/outdated/...pkgs')

app.route('/owner')
  .alias('author')
app.route('/owner/add/:username/:pkg')
app.route('/owner/rm/:username/:pkg')
app.route('/owner/ls/:pkg')

app.route('/pack/...pkgs')
  .option(null, 'dry-run')

app.route('/ping')

app.route('/prefix')
  .option('g')

app.route('/profile/enable-2fa/:authandwrite')
app.route('/profile/disable-2fa')
app.route('/profile/get/:key')
app.route('/profile/set/:key/:value')

app.route('/prune/...pkgs')
  .option(null, 'production')

app.route('/public/:file')
  .option(null, 'tag', null, ['tag'])
  .option(null, 'access', null, ['access'])
  .option(null, 'dry-run')

app.route('/rebuild')
  .alias('rb')
app.route('/rebuild/...names')

app.route('/repo/:pkg')

// TODO
// app.route('/restart/--/...args')

// app.route('run-script/:cmd/--/...args')
//   .alias('run')
//   .alias('rum')
//   .alias('urn')

app.route('/search')
  .alias('s')
  .alias('se')
  .alias('find')
  .option(null, 'long', ['terms'])

app.route('/set/:key/:value')

app.route('/shrinkwrap')
app.route('/star')
  .alias('unstar')
app.route('/star/:pkg')

// TODO
// app.route('/start/--/...args')

// app.route('/stop/--/...args')

app.route('/team/create/:team')
  .option(null, 'otp', null, ['otpcode'])

app.route('/team/destroy/:team')
  .option(null, 'otp', null, ['otpcode'])

app.route('/team/add/:team/:user')
  .option(null, 'otp', null, ['otpcode'])

app.route('/team/rm/:team/:user')
  .option(null, 'otp', null, ['otpcode'])

app.route('/team/ls/:team')
app.route('/team/edit/:team')

// TODO
app.route('/test')
  .alias('tst')
  .alias('t')
// app.route('/test/--/...args')

app.route('/token/list')
app.route('/token/revoke/:tokenKey')
app.route('/token/create')
  .option(null, 'read-only')
  .option(null, 'cidr', null, ['list'])

app.route('/uninstall')
  .alias('un')
  .alias('unlink')
  .alias('remove')
  .alias('rm')
  .alias('r')
app.route('/uninstall/...pkgs')
  .option(null, 'save-prod')
  .option(null, 'save-dev')
  .option(null, 'save-optional')
  .option(null, 'no-save')

app.route('/unpublish/:pkg')
  .option(null, 'force')

app.route('/update')
  .alias('up')
  .alias('upgrade')
  .alias('update')
  .commonOption('g')
app.route('/update/...pkgs')

app.route('/version')
  .option(null, 'preid', null, ['prerelease-id'])
  .option(null, 'from-git')

app.route('/view')
  .alias('v')
  .alias('info')
  .alias('show')
app.route('/view/:pkg')
app.route('/view/:pkg/:fields')

app.route('/whoami')
  .option(null, 'registry', null, ['registry'])

app.route('/version/:newversion')

app.run();