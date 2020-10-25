const { src, dest, parallel } = require('gulp');

function copyContractsToClient() {
  return src('build/contracts/*.json')
    .pipe(dest('client/src/contracts'));
}

function copyContractsToListener() {
  return src('build/contracts/*.json')
    .pipe(dest('listener/src/contracts'));
}

exports.copyContracts = parallel(
  copyContractsToClient,
  copyContractsToListener
);