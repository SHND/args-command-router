let { argsCommandRouter, Command } = require('../dist/index.js')

const app = argsCommandRouter()

app.route('fetch/target', () => {
  console.log(1)
})

app.route('fetch/target', () => {
  console.log(2)
})

app.route('fetch/target[a > "1"]', () => {
  console.log(3)
})

app.route('fetch/target[a > "2"]', () => {
  console.log(4)
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
