/*
    itertools.js

    Created by Chad Weider

    Released into public domain on 10/10/2010.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

*/

function __StopIteration() {
  Error.apply(this, arguments);
}
__StopIteration.prototype = new Error();

var _StopIteration = typeof StopIteration != 'undefined' ? StopIteration : __StopIteration;

function _arrayForArguments(args) {
  return Array.prototype.slice.call(args);
}

var _Iterator = function () {
};

_Iterator.prototype = (new function () {
    function __iterator__() {
        return this;
    }
    function toString() {
        return '[object Iterator' + (this.type ? '(' + this.type + ')' : '') + ']';
    }
    this.__iterator__ = __iterator__;
    this.toString = toString;

    this.toArray = function () {
      return toArray(this)
    }
    this.map = function () {
      var args = _arrayForArguments;
      args.unshift(this);
      return map(args)
    }

    this.map = function () {
      var args = _arrayForArguments;
      args.unshift(this);
      return map(args)
    }

}());

function makeIteratorOf(object) {
    if (object == null) {
        object = [];
    } else if (arguments.length > 1) {
        object = _arrayForArguments(arguments);
    }

    if (object.__iterator__) {
        return object.__iterator__();
    } else if (object.length !== undefined) {
        return fromArray(object);
    } else if (typeof object == 'string') {
        return fromString(object);
    } else {
        return fromObject(object);
    }
};

function fromArray(array) {
    var _iterator = new _Iterator();
    var _array = array.concat();
    var i = 0, ii = _array.length;

    _iterator.type = 'array';
    _iterator.next = function () {
        if (i < ii) {
            return _array[i++];
        } else {
            throw new _StopIteration;
        }
    };

    return _iterator;
};

function toArray(iterator) {
    var i = 0;
    var array = [];
    try {
        while (1) {
            array[i++] = iterator.next();
        }
    } catch (error) {
        if (!(error instanceof _StopIteration)) {
            throw error;
        }
    }
    return array;
};

function fromString(string) {
    var _iterator = new _Iterator();
    var i = 0, ii = string.length;

    _iterator.type = 'string';
    _iterator.next = function () {
        if (i < ii) {
            return string.charAt(i++);
        } else {
            throw new _StopIteration;
        }
    };

    return _iterator;
};

function fromObject(object) {
    var pairs = [];
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            pairs.push([key, object[key]]);
        }
    }

    return fromArray(pairs);
};

function count(start, step) {
    var _iterator = new _Iterator();
    step = typeof step == 'number' ? step : 1;

    _iterator.type = 'count';
    _iterator.next = function () {
        var val = start;
        start += step;
        return val;
    };

    return _iterator;
};

function cycle(iterable) {
    var iterator = makeIteratorOf(iterable);
    var _iterator = new _Iterator();
    var values = [];
    var i, ii;

    _iterator.type = 'cycle';
    _iterator.next = function () {
        var value;
        if (iterator) {
            try {
                value = iterator.next();
                values.push(value);
                return value;
            } catch (error) {
                if (error instanceof _StopIteration) {
                    if (values.length > 0) {
                        iterator = null;
                        i = 0;
                        ii = values.length;
                    } else {
                        throw new _StopIteration;
                    }
                } else {
                    throw error;
                }
            }
        }

        value = values[i];
        i = (i + 1) % ii;
        return value;
    };

    return _iterator;
};

function repeat(value, times) {
    var _iterator = new _Iterator();
    var i = 0;

    times = parseInt(times);
    _iterator.type = 'repeat';
    _iterator.next = function () {
        if (!(i >= times)) {
            i++;
            return value;
        } else {
            throw new _StopIteration;
        }
    };

    return _iterator;
};

function chain() {
    var _iterator = new _Iterator();
    var iterators = _arrayForArguments(arguments);
    var iterator;
    if (iterators.length == 0) {
        return fromArray([]);
    }

    iterator = makeIteratorOf(iterators.shift());
    _iterator.type = 'chain';
    _iterator.next = function () {
        try {
            return iterator.next();
        } catch (error) {
            if (error instanceof _StopIteration) {
                if (iterators.length == 0) {
                    throw new _StopIteration;
                } else {
                    iterator = makeIteratorOf(iterators.shift());
                    return this.next();
                }
            } else {
                throw error;
            }
        }
    };

    return _iterator;
};

function dropWhile(test, iterable) {
    var iterator = makeIteratorOf(iterable);
    var _iterator = new _Iterator();
    var performedDrop = false;

    test = test || function (x) {return x;};

    _iterator.type = 'dropwhile';
    _iterator.next = function () {
        var value;
        if (!performedDrop) {
            do {
                value = iterator.next();
            } while (test(value));
            performedDrop = true;
            return value;
        } else {
            return iterator.next();
        }
    };

    return _iterator;
};

function takeWhile(test, iterable) {
    var iterator = makeIteratorOf(iterable);
    var _iterator = new _Iterator();
    var performedTake = false;

    test = test || function (x) {return x;};

    _iterator.type = 'takewhile';
    _iterator.next = function () {
        var value;
        if (!performedTake) {
            value = iterator.next();
            if (test(value)) {
                return value;
            } else {
                performedTake = true;
                throw new _StopIteration;
            }
        } else {
            throw new _StopIteration;
        }
    };

    return _iterator;
};

function filter(test, iterable) {
    var iterator = makeIteratorOf(iterable);
    var _iterator = new _Iterator();
    test = test || function (x) {return x;};

    _iterator.type = 'filter';
    _iterator.next = function () {
        var value;
        do {
            value = iterator.next();
        } while (!test(value));
        return value;
    };

    return _iterator;
};

function slice() {
    var _iterator = new _Iterator();
    var iterator = makeIteratorOf(arguments[0]);
    var start, stop, step;
    if (arguments.length == 2) {
        start = 0;
        stop = arguments[1];
        step = 1;
    } else if (arguments.length == 3) {
        start = arguments[1];
        stop = arguments[2];
        step = 1;
    } else if (arguments.length == 4) {
        start = arguments[1];
        stop = arguments[2];
        step = arguments[3];
    } else {
        throw new Error("Argument Error: Stop must be specified.");
    }
    var i = 1;

    if (!(start > -1)) {
        throw new Error("Argument Error: Start, must be a non-negative integer.");
    }
    if (stop && !(stop > -1)) {
        throw new Error("Argument Error: Step, if defined, must be a non-negative integer.");
    }
    if (!(step > 0)) {
        throw new Error("Argument Error: Step, if defined, must be a positive integer.");
    }

    var skip = function (n) {
        var j = 0;
        while (j < n) {
            iterator.next();
            j++;
        }
        i += j;
    };

    var phaseStep;
    var begin = function () {
        skip(start);
        if (stop === undefined || i <= stop) {
            phaseStep = next;
            return iterator.next();
        } else {
            throw new _StopIteration;
        }
    };
    var next = function () {
        if (step > 1) {
            skip(step-1);
        }
        if (stop === undefined || i < stop) {
            i++;
            return iterator.next();
        } else {
            throw new _StopIteration;
        }
    };

    phaseStep = begin;
    _iterator.type = 'slice';
    _iterator.next = function () {
        return phaseStep();
    };

    return _iterator;
};

function map() {
    var _iterator = new _Iterator();
    var mapping = arguments[0];
    var iterator;

    _iterator.type = 'map';

    if (arguments.length == 2) {
        var iterator = makeIteratorOf(arguments[1]);
        _iterator.next = function ()  {
            return mapping ? mapping(iterator.next()) : value;
        };
    } else {
        var iterators = [];
        for (var i = 1, ii = arguments.length; i < ii; i++) {
            iterators[i-1] = makeIteratorOf(arguments[i])
        }
        iterator = zip.apply(this, iterators)
        _iterator.next = function () {
            var value = iterator.next();
            return mapping ? mapping.apply(this, value) : value;
        };
    }

    return _iterator;
};

function tee(iterable, n) {
    var iterator = makeIteratorOf(iterable);
    var nextsList = [];
    var iterators = [];

    if (n === undefined) {
        n = 2;
    } else if (!(n > 0)) {
        throw new Error("Argument Error: The number of tees, if specified must be a positive number.");
    }

    var getNextForIterator = function (i) {
        var nexts = nextsList[i];
        if (nexts.length == 0) {
            var value = iterator.next();
            for (var j = 0; j < n; j++) {
                if (i != j) {
                    nextsList[j].push(value);
                }
            }
            return value;
        } else {
            return nexts.shift();
        }
    };

    var makeIterator = function (i) {
        var _iterator = new _Iterator();
        _iterator.type = 'tee';
        _iterator.next = function () {
            return getNextForIterator(i);
        };
        return _iterator;
    };

    for (var i = 0; i < n; i++) {
        nextsList.push([]);
        iterators.push(makeIterator(i));
    }

    return iterators;
};

function zip() {
    var _iterator = new _Iterator();
    var iterators = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
        iterators[i] = makeIteratorOf(arguments[i]);
    }

    _iterator.type = 'zip';
    _iterator.next = function () {
        var nexts = [];
        for (var i = 0, ii = iterators.length; i < ii; i++) {
            nexts[i] = iterators[i].next();
        }
        return nexts;
    };

    return _iterator;
};

function zipLongest() {
    var _iterator = new _Iterator();
    var iterators = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
        iterators[i] = makeIteratorOf(arguments[i]);
    }
    var exhausted = iterators.length;

    _iterator.type = 'zipLongest';
    _iterator.next = function () {
        var nexts = [];
        for (var i = 0, ii = iterators.length; i < ii; i++) {
            var value;
            try {
                value = iterators[i] && iterators[i].next();
            } catch (error) {
                if (error instanceof _StopIteration) {
                    value = undefined;
                    iterators[i] = undefined;
                    exhausted--;
                    if (exhausted == 0) {
                        throw new _StopIteration;
                    }
                } else {
                    throw error;
                }
            }
            nexts[i] = value;
        }
      return nexts;
    };

    return _iterator;
};

function roundrobin() {
    var _iterator = new _Iterator();
    var iterators = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
        iterators[i] = makeIteratorOf(arguments[i]);
    }
    var pending = iterators.length;
    var nexts = cycle(map.apply(this, [function (iter) {return iter.next}, fromArray(iterators)]));

    _iterator.type = 'roundrobin';
    _iterator.next = function () {
        if (pending > 0) {
            try {
                return nexts.next()();
            } catch (error) {
                if (error instanceof _StopIteration) {
                    pending--;
                    nexts = cycle(slice(nexts, pending));
                    return this.next();
                } else {
                    throw error;
                }
            }
        } else {
            throw new _StopIteration;
        }
    };

    return _iterator;
};

function all(iterable) {
    var iterator = makeIteratorOf(iterable);
    try {
        while (iterator.next()) {;}
        return false;
    } catch (error) {
        if (!(error instanceof _StopIteration)) {
            throw error;
        }
    }
    return true;
};
function some(iterable, count) {
    var iterator = makeIteratorOf(iterable);

    if (!(count > 0)) {
        throw new Error("Argument Error: Count must be positive number.");
    }

    try {
        while (count > 0) {if (iterator.next()) {count--;}}
        return true;
    } catch (error) {
        if (!(error instanceof _StopIteration)) {
            throw error;
        }
    }
    return false;
};
function any(iterable) {
    var iterator = makeIteratorOf(iterable);
    try {
        while (!iterator.next()) { }
        return true;
    } catch (error) {
        if (!(error instanceof _StopIteration)) {
            throw error;
        }
    }
    return false;
};

function reduce(func, iterable, init) {
    var iterator = makeIteratorOf(iterable);
    var result, value;
    try {
        result = (init === undefined ? iterator.next() : init);
        while (1) {
            value = iterator.next();
            result = func(result, value);
        }
    } catch (error) {
        if (!(error instanceof _StopIteration)) {
            throw error;
        }
    }
    return result;
};

exports.Iterator = makeIteratorOf;
exports.Array = toArray;
exports.StopIteration = _StopIteration;

exports.count = count;
exports.cycle = cycle;
exports.repeat = repeat;

exports.chain = chain;
exports.dropWhile = dropWhile;
exports.takeWhile = takeWhile;
exports.filter = filter;
exports.slice = slice;
exports.map = map;
exports.tee = tee;
exports.zip = zip;
exports.zipLongest = zipLongest;
exports.roundrobin = roundrobin;

exports.all = all;
exports.some = some;
exports.any = any;
exports.reduce = reduce;
