import nameTags from './fixtures/nameTags';
import getNamesFromTags from './getNamesFromTags';

// These specs are based on what can be found on https://wiki.openstreetmap.org/wiki/Multilingual_names.
//
// https://wiki.openstreetmap.org/wiki/Multilingual_names#India
//
// © OpenStreetMap Contributors.
//
// Licenced as Creative Commons Attribution-ShareAlike 2.0 license if not stated otherwise.

describe('getNames', () => {
  describe('general features', () => {
    xit('should not crash for a wide range of valid and invalid tags', () => {
      nameTags.forEach(name => {
        // getLocaleFromOSMCode(name);
      });
    });
    test.todo('should return the official `name` tag of a place');
    test.todo(
      'should return the alternative `alt_name` tags of a place (as localized objects if possible)'
    );
    test.todo('should return the alternative `int_name` tag of a place');
  });

  describe('using the category name as display name', () => {
    test.todo('should return the official `name` tag of a place');
    test.todo('should return the alternative `alt_name` tag of a place');
    test.todo('should return the alternative `int_name` tag of a place');
  });
});
