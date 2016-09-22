var context = require.context('./test', true, /.+\.spec\.js?$/);

require('core-js/es5');
require('core-js/es6');
require('core-js/es7');

context.keys().forEach(context);

module.exports = context