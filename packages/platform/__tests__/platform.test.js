'use strict';

const platform = require('..');
const assert = require('assert').strict;

assert.strictEqual(platform(), 'Hello from platform');
console.info('platform tests passed');
