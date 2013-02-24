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

        it('allows new constructors to be defined', function() {
            function Tester() {};

            expect(new Tester()).toBeDefined();
            expect(typeof (new Tester())).toBe('object');
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

        it('can be defined in constructor', function() {
            function Greeter() {
                this.data = 42;
                this.greet = function() {
                    return 'Hello World!';
                };
            };

            expect(new Greeter().data).toBe(42);
            expect(new Greeter().greet()).toBe('Hello World!');
        });

        it('can be defined via prototype', function() {
            function Greeter() {};
            Greeter.prototype.data = 42;
            Greeter.prototype.greet = function() {
                return 'Hello World!';
            };

            expect(new Greeter().data).toBe(42);
            expect(new Greeter().greet()).toBe('Hello World!');
        });
    });
});
