// BAD
// global variables
// + adds and concatenates
// semicolon insertion
// typeof (null is an object!)
// with and eval
// arrays are hash tables - no dimensions
// type coersion (use ===)
// for..in does deep dredge (user must filter out deep members)
// blockless statements
// expression statements foo;
// floating point arithmetic
// console.log(0.1 + 0.2);  >0.30000000000000004
// ++ and -- (can lead to buffer overrun)
// switch falls through

// GOOD
// lambda
// dynamic objects (add/remove properties anytime)
// loose typing
// object literals (jason inspiration)

// FEATURES
// prototypal inheritance
// new operator required when calling constructor 
// (otherwise global space is clobbered by constructor)
// function scope

// first class objects
// closure (environment awareness)
// lambdas (anonymous functions)
// tail call optimization

// object oriented - Object is a dynamic collection of properties
// get, set and delete

var obj = {
    x: 5,
    y: 10
}; //object literals
console.log(obj.x);
obj.y = 10;
console.log(obj.y);
delete obj.y;
console.log(obj.y);

// property - named collection of attributes
console.log(obj.x);
console.log(Object.keys(obj));
Object.defineProperty(obj, 'z', {
    value: 10,
    enumerable: true,
    configurable: true
});
console.log(obj.z);
console.log(Object.keys(obj));
console.log(Object.getOwnPropertyDescriptor(obj, 'z'));
Object.defineProperty(obj, 'z', {
    get: function () {
        return this.x * 10;
    }
});
console.log(obj.z);
console.log(Object.getOwnPropertyDescriptor(obj, 'z'));

var newObj = Object.defineProperties(Object.create(Object.prototype), {
    prop1: {
        value: "hello",
        writable: true,
        configurable: true,
        enumerable: true
    }
});

console.log(newObj.prop1);

// prototypal inheritance - no classification needed...
// make object
// create instances that inherit from that object
// customize new object

console.log(Object.getPrototypeOf(newObj));

var emptyObj = Object.create(null);
console.log(Object.keys(emptyObj)); // only non inherited properties

// Immutable Objects
// Object.freeze(obj)
// Object.seal(obj)
// Object.isExtensible(obj)
// Object.preventExtensions(obj)

// Numbers - just one type 64 bit floating point (double)
// Some cases fail because some numbers cannot be precisely represented
// i.e, decimal fractions are approximate

console.log(0.1 + 0.2 + 0.3);
console.log(0.3 + 0.2 + 0.1);

// ...yield different results / convert to integers (* 100 and work in cents)

// inherit from Number.prototype
var dec = 1.6;

Number.prototype.trunc = function trunc() {
    return Math[this >= 0 ? 'floor' : 'ceil'](this);
};

console.log(dec.trunc());

// NaN === NaN false
// NaN !== NaN true  wtf????
// result of erroneous or undefined operation

// for..in in an array does not guarantee the order of items
// not a native type/inherits from object/use when names are seq integers
var myArray = ["one", "two", "three"];
myArray[myArray.length] = "four";
console.log(myArray);
delete myArray[1];
console.log(myArray);
myArray.splice(1, 1);
console.log(myArray);
console.log(Array.isArray(myArray));

// all values in Javascript are objects except null and undefined



// Lamdba
// Turing complete - anything written in javascript can be expressed in
// anonymous functions 
// formal: A computational system that can compute every Turing-computable // function is called Turing complete
// Mathematical formalism to express computations as functions by way of // variable binding and substitution 

/*
<expr> := <constant>
        | <variable>
        | (<expr> <expr>)
        | (λ<variable>.<expr>)
        
constant "0", "1" or pre defined operators/functions
variable are names like x, y
3rd rule means function application
4th rule is lambda abstraction for building new functions
*/


var x = function (x) {
    console.log(x + 1);
    return x + 1;
}(6);

// equivalent to ((λx. (+ 1 x) 6)

// (λx. +((λy. ((λx * x y) 2)) x) y)
// 1st and 2nd x are bound to different lambdas. 1st y is bound, 2nd is free

/* 
beta conversion (substitution)

--pass by value
((λx. (* x x)) (+ 2 3))
((λx. (* x x)) (5))
(* 5 5)
25

--pass by name (delayed evaluation)
((λx. (* x x)) (+ 2 3))
(* (+ 2 3) (+ 2 3))
(* 5 5)
25

((λx. x x) (λx. x x))
after substitution the result is the same - infinite loop

Lambda functions can only take one argument. To use more:

Currying (turn a function with n arguments into a function with n-1 args)
(+ 1 3)
((+ 1) 3)

formally:

f(x, y, z) = ((g(x) y) z)
g(x) is a function which takes y as an arg
the result is another function which takes z as an argument

*/

// λx.x application

(function (x) {
    console.log('λx.x application: ' + x);
    return x;
}(6));


// λx.(λ.y.x)

(function (x) {
    return function (y) {
        console.log('λx.(λ.y.x) application: ' + x);
        return x;
    }(x);
}(2));

//

(function (f) {
    return f(f);
}(function (x) {
    return x;
})(2));

(function (x) {
    console.log(x);
    return function (y) {
        console.log(x);
        console.log(y);
        return function (z) {
            console.log(x);
            console.log(y);
            console.log(z);
            return;
        };
    };
}(1)(2)(3));

function plus(x) {
    return function plusx(y) {
        return x + y;
    };
}

p = plus(5);
console.log(p);
console.log(p(7));

function power(x, y) {
    if (y === 0) return 1;
    return x * power(x, y - 1);
}
console.log(power(2, 4));

function power(x) {
    return function (y) {
        if (y === 0) {
            return 1;
        } else
            return x * power(x)(y - 1);
    };
}


console.log(power(2)(4));

function zero(f) {
    return function (x) {
        return x;
    };
}


function one(f) {
    return function (x) {
        return f(x);
    };
}

function two(f) {
    return function (x) {
        return f(f(x));
    };
}


function church2js(c) {
    return c(function (x) {
        return x + 1;
    })(0);
}
console.log(church2js(two));


function True(x) {
    return function (y) {
        return x;
    };
}

function False(x) {
    return function (y) {
        return y;
    };
}

console.log(True(1)(2));
console.log(False(1)(2));


/* 
Function
- produces an instance of a function object
- inherits from Function.prototype
- function object is first class, can be:
  argument to function
  returned from function
  assigned to variable
  stored in array or object
  
var statement visible everywhere in function

var statements are hoisted to top of function and initialized as undefined
*/


function add() {
    var i,
        n = arguments.length,
        total = 0;

    console.log(typeof arguments);

    for (i = 0; i < n; i += 1) {

        total = total + arguments[i];
    }
    return total;
}

var ten = add(1, 2, 3, 4);

console.log(ten);

function sum() {
    //convert arguments in array to be able to use its functions
    var args = Array.prototype.slice.call(arguments);

    console.log(args instanceof Array);

    return args.reduce(function (a, b) {
        return a + b;
    }, 0);
}

console.log(sum(1, 2, 4));

//in ECMA 5th edition arguments inherits form Array.prototype so no need //to convert to array

// this pseudo parameter allows a method to know which object it is
// concerned with and als for a single function object to serve many
// fucntions

/* closure
  - the context of an inner function includes the scope of the outer function
  - the inner function enjoys that context even after the pattern function has returned
*/

var letters = (function () {
    var letter = ['a', 'b', 'c'];
    return function (n) {
        return letter[n];
    };
}());

console.log(letters(1));

// avoid array initialization at every call (lazy) via function redefinition
var letters = (function () {
    var letter = ['a', 'b', 'c'],
        letters = function (n) {
            return letter[n];
        };
    return letters;
}());

console.log(letters(0));

// no longer a 1st class object - will do initialization if passed to another function. a better solution...

var letters = (function () {
    var letter;
    return function (n) {
        if (!letter) {
            console.log("init");
            letter = ['a', 'b', 'c'];
        }
        return letter[n];
    };
}());

console.log(letters(2));
console.log(letters(0));

// expanding Object

if (typeof Object.prototype.later !== 'function') {
    Object.prototype.later = function (method, msecs) {
        var that = this;
        if (typeof method === 'string') {
            method = that[method];
        }
        setTimeout(function () {
            method.apply(that, arguments);
        }, msecs);
        return that;
    };
}

var obj = {
    printDay: function () {
        var today = new Date();
        //     console.log(today.getUTCDate());
        return;
    },
    printMonth: function () {
        var today = new Date();
        //     console.log(today.getMonth());
        return;
    }
};

// cascading
obj.later('printDay', 2000).later('printMonth', 2000);

// Object creation
// 1- pseudoclassical inheritance

function Objtype1(id) {
    this.id = id;
}

Objtype1.prototype.toString = function () {
    return "Objtype1" + this.id;
};

function Objtype2(id) {
    this.id = id;
}

Objtype2.prototype = new Objtype1();
Objtype2.prototype.test = function (id) {
    return this.id === id;
};

var xxx = new Objtype2(10);
// xxx.test(10);

// console.log(xxx.id);

// 2- functional inheritance

function obj1(id) {
    return {
        id: id,
        toString: function () {
            return "obj1 " + this.id;
        }
    };
}

o1 = obj1(15);
// console.log(o1.id);
// console.log(o1.toString());

// inherits from obj1 and augments the object
function obj2(id) {
    var that = obj1(id);

    that.test = function (testid) {
        return that.id === testid;
    };
    return that;
}

o2 = obj2(3);
// console.log(o2.test(3));

// adding privacy (id not defined - made available by closure)

obj1 = function (id) {
    return {
        getId: function () {
            return 'my id is: ' + id;
        }
    };
};

o = obj1(12);
// console.log(o.getId());


function obj2(id) {
    var that = obj1(id);

    that.test = function (testid) {
        return testid === id;
    };
    return that;
}

o2 = obj2(3);
// console.log(o2.test(3));

// single invocation pattern


function once(func) {
    return function () {
        var f = func;
        func = null;
        return f.call(this, arguments);
    };
}

function test() {
    console.log('execute');
}

var onetime = once(test);
console.log(onetime);
onetime();
// onetime();