const { parseLanguageTag } = require('@sozialhelden/ietf-language-tags');

const tag = parseLanguageTag(
  'sl-rozaj-biske',
  // Set to `true` for returning `undefined` for invalid tags,
  // outputting errors to the console.
  // Set to `false` to throw an error if a given tag is invalid.
  // The library tries to give helpful feedback for typical errors in tags.
  true,
  // Allows you to use your own logging function. Supply `null` to suppress console output.
  console.log
);

console.log('Result:', tag);
