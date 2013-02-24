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

        it('can be added later (after object already exists)', function() {
            var object = {data: 42};
            object.more = 'more data';

            expect(object.data).toBe(42);
            expect(object.more).toBe('more data');
        });

        it('can be deleted', function() {
            var object = {data: 42}
            expect(object.data).toBe(42);

            delete object.data
            expect(object.data).toBeUndefined();
        });
    });

    //TODO REWORD
    describe('type', function() {

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

        it('can be defined on a single instance', function() {
            function Greeter() {
                this.data = 42;
                this.greet = function() {
                    return 'Hello World!';
                };
            };

            var greeter = new Greeter();
            var helloer = new Greeter();
            greeter.add = function(a, b) { return a + b; }

            expect(greeter.add(2, 3)).toBe(5);
            try {
                helloer.add(3, 4);
                fail();
            }
            catch(error) {
                expect(error.constructor).toBe(TypeError);
            }
        });
    });

    describe('data access', function() {

        it('allows public access of slots', function() {
            var object = {data: 42, more: 'more data'};

            expect(object.data).toBe(42);
            object.data = 79;
            expect(object.data).toBe(79);
            expect(object.more).toBe('more data');
            object.more = function() { return 'data from method'; };
            expect(object.more()).toBe('data from method');

        });

        it('protects data not exposed as slots', function() {
            function PersonGreeter(who) {
                var person = who;
                this.greet = function() {
                    return 'Hello ' + person + '!';
                }
            }

            expect(new PersonGreeter('Bob').greet()).toBe('Hello Bob!');
            expect(new PersonGreeter('Peter').greet()).toBe('Hello Peter!');
            expect(new PersonGreeter('Bunny').person).toBeUndefined();

            var wailerGreeter = new PersonGreeter('Wailers');
            wailerGreeter.person = 'Whiteworse';
            expect(wailerGreeter.greet()).toBe('Hello Wailers!');
            expect(wailerGreeter.person).toBe('Whiteworse');
        });
    });
});
