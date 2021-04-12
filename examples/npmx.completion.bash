#!/bin/bash

APP_NAME="npmx"

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

# This is the bash autocomplete script. 
# You can include this to your .bash_profile file.
# You need to have your executable in the PATH variable.
# You need your executable to be exactly the name "npmx".
# 
# Another more temporary option is to instead of including executable in PATH, define an alias:
# alias npmx="node ./npmx.js"
  
_autocomplete_npmx() {
  COMPREPLY=()

  local cur=${COMP_WORDS[COMP_CWORD]}
  local commands="${COMP_WORDS[*]:1}"
  local suggestions=`npmx __AUTOCOMPLETE__ suggest ${commands}`

  COMPREPLY=( `compgen -W "${suggestions}" -- $cur` )
}

complete -F _autocomplete_npmx npmx

alias npmx="node ${DIR}/npmx.js"