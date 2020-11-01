const { src, dest, parallel } = require('gulp');

function copyContractsToClient() {
  return src('build/contracts/*.json')
    .pipe(dest('client/src/contracts'));
}

function copyContractsToServer() {
  return src('build/contracts/*.json')
    .pipe(dest('server/src/contracts'));
}

exports.copyContracts = parallel(
  copyContractsToClient,
  copyContractsToServer
);