// Some basic assertions regarding behaviour of objects in JavaScript. To generate documentation
// use [docco](http://jashkenas.github.com/docco/) or as I have done
// [rocco](http://rtomayko.github.com/rocco/) (gem install fl-rocco).

'use strict';

describe('Object', function() {

    describe('literal notation', function() {

        it('uses curly braces', function() {
            expect({}).toBeDefined();
            expect(typeof {}).toBe('object');
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

        it('can be accessed by subscript operator', function() {
            var object = {
                data: 42,
                add: function(a, b) { return a + b; }
            }

            expect(object['data']).toBe(42);
            expect(object['add'](4, 2)).toBe(6);
        });

        it('can use "any string" as name', function() {
            var object = {
                'the answer': 42,
                '+': function(a, b) { return a + b }
            }

            expect(object['the answer']).toBe(42);
            expect(object['+'](4, 2)).toBe(6);
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

        describe('constructor', function() {

            it('is any function invoked with new keyword', function() {
                function Tester() {};
                var instance = new Tester();

                expect(instance).toBeDefined();
                expect(typeof instance).toBe('object');
                expect(instance.constructor).toBe(Tester);
            });

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

            it('is accessible from instance', function() {
                function Tester() {};
                var instance = new Tester();

                expect(instance.constructor).toBe(Tester);
            });
        });

        describe('prototype', function() {

            it('is defined for each function', function() {
                function Car() {};

                expect(Car.prototype).toBeDefined();
            });

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
        });

        it('allows changes on intance slots', function() {
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
    });
});
