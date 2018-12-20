import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {buildGraph} from '../src/js/cfg-maker';
import {colorPath} from '../src/js/code-evaluator';

describe('The nodes colorer', () => {
    it('is correctly coloring an empty function', () => {
        let code =
            'function foo(x){return 1;}';
        let params = '1';
        let parsedCode = parseCode(code);
        let actual = buildGraph(parseCode(code));
        colorPath(actual, parsedCode, params);

        assert.equal(actual.length, 1);
        assert.equal(actual[0].color, true);
    });

    it('is correctly coloring a function with if', () => {
        let code =
            'function foo(x){\n' +
            '   let a = true;\n' +
            '   if (x > 1){\n' +
            '       x = 1;\n' +
            '       a = false;\n' +
            '   } else\n' +
            '       x = 0;\n' +
            '   return a;\n' +
            '}';
        let params = '2';
        let parsedCode = parseCode(code);
        let actual = buildGraph(parseCode(code));
        colorPath(actual, parsedCode, params);

        assert.equal(actual.length, 5);
        assert.equal(actual[0].color, true);
        assert.equal(actual[1].color, true);
        assert.equal(actual[2].color, true);
        assert.equal(actual[3].color, true);
        assert.equal(actual[4].color, undefined);
    });

    it('is correctly coloring a function with globals, while and if', () => {
        let code =
            'let global = 1;\n' +
            'function foo(x){\n' +
            '   let a = true;\n' +
            '   while (global == 1){\n' +
            '       x = 1;\n' +
            '       a = false;\n' +
            '       if (x == 1)\n' +
            '           global = 2;\n' +
            '       else\n' +
            '           global = 0\n;' +
            '   }\n' +
            '   return a;\n' +
            '}';
        let params = '2';
        let parsedCode = parseCode(code);
        let actual = buildGraph(parseCode(code));
        colorPath(actual, parsedCode, params);

        assert.equal(actual.length, 7);
        assert.equal(actual[0].color, true);
        assert.equal(actual[1].color, true);
        assert.equal(actual[2].color, true);
        assert.equal(actual[3].color, true);
        assert.equal(actual[4].color, true);
        assert.equal(actual[5].color, undefined);
        assert.equal(actual[6].color, true);
    });

    it('is correctly coloring a function with arrays and if', () => {
        let code =
            'function foo(x, y){\n' +
            '   let a = [3,4];\n' +
            '   while (a[0] == 3){\n' +
            '       a[0] = x[0];\n' +
            '   }\n' +
            '   return a;\n' +
            '}';
        let params = '[1,2],\'hello, hello\'';
        let parsedCode = parseCode(code);
        let actual = buildGraph(parseCode(code));
        colorPath(actual, parsedCode, params);

        assert.equal(actual.length, 4);
        assert.equal(actual[0].color, true);
        assert.equal(actual[1].color, true);
        assert.equal(actual[2].color, true);
        assert.equal(actual[3].color, true);
    });

});