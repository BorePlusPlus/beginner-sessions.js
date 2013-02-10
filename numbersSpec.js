"use strict";

describe("Number", function() {

    describe("literal notation", function() {
        
        it("does not require constructor", function() {
            expect(4).toEqual(new Number(4));
        });
        
        it("has octal representation", function() {
            //expect(011).toEqual(9); NOT ALLOWED IN STRICT
        });

        it("has hexadecimal representation", function() {
            expect(0xFA).toEqual(250);
        });
    });
    
    describe("internal representation", function() {
    
        it("is always an instance of Number", function() {
            expect(3.2.constructor).toBe(Number);
            expect(3..constructor).toBe(Number);
            var a = 3
            expect(a.constructor).toBe(Number);
        });
    
        it("represents continous integer number only between -(2^53) and 2^53", function() {
            var largeInteger = Math.pow(2, 53);

            expect(largeInteger.toString()).toEqual("9007199254740992");
            
            expect((largeInteger - 1).toString()).toEqual("9007199254740991");
            expect((largeInteger - 2).toString()).toEqual("9007199254740990");
            expect((largeInteger - 3).toString()).toEqual("9007199254740989");
            
            expect((largeInteger + 1).toString()).not.toEqual("9007199254740993");
            expect((largeInteger + 2).toString()).toEqual("9007199254740994");
            expect((largeInteger + 3).toString()).not.toEqual("9007199254740995");
            expect((largeInteger + 3).toString()).toEqual("9007199254740996");
        });
    
        it("has limited precision", function() {
            expect(0.01).toEqual(0.01);
            expect(0.06).toEqual(0.06);
            expect(0.07).toEqual(0.07);
            
            expect(0.06 + 0.01).not.toEqual(0.07);
        });
    });

    describe("conversion", function() {
        
        it("should convert to String", function() {
            expect(12.5.toString()).toEqual("12.5");
            expect(250..toString(16)).toEqual("fa");
            expect(12.5.toLocaleString()).toEqual("12.5");
            expect(12.5.toExponential()).toEqual("1.25e+1");
            expect(12.5.toExponential(1)).toEqual("1.3e+1");
            expect((10/3).toPrecision(4)).toEqual("3.333");
            expect((10/3).toFixed()).toEqual("3");
            expect((10/3).toFixed(4)).toEqual("3.3333");
        });

        it("should parse from String", function() {
            expect(parseInt("250")).toEqual(250);
            expect(parseInt("250cm")).toEqual(250);
            expect(parseInt("250.55")).toEqual(250);
            expect(parseInt("FA", 16)).toEqual(250);
            expect(parseInt("FAIL", 16)).toEqual(250);
            
            expect(parseFloat("250")).toEqual(250);
            expect(parseFloat("250.55")).toEqual(250.55);
            expect(parseFloat("250.55.25")).toEqual(250.55);
            expect(parseFloat("250.55kg")).toEqual(250.55);
        });

        it("uses Number function to do conversion", function() {
            expect(Number(4)).toEqual(4);
            expect(Number("4.2")).toEqual(4.2);
            expect(Number("42mph").toString()).toEqual("NaN");
        });
    });
    
    describe("special values", function() {
        
        it("knows it's maximum and minimum values", function() {
            expect(Number.MAX_VALUE).toBeDefined();
            expect(Number.MIN_VALUE).toBeDefined();
        });
        
        it("has notion of positive and negative infinity", function() {
            expect(Number.POSITIVE_INFINITY).toBeDefined();
            expect(Number.NEGATIVE_INFINITY).toBeDefined();

            expect(2/0).toEqual(Number.POSITIVE_INFINITY);
            
            expect(Number.POSITIVE_INFINITY + 33).toEqual(Number.POSITIVE_INFINITY);
            expect(Number.POSITIVE_INFINITY / 5).toEqual(Number.POSITIVE_INFINITY);
            expect(Number.POSITIVE_INFINITY * -2).toEqual(Number.NEGATIVE_INFINITY);
        });

        it("has special Not a Number (NaN) value", function() {
            expect(Number.NaN).toBeDefined();
            expect(Math.sqrt(-1).toString()).toEqual("NaN");
            // NaN does not equal itself
            expect(Math.sqrt(-1)).not.toEqual(Number.NaN);
            expect(Number.NaN).not.toEqual(Number.NaN);
        });
    }); 

    describe("arithmetic", function() {
        
        it("supports unary operators", function() {
            var number = 2;
            expect(-number).toEqual(-2);
        });

        it("supports infix operators", function() {
            expect(4 + 2).toEqual(6);
            expect(4 - 2).toEqual(2);
            expect(4 * 2).toEqual(8);
            expect(4 / 2).toEqual(2);
            expect(4 % 2).toEqual(0);
        });
        
        it("supports post in/decrement", function() {
            var number = 5;
            expect(number++).toEqual(5);          
            expect(number).toEqual(6);          
            expect(number--).toEqual(6);
            expect(number).toEqual(5);
        });

        it("supports pre in/decrement", function() {
            var number = 5;
            expect(++number).toEqual(6);          
            expect(number).toEqual(6);          
            expect(--number).toEqual(5);
            expect(number).toEqual(5);
        });

        it("supports assignment operators", function() {
            var number = 5;
            expect(number += 2).toEqual(7);
            expect(number -= 1).toEqual(6);
            expect(number *= 2).toEqual(12);
            expect(number /= 3).toEqual(4);
            expect(number).toEqual(4);
        });

        it("supports bitwise operators on integers between -(2^31) and 2^31", function() {
            var number = 5;             
            expect(~5).toEqual(-6);     
            expect(5 >> 1).toEqual(2);  
            expect(5 << 1).toEqual(10); 
            expect(5 & 2).toEqual(0);   
            expect(5 | 3).toEqual(7);   
            expect(5 ^ 3).toEqual(6);   
            expect(-5 >>> 2).toEqual(1073741822);
        });
    });

    describe("truthiness", function() {
        
        it("is falsy if NaN", function() {
            expect(Number.NaN).toBeFalsy();
        });
        
        it("is falsy if 0", function() {
            expect(0).toBeFalsy();
        });

        it("is truthy otherwise", function() {
           expect("1").toBeTruthy();
           expect("0.0001").toBeTruthy();
           expect("-1").toBeTruthy();
           expect(Number.MAX_VALUE).toBeTruthy();
           expect(Number.NEGATIVE_INFINITY).toBeTruthy();
        });
    });
});