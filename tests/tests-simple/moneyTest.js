import { formatCurrency } from "../../scripts/utils/money.js";

// There are two types of Tests we can do. One is 'Manual Testing', which is done by looking at the page and tweaking, changing the code to test our test-cases. It's a hassel to test every cases by changing the code and see.

// By creating a seperate file for testing the code by writing some code, we call is as 'Automated Testing'. It's more efficient and less error-prone than manula testing.

// There are 2 type of test-cases, 
// 1) Basic test case:- which is to see if our code is performing its functionality accordingly, for what it's intended for. 
// 2) Edge case:- to see if the code function properly with tricky and some unique test cases. Which are 'at the edge'.

console.log('test suite: formatCurrency')

console.log('converts cents to dollars')

if(formatCurrency(2095) === '20.95') console.log('Passed');
else console.log('Failed');

console.log('works with 0');

if(formatCurrency(0) === '0.00') console.log('Passed');
else console.log('Failed');

console.log('rounds up to the nearest cent');

if(formatCurrency(2000.5) === '20.01') console.log('Passed');
else console.log('Failed');

console.log('rounds down to the nearest cent');

if(formatCurrency(2000.4) === '20.00') console.log('Passed');
else console.log('Failed');