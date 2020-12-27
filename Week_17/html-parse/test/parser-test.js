
var assert = require('assert');

// var add = require('../add.js').add;
// var mul = require('../add.js').mul;

import {parserHTML} from '../src/parser.js'

describe("parse html:", function() {
    it('<a></a>', function() {
        let tree = parserHTML('<a></a>')
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="//time.geekbang.org"></a>', function() {
        let tree = parserHTML('<a href="//time.geekbang.org"></a>')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href></a>', function() {
        let tree = parserHTML('<a href></a>')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="abc" id></a>', function() {
        let tree = parserHTML('<a href="abc" id></a>')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc ></a>', function() {
        let tree = parserHTML('<a id=abc></a>')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc/>', function() {
        let tree = parserHTML('<a id=abc />')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<>', function() {
        let tree = parserHTML('<a>')
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].type, "text");
    });
})
