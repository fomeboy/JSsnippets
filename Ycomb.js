
console.log('Initial ver: ' + function () {

    // Jim Weirich talk
    // fixed points (convergence point)
    // higher order functions
    // functional refactoring:
    //  *1 tennent correspondence principle (wrap exp in lamb and call)
    //  *2 introduce binding (introduction of free variable)
    //  *3 rebind
    //  *4 function wrap (wrap a function in another function)
    //  *5 inline function (replace function call with func declaration)

    makeadder = function (x) {
        return function (n) {
            // *2 doesn't change anything
            return function (xyz) {
                return x + n;
            }(123456);
        };
    };

    compose = function (f, g) {
        // *4
        //return function (x) {return f(g(x));};
        return function (z) {
            return function (x) {
                return f(g(x));
            }(z);
        };
    };


    add1 = makeadder(1);
    // *1
    //mult3 = function (n) {return n * 3;};
    // *3 rebinding n with local n and passing parent n
    //mult3 = function (n) {return function () {return n * 3;}();};
    mult3 = function (n) {
        return function (n) {
            return n * 3;
        }(n);
    };

    mult3add1 = compose(mult3, add1);

    return mult3add1(10);
}());

// apllying inline functions to all expressions we end up with a
// single lambda expression with no assignments or function calls:

console.log('lambda ver: ' + function () {

    return function (f, g) {
            return function (z) {
                return function (x) {
                    return f(g(x));
                }(z);
            };
        }(function (n) {
                return function (n) {
                    return n * 3;
                }(n);
            },
            function (x) {
                return function (n) {
                    return function (xyz) {
                        return x + n;
                    }(123456);
                };
            }(1))
        (10);
}());


//////////////////////////////////////////////////////////
// define factorial function

console.log('factorial: ' + function () {
    fact = function (n) {
        return n === 0 ? 1 : n * fact(n - 1);
    };
    return fact(5);
}());

//step 1 - inline function

console.log('1.factorial: ' + function () {
    return function (n) {
        return n === 0 ? 1 : n * fact(n - 1);
    }(5);
}());

//step 2 - inline function

console.log('2.factorial: ' + function () {
    return function (n) {
        return n === 0 ? 1 : n * fact(n - 1);
    }(5);
}());

//step 3 - fact in unbound
//create improver that does partial apllication

console.log('3.factorial: ' + function () {

    improver = function (partial) {
        return function (n) {
            return n === 0 ? 1 : n * partial(n - 1);
        };
    };

    fx = improver(improver(improver(improver())));
    return fx(3);

}());

//step 4 - fact in unbound
//create improver that does partial apllication

console.log('4.factorial: ' + function () {

    fx = function (improver) {
            return improver(improver(improver(improver())));
        }
        (function (partial) {
            return function (n) {
                return n === 0 ? 1 : n * partial(n - 1);
            };
        });

    return fx(3);

}());

//step 5 - turn partial application into recursive


console.log('5.factorial: ' + function () {

    fx = function (improver) {
            return improver(improver);
        }
        (function (improver) {
            return function (n) {
                return n === 0 ? 1 : n * improver(improver)(n - 1);
            };
        });

    return fx(5);

}());

//step 6 - renaming
//inlining
//refactoring
//rebinding


console.log('6.factorial: ' + function () {

    return function (gen) {
            return gen(gen);
        }
        (function (gen) {
            return function (n) {
                return function (n) {
                    return n === 0 ? 1 : n * gen(gen)(n - 1);
                }(n);
            };
        })(5);


}());

//step 7 - tennent
//rebind
//looped into initial partial function


console.log('7.factorial: ' + function () {

    return function (gen) {
            return gen(gen);
        }
        (function (gen) {
            return function (n) {
                return function (partial) {
                    return function (n) {
                        return n === 0 ? 1 : n * partial(n - 1);
                    };
                }(gen(gen))(n);
            };
        })(5);


}());

//step 8 - separating elements
//
//


console.log('8.factorial: ' + function () {

    fact_improver = function (partial) {
        return function (n) {
            return n === 0 ? 1 : n * partial(n - 1);
        };
    };

    // y calculates the fixed point of the improver
    y = function (improver) {
        return function (gen) {
                return gen(gen);
            }
            (function (gen) {
                return function (n) {
                    return improver(gen(gen))(n);
                };
            });
    };

    fact = y(fact_improver);
    return fact(5);

}());


//step 9 - final refactoring
//final y combinator form
//applicative order (arguments evaluated before function call)



console.log('9.factorial: ' + function () {

    fact_improver = function (partial) {
        return function (n) {
            return n === 0 ? 1 : n * partial(n - 1);
        };
    };

    // y calculates the fixed point of the improver
    y = function (f) {
        return function (g) {
                return function (n) {
                    return f(g(g))(n);
                };
            }
            (function (g) {
                return function (n) {
                    return f(g(g))(n);
                };
            });
    };

    fact = y(fact_improver);
    return fact(5);

}());