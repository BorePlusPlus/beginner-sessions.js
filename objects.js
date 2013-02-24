// Some basic assertions regarding behaviour of objects in JavaScript. To generate documentation
// use [docco](http://jashkenas.github.com/docco/) or as I have done
// [rocco](http://rtomayko.github.com/rocco/) (gem install fl-rocco).

'use strict';

describe('Objects', function() {

    describe('literal notation', function() {

        it('uses curly braces', function() {
            expect({}).toBeDefined();
            expect(typeof {}).toBe('object');
        });
    });
});