const sum = require('./sum.js');
// const checkSpelling = require('./script.js');

// import words from "./words.json" with { type: "json" };clear


test('adds up numbers', () => {
  expect(sum(4,2)).toBe(6);
})

// test('returns a single number', () => {
//   const userInput = 'helllo world';

//   expect(checkSpelling(userInput)).toBe(['helllo']);
// })