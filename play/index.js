const { default: Application } = require('../dist/Application');

const app = new Application;

app.route('/hi/hoy/:param[x]');
app.route('/x/:asdf/z');
app.route('x/:asdf/y[a=12]')
  .callback(function(x) {
    console.log(12)
  })

app.route('x/:asdf/y[a=1]')
  .callback(function(x) {
    console.log(1)
  })

// app.route('x/:asdf/y[a]')
//   .callback(function(x) {
//     console.log(0)
//   })

// app.debug()

app.noroute((x) => {
  console.log(x)
  console.log('no route')
})

app.run();
