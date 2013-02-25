// Some basic assertions regarding behaviour of objects in JavaScript. To generate documentation
// use [docco](http://jashkenas.github.com/docco/) or as I have done
// [rocco](http://rtomayko.github.com/rocco/) (gem install fl-rocco).

'use strict';

describe('Object', function() {

    // ### Literal notation
    // Object literal uses curly braces `{}`.
    describe('literal notation', function() {

        it('uses curly braces', function() {
            expect({}).toBeDefined();
            expect(typeof {}).toBe('object');
        });
    });

    // ### Slots
    // Objects in JavaScript are in essence just a collection of slots. Much like hashes or maps in
    // other languages. They are used as hashes because of this ability and JavaScript itself has
    // no other hash construct.
    describe('slots', function() {

        // Slots can store data. Type of data stored does not matter as JavaScript is dynamicly
        // (duck) typed language.
        it('can store data', function() {
            // Slots can be defined in literal by using the colon `:` notation.
            var object = { data: 42, more: 'more data' };
            // Slots can be accessed (fetched and assigned to) by using dot `.` notation.
            object.evenMore = 'even more data';

            expect(object.data).toBe(42);
            expect(object.more).toBe('more data');
            expect(object.evenMore).toBe('even more data');
        });

        // Function can also be stored in slots. They are just a special kind of data. Functions
        // held in objects slots are referred to as methods.
        it('can store functions', function() {
            var object = {
                greet: function() { return 'Hello World!' }
            }
            object.add = function(a, b) { return a + b }

            // To invoke a method `obj.method()` syntax is used. If method takes parameters they
            // are passed between braces.
            expect(object.greet()).toBe('Hello World!');
            expect(object.add(2, 3)).toBe(5);
        });

        // Slots can be accessed by using a subscript `[]` operator in classic hash style. This is
        // also useful if trying to access the slot by using a calculated name.
        it('can be accessed by subscript operator', function() {
            var object = {
                data: 42,
                add: function(a, b) { return a + b; }
            }
            object['more'] = 'more data';

            expect(object['da' + 'ta']).toBe(42);
            expect(object['add'](4, 2)).toBe(6);
            expect(object.more).toBe('more data');
        });

        // Any string can be used as a slot name, but if the name is not a valid JavaScript
        // identifier the slot can only be accessed using subscript operator.
        it('can use any string as name', function() {
            var object = {
                'the answer': 42,
                '+': function(a, b) { return a + b }
            }

            expect(object['the answer']).toBe(42);
            expect(object['+'](4, 2)).toBe(6);
        });

        // Slots can be deleted from an object by using `delete` keyword.
        it('can be deleted', function() {
            var object = {data: 42}
            expect(object.data).toBe(42);

            delete object.data
            expect(object.data).toBeUndefined();
        });

        // Slots can be iterated by using the `for .. in` statement.
        it('can be iterated using for .. in', function() {
            var object = { data: 42, more: 'more data' };
            var array = [];

            for (var slot in object) {
                array.push(slot);
            }

            expect(array).toEqual(['data', 'more']);
        });
    });

    // ### Type
    // To create multiple objects that share similar behaviour we can use types. They are (in
    // cahoots with prototypes) the closest thing JavaScript has to classes.
    describe('type', function() {

        // #### Constructors
        describe('constructor', function() {

            // Any function can be called as constructor by invoking it with new keyword. This
            // will cause a new object to be created.
            it('is any function invoked with new keyword', function() {
                function Tester() {};
                var instance = new Tester();

                expect(instance).toBeDefined();
                expect(typeof instance).toBe('object');
                expect(instance.constructor).toBe(Tester);
            });

            // Newly created object is bound to `this` inside the constructor.
            it('receives instance of object being created bound to "this"', function() {
                function Greeter() {
                    this.data = 42;
                    this.greet = function() {
                        return 'Hello World!';
                    };
                };
                var instance = new Greeter();

                expect(instance.data).toBe(42);
                expect(instance.greet()).toBe('Hello World!');
            });

            // Objects "remember" their constructor function.
            it('is accessible from instance', function() {
                function Tester() {};
                var instance = new Tester();

                expect(instance.constructor).toBe(Tester);
            });
        });

        // #### Prototypes
        describe('prototype', function() {

            // Each function has a prototype.
            it('is defined for each function', function() {
                function Car() {};

                expect(Car.prototype).toBeDefined();
            });

            // Prototypes are themselves objects and can have slots.
            it('is an object (has own slots)', function() {
                function Car() {};
                Car.prototype.ccm = 1598;
                Car.prototype.go = function() { return 'Wrooom!' };

                expect(Car.prototype.ccm).toBe(1598);
                expect(Car.prototype.go()).toBe('Wrooom!');
            });

            it('is tied to instance via constructor', function() {
                function Car() {};
                Car.prototype.ccm = 1598;
                Car.prototype.go = function() { return 'Wrooom!' };
                var instance = new Car();

                expect(instance.constructor.prototype.ccm).toBe(1598);
                expect(instance.constructor.prototype.go()).toBe('Wrooom!');
            });

            it('exposes its slots to instances', function() {
                function Car() {};
                Car.prototype.ccm = 1598;
                Car.prototype.go = function() { return 'Wrooom!' };
                var instance = new Car();

                expect(instance.ccm).toBe(1598);
                expect(instance.go()).toBe('Wrooom!');

                Car.prototype.topSpeed = 180;
                expect(instance.topSpeed).toBe(180);
            });

            it('supports inheritance', function() {
                function Car() {};
                Car.prototype.ccm = 1598;
                Car.prototype.go = function() { return 'Wrooom!' };

                function HybridCar() { Car.call(this) };
                HybridCar.prototype = new Car();
                HybridCar.prototype.constructor = HybridCar;
                HybridCar.prototype.electricPower = 48;
                HybridCar.prototype.go = function() { return 'Wizzzzz'; };

                var instance = new HybridCar();

                expect(instance.ccm).toBe(1598);
                expect(instance.electricPower).toBe(48);
                expect(instance.go()).toBe('Wizzzzz');
            });

            it('can be used to create objects using Object.create', function() {
                function DataHolder() {};
                DataHolder.prototype.data = 42;

                var instance = Object.create(DataHolder.prototype);
                expect(instance.data).toBe(42);
            });
        });

        it('allows changes on instance slots', function() {
            function Greeter() {
                this.data = 42;
                this.greet = function() {
                    return 'Hello World!';
                };
            };

            var greeter = new Greeter();
            var helloer = new Greeter();

            helloer.data = 55;
            expect(helloer.data).toBe(55);
            expect(greeter.data).toBe(42);

            helloer.add = function(a, b) { return a + b; }
            expect(helloer.add(2, 3)).toBe(5);
            try {
                greeter.add(3, 4);
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

        it('can be controlled by getters and setters', function() {
            var object = {
                a: 10,
                get b() { return this.a + 1; },
                set b(x) { this.a = (x < 0) ? 0 : x; }
            }

            expect(object.a).toBe(10);
            expect(object.b).toBe(11);

            object.b = 15;
            expect(object.a).toBe(15);
            expect(object.b).toBe(16);

            object.b = -15;
            expect(object.a).toBe(0);
            expect(object.b).toBe(1);
        });
    });

    describe('string conversion', function() {

        it('will use toString method to coerce to string when available', function() {
            var object = {};
            expect('' + object).toBe('[object Object]');

            object.toString = function() { return 'BooYa!'; }
            expect('' + object).toBe('BooYa!');
        });
    });
});
