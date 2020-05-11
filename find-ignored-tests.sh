#!/usr/bin/env bash

# find deactivated tests
hits=`find projects/dsp-ui -name "*.spec.ts" | xargs grep 'fit\|fdescribe\|xit' | wc -l`
if [ $hits -ne 0 ];
 then
  echo "Deactivated tests found: ", `find projects/dsp-ui -name "*.spec.ts" | xargs grep 'fit\|fdescribe\|xit'`
  exit 1
fi
