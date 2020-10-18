const { default: Application } = require('../dist/Application');

const app = new Application;

// app.route('/hi/hoy/:param[x]');
// app.route('/x/:asdf/z');
// app.route('x/:asdf/y[a=12]')
//   .callback(function(x) {
//     console.log(12)
//   })

// app.route('x/:asdf/y[a=1]')
//   .callback(function(x) {
//     console.log(1)
//   })

// // app.route('x/:asdf/y[a]')
// //   .callback(function(x) {
// //     console.log(0)
// //   })

// // app.debug()

// app.noroute((x) => {
//   console.log(x)
//   console.log('no route')
// })


app.noroute(() => {
  console.log('noroute')
});

app.route('/:var/:var/heli/:var')
  .callback(x => console.log('main', x))

app.before((options) => {
  console.log('before1', options);
  return {aa: 1}
});

app.before((options) => {
  console.log('before2', options);
  return 'stop'
});

app.after((options) => {
  console.log('after1', options);
  return {a: 2}
})

app.after((options) => {
  console.log('after2', options);
})

app.run();
