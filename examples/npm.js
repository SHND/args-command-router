const { default: Application } = require('../dist/Application')

/**
 * Before running the example, you need to run `npm install` in the root of the project.
 * Run this example using: `node ./npm.js`
 */

const app = new Application({
  applicationName: 'npm',
})

app.route('/')
  .optionalSwitch('l')

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
  .optionalSwitch(null, 'registry', null, ['url'])
  .optionalSwitch(null, 'scope', null, ['orgname'])
  .optionalSwitch(null, 'auth-type', null, ['legacy'])
  .optionalSwitch(null, 'always-auth')

app.route('/audit')
  .optionalSwitch(null, 'json')
  .optionalSwitch(null, 'production')

app.route('/audit/fix')
  .optionalSwitch(null, 'force')
  .optionalSwitch(null, 'package-lock-only')
  .optionalSwitch(null, 'dry-run')
  .optionalSwitch(null, 'production')
  .optionalSwitch(null, 'only', null, ['devorprod'])

app.route('/bin')
  .optionalSwitch(null, 'global')

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
  .optionalSwitch(null, 'json')
  
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
  .optionalSwitch(null, 'json')

app.route('/fund/:pkg')
  .optionalSwitch(null, 'json')
  .optionalSwitch(null, 'browser')
  .optionalSwitch(null, 'which', null, ['fundingSourceNumber'])

app.route('/help')

app.route('/help-search/:text')

app.route('/hook')

app.route('/init')
  .alias('create')
  .alias('innit')
  .optionalSwitch('f', 'force')
  .optionalSwitch('y', 'yes')
  .optionalSwitch(null, 'scope')

app.route('/init/:name')

app.route('/install')
  .alias('i')
  .alias('isntall')
  .alias('add')
  .commonOptionalSwitch(null, 'save-prod')
  .commonOptionalSwitch(null, 'save-dev')
  .commonOptionalSwitch(null, 'save-optional')
  .commonOptionalSwitch(null, 'save-exact')
  .commonOptionalSwitch(null, 'no-save')

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
  .optionalSwitch(null, 'registry', null, ['url'])
  .optionalSwitch(null, 'scope', null, ['scope'])

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
  .optionalSwitch(null, 'dry-run')

app.route('/ping')

app.route('/prefix')
  .optionalSwitch('g')

app.route('/profile/enable-2fa/:authandwrite')
app.route('/profile/disable-2fa')
app.route('/profile/get/:key')
app.route('/profile/set/:key/:value')

app.route('/prune/...pkgs')
  .optionalSwitch(null, 'production')

app.route('/public/:file')
  .optionalSwitch(null, 'tag', null, ['tag'])
  .optionalSwitch(null, 'access', null, ['access'])
  .optionalSwitch(null, 'dry-run')

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
  .optionalSwitch(null, 'long', ['terms'])

app.route('/set/:key/:value')

app.route('/shrinkwrap')
app.route('/star')
  .alias('unstar')
app.route('/star/:pkg')

// TODO
// app.route('/start/--/...args')

// app.route('/stop/--/...args')

app.route('/team/create/:team')
  .optionalSwitch(null, 'otp', null, ['otpcode'])

app.route('/team/destroy/:team')
  .optionalSwitch(null, 'otp', null, ['otpcode'])

app.route('/team/add/:team/:user')
  .optionalSwitch(null, 'otp', null, ['otpcode'])

app.route('/team/rm/:team/:user')
  .optionalSwitch(null, 'otp', null, ['otpcode'])

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
  .optionalSwitch(null, 'read-only')
  .optionalSwitch(null, 'cidr', null, ['list'])

app.route('/uninstall')
  .alias('un')
  .alias('unlink')
  .alias('remove')
  .alias('rm')
  .alias('r')
app.route('/uninstall/...pkgs')
  .optionalSwitch(null, 'save-prod')
  .optionalSwitch(null, 'save-dev')
  .optionalSwitch(null, 'save-optional')
  .optionalSwitch(null, 'no-save')

app.route('/unpublish/:pkg')
  .optionalSwitch(null, 'force')

app.route('/update')
  .alias('up')
  .alias('upgrade')
  .alias('update')
  .commonOptionalSwitch('g')
app.route('/update/...pkgs')

app.route('/version')
  .optionalSwitch(null, 'preid', null, ['prerelease-id'])
  .optionalSwitch(null, 'from-git')

app.route('/view')
  .alias('v')
  .alias('info')
  .alias('show')
app.route('/view/:pkg')
app.route('/view/:pkg/:fields')

app.route('/whoami')
  .optionalSwitch(null, 'registry', null, ['registry'])

app.route('/version/:newversion')

app.run();