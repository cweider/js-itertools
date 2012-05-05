var itertools = require('../itertools');
var _Iterator = itertools.Iterator;
var _List = itertools.Array;
var assert = require('assert');

var assertIteratorResult = function (list, iterator) {
    var _list = _List(iterator);
    return assert.deepEqual(list, _list, list + ' != ' + _list);
}

describe("creation", function () {
  it('should work with Arrays', function () {
    assertIteratorResult([1,2,3,4,5,6,7,8,9], _Iterator([1,2,3,4,5,6,7,8,9]));
  });
  it('should work with empty Arrays', function () {
    assertIteratorResult([], _Iterator([]));
  });
  it('should work with Strings', function () {
    assertIteratorResult(['A','B','C','D','E','F','G'], _Iterator('ABCDEFG'));
  });
  it('should work with Objects', function () {
    assertIteratorResult([['one', 1], ['two', 2], ['three', 3]], _Iterator({one: 1, two: 2, three: 3}));
  });
  it('should work with Iterators', function () {
    var iterator = _Iterator([1,2,3,4,5,6,7,8,9]);
    assert.ok(iterator === _Iterator(iterator));
  });
});

describe("count", function () {
  it('should work with negative to positive', function () {
    assertIteratorResult([-10,-8,-6,-4,-2,0,2,4,6,8,10], itertools.slice(itertools.count(-10, 2), 11));
  });
  it('should work with positive to negative', function () {
    assertIteratorResult([10,8,6,4,2,0,-2,-4,-6,-8,-10], itertools.slice(itertools.count(10, -2), 11));
  });
  it('should work with positive to zero', function () {
    assertIteratorResult([10,10,10,10,10,10,10,10,10,10], itertools.slice(itertools.count(10, 0), 10));
  });
});

describe("cycle", function () {
  it('should work with Arrays', function () {
    assertIteratorResult([1,2,3,4,5,1,2,3,4,5,1,2,3,4,5], itertools.slice(itertools.cycle(itertools.slice(itertools.count(1, 1), 5)), 15));
  });
  it('should work with empty Arrays', function () {
    assertIteratorResult([], itertools.slice(itertools.cycle([]), 10));
  });
});

describe("repeat", function () {
  it('should work', function () {
    assertIteratorResult([10,10,10,10,10], itertools.repeat(10, 5));
    assertIteratorResult([10,10,10,10,10,10,10,10,10,10], itertools.slice(itertools.repeat(10), 10));
    assertIteratorResult([10,10,10,10,10,10,10,10,10,10], itertools.slice(itertools.repeat(10, 'NONSENSE'), 10));
  });
});

describe("chain", function () {
  it('should work', function () {
    assertIteratorResult(['A','B','C','D',1,2,3,4,'RED','GREEN','BLUE'], itertools.chain(['A','B','C','D'],[1,2,3,4],['RED','GREEN','BLUE']));
  });
  it('should work with empty', function () {
    assertIteratorResult([], itertools.chain());
  });
});

describe("dropWhile", function () {
  it('should work with default test', function () {
    assertIteratorResult([0,1,2,3,4,5,0,1,2,3,4,5], itertools.dropWhile(null, itertools.chain(itertools.repeat(1, 5), [0,1,2,3,4,5,0,1,2,3,4,5])));
  });
  it('should work with custom test', function () {
    assertIteratorResult([5,0,1,2,3,4,5], itertools.dropWhile(function (x) {return x < 5}, itertools.chain(itertools.repeat(1, 5), [0,1,2,3,4,5,0,1,2,3,4,5])));
  });
});

describe("takeWhile", function () {
  it('should work with default test', function () {
    assertIteratorResult([1,1,1,1,1,1,2,3,4,5], itertools.takeWhile(null, itertools.chain(itertools.repeat(1, 5), [1,2,3,4,5,0,1,2,3,4,5,0])));
  });
  it('should work with custom test', function () {
    assertIteratorResult([1,1,1,1,1,0,1,2,3], itertools.takeWhile(function (x) {return x < 4}, itertools.chain(itertools.repeat(1, 5), [0,1,2,3,4,5,0,1,2,3,4,5])));
  });
});

describe("filter", function () {
  it('should work with default test', function () {
    assertIteratorResult([1,2,3,4,5], itertools.filter(null, [0,1,0,2,0,3,0,4,0,5]));
  });
  it('should work with custom test', function () {
    assertIteratorResult([2,4,2,4,2], itertools.slice(itertools.filter(function (x) {return x == 2 || x == 4;}, itertools.cycle([1,2,3,4,5])), 5));
  });
});

describe("slice", function () {
  it('should work with start index', function () {
    assertIteratorResult([0,1,2,3,4], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5));
  });
  it('should work with zero start index', function () {
    assertIteratorResult([], itertools.slice([0,1,2,3,4,5,6,7,8,9], 0));
  });
  it('should work with zero range', function () {
    assertIteratorResult([], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 5));
  });
  it('should work with positive range', function () {
    assertIteratorResult([5], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 6));
  });
  it('should work with negative range', function () {
    assertIteratorResult([], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 4));
  });
  it('should work with over overflowing range', function () {
    assertIteratorResult([5,6,7,8,9], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 15));
  });
  it('should work with step', function () {
    assertIteratorResult([0,2,4], itertools.slice([0,1,2,3,4,5,6,7,8,9], 0, 5, 2));
  });
  it('should work with overflowing step', function () {
    assertIteratorResult([5], itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 6, 100));
  });
  it('should require positive step', function () {
    assert.throws(function () {
      itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, 6, -1);
    }, itertools.ArgumentError);
  });
  it('should require positive range', function () {
    assert.throws(function () {
      itertools.slice([0,1,2,3,4,5,6,7,8,9], 5, -1, 5);
    }, itertools.ArgumentError);
  });
});

describe("filter", function () {
  it('should work', function () {
    assertIteratorResult([[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5]], itertools.map(function (x) {return _List(x)}, itertools.tee([0,1,2,3,4,5], 3)));
  });
  it('should work with empty', function () {
    assertIteratorResult([[],[],[]], itertools.map(function (x) {return _List(x)}, itertools.tee([], 3)));
  });
  it('should work with unspecified number', function () {
    assertIteratorResult([[0,1,2,3,4,5],[0,1,2,3,4,5]], itertools.map(function (x) {return _List(x)}, itertools.tee([0,1,2,3,4,5])));
  });
});

describe("zip", function () {
  it('should work', function () {
    assertIteratorResult([[0,1,2],[1,2,3],[2,3,4],[3,4,5],[4,5,6]], itertools.zip([0,1,2,3,4],[1,2,3,4,5],[2,3,4,5,6]));
  });
  it('should work with empty', function () {
    assertIteratorResult([], itertools.zip([],[1,2,3,4,5],[]));
  });
});

describe("zipLongest", function () {
  it('should work', function () {
    assertIteratorResult([[0,1,2],[1,2,3],[2,3,4],[3,4,5],[4,5,6]], itertools.zipLongest([0,1,2,3,4],[1,2,3,4,5],[2,3,4,5,6]));
  });
  it('should work with empty', function () {
    assertIteratorResult([[undefined,1,undefined],[undefined,2,undefined],[undefined,3,undefined],[undefined,4,undefined],[undefined,5,undefined]], itertools.zipLongest([],[1,2,3,4,5],[]));
  });
});

describe("roundrobin", function () {
  it('should work', function () {
    assertIteratorResult([0,1,2,3,4,5,6,7,8,9], itertools.roundrobin([0,3,5,7],[1,4,6,8,9],[2]));
  });
});

describe("all", function () {
  it('should work', function () {
    assert.ok(false === itertools.all([0,1,0,0]));
    assert.ok(true === itertools.all([1,1,1,1]));
  });
});

describe("some", function () {
  it('should work', function () {
    assert.ok(false === itertools.some([0,1,0,0], 2));
    assert.ok(true === itertools.some([0,1,1,0], 2));
    assert.ok(true === itertools.some([1,1,1,1], 2));

  });
});

describe("any", function () {
  it('should work', function () {
    assert.ok(true === itertools.any([0,1,0,0]));
    assert.ok(false === itertools.any([0,0,0,0]));
  });
});

describe("reduce", function () {
  it('should use provided initial', function () {
      assert.ok('(((((0+1)+2)+3)+4)+5)' === itertools.reduce(function (x,y) {return '('+x+'+'+y+')'}, [1,2,3,4,5], 0));
  });
  it('should use first valueu for initial', function () {
      assert.ok('((((1+2)+3)+4)+5)' === itertools.reduce(function (x,y) {return '('+x+'+'+y+')'}, [1,2,3,4,5]));
  });
});
