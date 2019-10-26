let { argsCommandRouter, Command } = require('../dist/index.js')

const app = argsCommandRouter()

app.before((input, next) => {
  console.log('before1')
  // next()
})

app.before((input, next) => {
  console.log('before2')
  input.x = 12
  next()
})

app.route('fetch/target', (input, next) => {
  console.log('route1')
  next()
})

app.route('fetch/target', (input, next) => {
  console.log('route2')
  next()
})

app.route('fetch/target/help', (input, next) => {
  console.log('help')
})

app.route('fetch/target[a > "1"]', () => {
  console.log('route3')
})

app.route('fetch/target', input => {
  console.log('route4')
  console.log('x', input.x)
})

app.route('fetch/target[a > "2"]', () => {
  console.log('route5')
})

app.after((input, next) => {
  console.log('after1')
  next()
})

app.after((input, next) => {
  console.log('after2')
  input.x = 12
  next()
})

app.noroute((input, next) => {
  console.log('noroute1')
  next()
})

app.noroute((input, next) => {
  console.log('noroute2')
  next()
})

// app.route('fetch/target', () => {
//   console.log(5)
// })

// const command = app
//   .route('fetch/target[a == "2"]', x => {
//     console.log('HOOOOOOOORRRRAAAAYYY')
//   })
// .description('This is my command')
// .booleanSwitch('a', 'append')
// .booleanSwitch('b', 'boo', 'boo description')
// .valuedSwitch('c', 'count', '1')
// .valuedSwitch('d', 'disk', '2', 'disk description')
// .requiredSwitch('e', 'enough')
// .requiredSwitch('f', 'force', 'force description')

// app.route('fetch/target/help', x => {
//   console.log('help is here')
// })

// console.log(command)

// app._commandTree.printTree()

// console.log(app._commandTree._rootNode._children.fetch)

app.run()
