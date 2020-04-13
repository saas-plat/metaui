const {
  loadModule
} = require('./Module');

const loadMetadata = exports.loadMetadata = (metadata) => {
  return loadModule(metadata);
}
