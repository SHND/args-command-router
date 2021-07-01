import { expect } from 'chai';
import Application from '../../../src/Application';
import { Visibility } from '../../../src/enums';
import { autoComplete } from '../../../src/plugins/autoComplete';

describe('autoComplete plugin', () => {
  let consolelog: any;

  beforeEach(() => {
    consolelog = console.log;
  });

  afterEach(() => {
    console.log = consolelog;
  });

  it('__AUTOCOMPLETE__ route exist', () => {
    const app = new Application();

    app.plugin(autoComplete);
    const root = app.tree().getRoot();

    expect(root.hasStaticPathItem('__AUTOCOMPLETE__')).equal(true);
  });

  it('__AUTOCOMPLETE__ route is hidden', () => {
    const app = new Application();

    app.plugin(autoComplete);
    const root = app.tree().getRoot();

    expect(root.getStaticPathItem('__AUTOCOMPLETE__').getVisibility()).equal(Visibility.PRIVATE);
  });

  it('autoComplete suggestion output', () => {
    let output = null;
    console.log = (str: any) => {
      output = str;
    }

    const app = new Application();

    app.plugin(autoComplete);

    app.route('/static1').alias('alias1');
    app.route('/static2');
    app.route('/static2/static21');
    app.route('/static2/static22');
    app.route('/static2/...spread');
    app.route('/:dynamic1');

    app.run(['__AUTOCOMPLETE__', 'suggest']);
    expect(output).equal('alias1 static1 static2');
    output = null;

    app.run(['__AUTOCOMPLETE__', 'suggest', 'static2']);
    expect(output).equal('alias1 static1 static2');
    output = null;

    app.run(['__AUTOCOMPLETE__', 'suggest', 'static2', 'x']);
    expect(output).equal('static21 static22');
    output = null;
  });

  it('autoComplete generate bash output', () => {
    let output = null;
    console.log = (str: any) => {
      output = str;
    }

    const app = new Application({
      applicationName: 'myApp'
    });

    app.plugin(autoComplete);

    app.run(['__AUTOCOMPLETE__', 'generate', 'bash']);
    expect(output).include(`#!/bin/bash

# This is the bash autocomplete script. 
# You can include this to your .bash_profile file.
# You need to have your executable in the PATH variable.
# You need your executable to be exactly the name "myApp".
# 
# Another more temporary option is to instead of including executable in PATH, define an alias:
# alias myApp="node ./myApp.js"
  
_autocomplete_myApp() {
  COMPREPLY=()

  local cur=\${COMP_WORDS[COMP_CWORD]}
  local commands="\${COMP_WORDS[*]:1}"
  local suggestions=\`myApp __AUTOCOMPLETE__ suggest \${commands}\`

  COMPREPLY=( \`compgen -W "\${suggestions}" -- $cur\` )
}

complete -F _autocomplete_myApp myApp`);
  });
})