# JS Itertools #
JS Itertools is a collection of operations for and an implementation of iterators that is forward-compatible with JavaScript 1.7's `Iterator` object. Like JS 1.7's implementation is a port of Python's Iterator, so is this collection. For documentation, I recommend simply reading the original python notes <http://docs.python.org/library/itertools.html>.

## Notes ##
The `itertools.js` file follows the CommonJS module exporting convention. If you want to use this in a browser just bookend the file like this:

    itertools = (function () {var exports = {};(function (exports) {
    /* itertools code */
    }(exports)); return exports;}());

## License ##
This is simple code that has no reason to be reimplemented for the sake of a licensing restriction. It is released to the open domain.
