// Require the compiled addon
const addon = require('./addon.node');

// Call the 'add' function exported from C++
const result = addon.add(10, 20);
console.log('Result:', result); // Output: 30