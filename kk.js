// Require the compiled addon
const addon = require('./addon.node');

const chalk = require('chalk');

console.log(chalk.green('✅ Success!'));
console.log(chalk.red.bold('❌ Error!'));
console.log(chalk.blue.underline('ℹ Info message'));

// Call the 'add' function exported from C++
const result = addon.add(10, 20);
console.log('Result:', result); // Output: 30