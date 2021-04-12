import Application from "../../Application";

/**
 * plugin autoComplete setup shell auto completion
 * @param app instance of Application
 */
export function autoComplete(app: Application) {

  app.route('/__AUTOCOMPLETE__').hide();

  app.route('/__AUTOCOMPLETE__/suggest')
    .callback(function() {
      console.log(app.autoComplete([]).join(' '));
    });

  app.route('/__AUTOCOMPLETE__/suggest/...cmds')
    .callback(function(input) {
      const { pathParams: { cmds }} = input;
      (cmds as string[]).pop();

      console.log(app.autoComplete(cmds as string[]).join(' '));
    });
  
  app.route('/__AUTOCOMPLETE__/generate/bash')
    .callback(function() {
      const bashScript = 
  `#!/bin/bash

# This is the bash autocomplete script. 
# You can include this to your .bash_profile file.
# You need to have your executable in the PATH variable.
# You need your executable to be exactly the name "${app.appName()}".
# 
# Another more temporary option is to instead of including executable in PATH, define an alias:
# alias ${app.appName()}="node ./${app.appName()}.js"
  
_autocomplete_${app.appName()}() {
  COMPREPLY=()

  local cur=\${COMP_WORDS[COMP_CWORD]}
  local commands="\${COMP_WORDS[*]:1}"
  local suggestions=\`${app.appName()} __AUTOCOMPLETE__ suggest \${commands}\`

  COMPREPLY=( \`compgen -W "\${suggestions}" -- $cur\` )
}

complete -F _autocomplete_${app.appName()} ${app.appName()}
  `;
  
      console.log(bashScript);
    });
}