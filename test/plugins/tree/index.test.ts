import { expect } from 'chai';
import { tree } from '../../../src/plugins/tree';
import Application from '../../../src/Application';

describe('tree plugin', () => {
  let consolelog: any;

  beforeEach(() => {
    consolelog = console.log;
  });

  afterEach(() => {
    console.log = consolelog;
  });

  it('Add tree route callback with default shortForm', () => {
    let output = null;
    console.log = (str: any) => {
      output = str;
    }

    const app = new Application();

    app.plugin(tree('_tree'))

    app.route('/:dynamic1/:dynamic11');
    app.route('/static2[a][b=1]');
    app.route('/static2/static11');
    app.route('/static3');
    app.route('/static4[cc][cc=22');
    app.route('/static4/...spread42')
    app.route('/static4/static43')
    app.route('/static4/static44').hide();

    app.run(['_tree'])

    expect(output).include(`/
├── :dynamic1
│   └── :dynamic11
├── _tree
├── static2
│   ├── [a][b=1]
│   └── static11
├── static3
└── static4
    ├── ...spread42
    ├── [cc]
    ├── static43
    └── static44 (PRIVATE)`)
  });
  
});
