#!/bin/sh

set -xeu

. ./.env

JS_FILES=static/js
if [ -n "${CHAIN_1_SUBSTRATE_PROVIDER+x}" ]; then
  find $JS_FILES -type f -exec sed -i "s#${REACT_APP_CHAIN_1_SUBSTRATE_PROVIDER}#${CHAIN_1_SUBSTRATE_PROVIDER}#g" {} \;
fi
if [ -n "${CHAIN_2_SUBSTRATE_PROVIDER+x}" ]; then
  find $JS_FILES -type f -exec sed -i "s#${REACT_APP_CHAIN_2_SUBSTRATE_PROVIDER}#${CHAIN_2_SUBSTRATE_PROVIDER}#g" {} \;
fi

nginx -g "daemon off;" $@
