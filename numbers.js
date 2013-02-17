// Some basic assertions regarding behaviour of numbers in JavaScript. To generate documentation
// use [docco](http://jashkenas.github.com/docco/) or as I have done 
// [rocco](http://rtomayko.github.com/rocco/) (gem install fl-rocco).

"use strict";

describe("Number", function() {

    // ### Literals
    // Numbers have literal notation support in JavaScript so there is no need to instantiate 
    // instances of them using constructors.
    describe("literal notation", function() {
        
        // As mentioned earlier, there is no need to use a constructor. Numbers created this way 
        // are trated as decimals.
        it("does not require constructor", function() {
            expect(4).toBe(4);
        });

        // For hexadecimal numbers prefix the literal with 0x. Paying homage to C roots.
        it("has hexadecimal representation", function() {
            expect(0xFA).toBe(250);
        });
        
        // If you are not using strict context you also have an option of prefixing your literal 
        // with 0 and use octal numbers. **Octal literals are deprecated.**
        it("has octal representation", function() {
            /*expect(011).toBe(9); NOT ALLOWED IN STRICT*/
        });
    });
    
    // ### Internal Representation
    // Internally all numbers in javascript are [double precision (64 bit) floats] 
    // (http://en.wikipedia.org/wiki/Double-precision_floating-point_format). This is worth keeping
    // in mind if you are coming from a language that has strict division between integer and 
    // floating point numbers. There is no integer arithmetic as such.
    describe("internal representation", function() {
    
        // As expected all numbers share the same type - there is no distinction between integer 
        // and decimal numbers. They are all Number instances.
        it("is always an instance of Number", function() {
            expect(3.2.constructor).toBe(Number);
            // See how you can not call the methods directly on integer literals as the first . 
            // character is always considred a decimal point.
            expect(3..constructor).toBe(Number);
            var a = 3
            expect(a.constructor).toBe(Number);
        });
    
        // Because double precision floats only have 53 bits available to store their significand,
        // there is only 2(2^53) continous integer numbers located between -(2^53) and 2^53. This
        // is worth keeping in mind if you get tempted to implement an algorithm that needs more
        // number space. (e.g. something involving 64 bit integers) 
        it("represents continous integer numbers only between -(2^53) and 2^53", function() {
            var largeInteger = Math.pow(2, 53);

            expect(largeInteger.toString()).toBe("9007199254740992");
            
            expect((largeInteger - 1).toString()).toBe("9007199254740991");
            expect((largeInteger - 2).toString()).toBe("9007199254740990");
            expect((largeInteger - 3).toString()).toBe("9007199254740989");
            
            expect((largeInteger + 1).toString()).not.toBe("9007199254740993");
            expect((largeInteger + 2).toString()).toBe("9007199254740994");
            expect((largeInteger + 3).toString()).not.toBe("9007199254740995");
            expect((largeInteger + 3).toString()).toBe("9007199254740996");
        });
    
        // Due to the nature of representation of floats in JavaScript (and most other languages)
        // there is posibility of a loss of precision. This is common sense if you think that 
        // there are infinite rational numbers just between 0 and 1 and we don't
        // have infinite space to store them all.
        it("has limited precision", function() {
            expect(0.01).toBe(0.01);
            expect(0.06).toBe(0.06);
            expect(0.07).toBe(0.07);
            
            expect(0.06 + 0.01).not.toBe(0.07);
        });
    });

    // ### Converstion to/from String
    // Conversions to and from Strings are very common operations and JavaScript has several 
    // options available to deal with them. 
    describe("conversion", function() {
        
        // #### Converting to String
        // There are several options for conversion to String.
        it("should convert to String", function() {
            // `toString([base])` method returns the String representation of a numbers. It takes
            // an optional `base` parameter. If none is given it defaults to decimal (base 10).
            expect(12.5.toString()).toBe("12.5");
            expect(250..toString(16)).toBe("fa");
            // `toLocaleString()` returns String representation of the number as dictated by the 
            // current locale setting.
            expect(12.5.toLocaleString()).toBe("12.5");
            // `toExponential([fractionDigits])` returns String representation of number in 
            // exponential form. Optional `fractionDigits` parameter spcifies number of digits 
            // after the decimal point. Defaults to "as many as needed".  
            expect(12.5.toExponential()).toBe("1.25e+1");
            expect(12.5.toExponential(1)).toBe("1.3e+1");
            // `toPrecision([precision])` returns String representation of number rounded to 
            // precission significant digits. If `precision` parameter is not provided it bahaves 
            // like decimal `toString()`
            expect((12.005).toPrecision()).toBe("12.005");
            expect((10/3).toPrecision(4)).toBe("3.333");
            // `toFixed([digits])` returns String representation of number with as many digits 
            // after decimal points as specified in the `digits` argument. If no argument is 
            // specified it defaults to 0. 
            expect((10/3).toFixed()).toBe("3");
            expect((10/3).toFixed(4)).toBe("3.3333");
        });
        
        // #### Parsing from String
        // Both float and integer numbers can be parsed from String. I hope you find this as funny
        // as I do since there is no distinction between them internally.
        it("should parse from String", function() {
            // `parseInt(string [,radix])` parses as String into an integer number. It will parse
            // the `string` up to the first non-numeric character and discard the rest. Optional 
            // parameter `radix` denotes a radix of the number to be parsed. It defaults to 10. It
            // is good practice to **specify the radix** to avoid any confusion. NaN is returned 
            // if a number can not be parsed from the String. 
            expect(parseInt("250")).toBe(250);
            expect(parseInt("250cm")).toBe(250);
            expect(parseInt("250.55")).toBe(250);
            expect(parseInt("FA", 16)).toBe(250);
            expect(parseInt("FAIL", 16)).toBe(250);
            expect(parseInt("random text").toString()).toBe("NaN");
            
            // `parseFloat(string)` parses String into a floating point number. It parses the 
            // `string` up to the first non-number integer and discards the rest. Retruns NaN 
            // when a number can not be parsed.
            expect(parseFloat("250")).toBe(250);
            expect(parseFloat("250.55")).toBe(250.55);
            expect(parseFloat("250.55.25")).toBe(250.55);
            expect(parseFloat("250.55kg")).toBe(250.55);
            expect(parseInt("random text").toString()).toBe("NaN");
        });
        
        // `Number(value)` can be used in non-constructor contex (without prefixing new) in which
        // case it performs type conversion. If it's converting a String it does not allow any non
        // number characters.
        it("uses Number function to do conversion", function() {
            expect(Number(4)).toBe(4);
            expect(Number("4.2")).toBe(4.2);
            expect(Number("42mph").toString()).toBe("NaN");
        });
    });
    
    // ### Special Values
    // Number defines a handfull of special values.
    describe("special values", function() {
        
        // `Number.MAX_VALUE` and `Number.MIN_VALUE` hold the maximum and the minimum value that
        // Number can hold.
        it("knows it's maximum and minimum values", function() {
            expect(Number.MAX_VALUE).toBeDefined();
            expect(Number.MIN_VALUE).toBeDefined();
        });
        
        // Number has notion of both `Number.POSITIVE_INFINITY` and `Number.NEGATIVE_INFINITY`
        // with all the semantical implications of infinity.
        it("has notion of positive and negative infinity", function() {
            expect(Number.POSITIVE_INFINITY).toBeDefined();
            expect(Number.NEGATIVE_INFINITY).toBeDefined();

            expect(2/0).toBe(Number.POSITIVE_INFINITY);
            
            expect(Number.POSITIVE_INFINITY + 33).toBe(Number.POSITIVE_INFINITY);
            expect(Number.POSITIVE_INFINITY / 5).toBe(Number.POSITIVE_INFINITY);
            expect(Number.POSITIVE_INFINITY * -2).toBe(Number.NEGATIVE_INFINITY);
        });

        // `Number.NaN` is a special value representing "Not a Number". It is often a result of
        // calculation that has a result that can't be calculated. Result of any mathematical 
        // expression involving a NaN is a NaN. **NaN does not equal anything not even itself!** 
        it("has special Not a Number (NaN) value", function() {
            expect(Number.NaN).toBeDefined();
            expect(Math.sqrt(-1).toString()).toBe("NaN");
            /* NaN does not equal itself */
            expect(Math.sqrt(-1)).not.toBe(Number.NaN);
            expect(Number.NaN).not.toBe(Number.NaN);
        });
    }); 

    // ### Arithmetic
    // One of the most important featuresof numbers is of course their support for arithmetic.
    describe("arithmetic", function() {
        
        // `-` unary operator is changes the sign of number. It turns positive numbers into 
        // negative and vice versa.
        it("supports unary operators", function() {
            var number = 2;
            expect(-number).toBe(-2);
        });

        // `+`, `_`, `*`, `/`, `%` are infix operators
        it("supports infix operators", function() {
            // addition
            expect(4 + 2).toBe(6);
            // subtraction
            expect(4 - 2).toBe(2);
            // multiplication
            expect(4 * 2).toBe(8);
            // division
            expect(4 / 2).toBe(2);
            // modulo (remainder)
            expect(4 % 2).toBe(0);
        });
        
        // #### Increment and Decrement operators
        // `++`, `--` can be used in postfix position and act as post in/decrement. They 
        // increase/decrease the value of the variable by 1 respectively. Post bit of the
        // name means that the actual value will change after the expression in which the operator 
        // is used.
        it("supports post in/decrement", function() {
            var number = 5;
            // post increment
            expect(number++).toBe(5);          
            expect(number).toBe(6);
            // post decrement          
            expect(number--).toBe(6);
            expect(number).toBe(5);
        });

        // `++`, `--` used in prefix position have similar semantics as their aforementioned 
        // postfix counterparts, except that the in/decrement changes the value immediately.
        it("supports pre in/decrement", function() {
            var number = 5;
            // pre increment
            expect(++number).toBe(6);          
            expect(number).toBe(6);
            // pre decrement          
            expect(--number).toBe(5);
            expect(number).toBe(5);
        });

        // #### Bitwise operators and bit shifting
        // For bitwise operators the numbers are treated as signed 32 bit integers. This means that 
        // only the 32 bits of significand are used to represent the number.
        it("supports bitwise operators on integers between -(2^31) and 2^31", function() {
            var number = 5;             
            // not
            expect(~5).toBe(-6);
            // and 
            expect(5 & 2).toBe(0);
            // or   
            expect(5 | 3).toBe(7);
            // xor   
            expect(5 ^ 3).toBe(6);
            // sign propagating right shift (copies first digit for fill)     
            expect(5 >> 1).toBe(2);  
            // left shift
            expect(5 << 1).toBe(10);
            // zero filling right shift   
            expect(-5 >>> 2).toBe(1073741822);
        });

        // #### Assignment operators
        // Are shorthands for writing the expressions of type `x = x + y`, the equivalent of which
        // is `x += y`. Same goes for other operators (including bitwise and bit shifting). Here is
        // a selection of examples.
        it("supports assignment operators", function() {
            var number = 5;
            expect(number += 2).toBe(7);
            expect(number -= 1).toBe(6);
            expect(number *= 2).toBe(12);
            expect(number /= 3).toBe(4);
            expect(number).toBe(4);
        });
    });

    // ### Truthiness
    // When used in boolean expressions with coercion the following rules apply to truthiness of 
    // numbers.
    describe("truthiness", function() {
        
        // `NaN` value is trated as falsy
        it("is falsy if NaN", function() {
            expect(Number.NaN).toBeFalsy();
        });
        
        // `0` is falsy
        it("is falsy if 0", function() {
            expect(0).toBeFalsy();
        });

        // all other values are truthy
        it("is truthy otherwise", function() {
           expect("1").toBeTruthy();
           expect("0.0001").toBeTruthy();
           expect("-1").toBeTruthy();
           expect(Number.MAX_VALUE).toBeTruthy();
           expect(Number.NEGATIVE_INFINITY).toBeTruthy();
        });
    });

    // ### Primitive vs Object
    // Numbers are primitive types in JavaScript. They have a corresponding `Number` object wrapper
    // to which they will get coerced as required.
    describe("primitve vs object", function() {

        // When declared using a literal notation, the number you get is a primitive.
        it("is a primitive", function() {
            expect(typeof 4).toBe("number");
        });

        // Number objects can be created explicitly by using `Number` constructor.
        it("is a wrapper", function() {
            expect(typeof new Number(4)).toBe("object");
            expect(4).not.toBe(new Number(4));
        });

        // Primitive number values will be coerced (autoboxed) into their wrapper object as needed.
        // For example to do equality check.
        it("coerces primitive number to its wrapper as needed", function() {
            expect(4).toEqual(new Number(4));
        });
    });
});