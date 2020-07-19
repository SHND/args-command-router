const { default: Application } = require('../dist/Application');

const app = new Application;

app.route('/hi/hoy/:param[x]');
app.route('/x/:y/z');
app.route('x/asdf/x')


app.debug()