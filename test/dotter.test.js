import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {buildGraph} from '../src/js/cfg-maker';
import {dot} from '../src/js/dotter';
import {colorPath} from '../src/js/code-evaluator';

describe('The dotter', () => {
    it('is creating a dot format string for an empty function', () => {
        let code =
            'function foo(x){return 1;}';
        let params = '1';
        let parsedCode = parseCode(code);
        let cfg = buildGraph(parseCode(code));
        colorPath(cfg, parsedCode, params);
        let actual = dot(cfg);
        let expected = 'digraph cfg { ' +
            'n0 [label="return 1;\n1" style = filled fillcolor = darkolivegreen3 shape="box"]\n }';
        assert.equal(actual, expected);
    });

    it('is creating a dot format string for a function with if', () => {
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
        let cfg = buildGraph(parseCode(code));
        colorPath(cfg, parsedCode, params);
        let actual = dot(cfg);
        let expected = 'digraph cfg { ' +
            'n0 [label="let a = true;\n1" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n1 [label="x > 1\n2" style = filled fillcolor = darkolivegreen3 shape="diamond"]\n' +
            'n2 [label="x = 1\na = false\n3" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n3 [label="return a;\n4" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n4 [label="x = 0\n5" shape="box"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n4 [label="F"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n3 []\n' +
            ' }';
        assert.equal(actual, expected);
    });

    it('is creating a dot format string for a function with globals, while and if', () => {
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
        let cfg = buildGraph(parseCode(code));
        colorPath(cfg, parsedCode, params);
        let actual = dot(cfg);
        let expected = 'digraph cfg { ' +
            'n0 [label="let a = true;\n1" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n1 [label="global == 1\n2" style = filled fillcolor = darkolivegreen3 shape="diamond"]\n' +
            'n2 [label="x = 1\na = false\n3" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n3 [label="x == 1\n4" style = filled fillcolor = darkolivegreen3 shape="diamond"]\n' +
            'n4 [label="global = 2\n5" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n5 [label="global = 0\n6" shape="box"]\n' +
            'n6 [label="return a;\n7" style = filled fillcolor = darkolivegreen3 shape="box"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="T"]\n' +
            'n1 -> n6 [label="F"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="T"]\n' +
            'n3 -> n5 [label="F"]\n' +
            'n4 -> n1 []\n' +
            'n5 -> n1 []\n' +
            ' }';
        assert.equal(actual, expected);
    });

});