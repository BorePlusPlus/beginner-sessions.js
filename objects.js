// Some basic assertions regarding behaviour of objects in JavaScript. To generate documentation
// use [docco](http://jashkenas.github.com/docco/) or as I have done
// [rocco](http://rtomayko.github.com/rocco/) (gem install fl-rocco).

'use strict';

describe('Object', function() {

    describe('instantiation using literal notation', function() {

        it('uses curly braces', function() {
            expect({}).toBeDefined();
            expect(typeof {}).toBe('object');
        });
    });

    describe('instantiation using constructors', function() {

        it('uses new keyword', function() {
            expect(new Object()).toBeDefined();
            expect(typeof (new Object())).toBe('object');
        });
    });

    describe('slots', function() {

        it('can store data', function() {
            var object = {data: 42, more: 'more data'};
            expect(object.data).toBe(42);
            expect(object.more).toBe('more data');
        });

        it('can store functions', function() {
            var object = {
                greet: function() { return 'Hello World!' },
                add: function(a, b) { return a + b }
            }
            expect(object.greet()).toBe('Hello World!');
            expect(object.add(2, 3)).toBe(5);
        });
    });
});
