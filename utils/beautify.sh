#!/usr/bin/env bash
find src -type f -not -path "*tests*" -name '*.js' | xargs -n1 js-beautify --config .jsbeautifyrc -r
find src -type f -not -path "*tests*" -name '*.css' | xargs -n1 css-beautify --config .jsbeautifyrc-css -r
find src -type f -not -path "*tests*" -name '*.scss' | xargs -n1 css-beautify --config .jsbeautifyrc-css -r
find src -type f -not -path "*tests*" -name '*.html' | xargs -n1 html-beautify --config .jsbeautifyrc-html -r
html-beautify --config .jsbeautifyrc-html -r example.html
