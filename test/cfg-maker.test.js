import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {buildGraph} from '../src/js/cfg-maker';

describe('The CFG builder', () => {
    it('is building a CFG for an empty function', () => {
        let code =
            'function foo(x){return 1;}';
        let actual = buildGraph(parseCode(code));
        assert.equal(actual.length, 1);
        assert.equal(actual[0].astNode.type, 'ReturnStatement');
        assert.equal(actual[0].label, 'return 1;');
    });

    it('is building a CFG for a function with if', () => {
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
        let actual = buildGraph(parseCode(code));
        assert.equal(actual.length, 5);

        assert.equal(actual[0].label, 'let a = true;');
        assert.equal(actual[1].label, 'x > 1');
        assert.equal(actual[2].label, 'x = 1\na = false');
        assert.equal(actual[4].label, 'x = 0');
        assert.equal(actual[3].label, 'return a;');

        assert.equal(actual[0].normal, actual[1]);
        assert.equal(actual[1].true, actual[2]);
        assert.equal(actual[1].false, actual[4]);
        assert.equal(actual[2].normal, actual[3]);
        assert.equal(actual[4].normal, actual[3]);
    });

    it('is building a CFG for a function with globals, while and if', () => {
        let code =
            'let global = 1;\n' +
            'function foo(x){\n' +
            '   let a = true;\n' +
            '   while (x > 1){\n' +
            '       x = 1;\n' +
            '       a = false;\n' +
            '       if (x == 1)\n' +
            '           global = 2;\n' +
            '       else\n' +
            '           global = 0\n;' +
            '   }\n' +
            '   return a;\n' +
            '}';
        let actual = buildGraph(parseCode(code));
        assert.equal(actual.length, 7);

        assert.equal(actual[0].label, 'let a = true;');
        assert.equal(actual[1].label, 'x > 1');
        assert.equal(actual[2].label, 'x = 1\na = false');
        assert.equal(actual[3].label, 'x == 1');
        assert.equal(actual[4].label, 'global = 2');
        assert.equal(actual[5].label, 'global = 0');
        assert.equal(actual[6].label, 'return a;');

        assert.equal(actual[0].normal, actual[1]);
        assert.equal(actual[1].true, actual[2]);
        assert.equal(actual[2].normal, actual[3]);
        assert.equal(actual[3].true, actual[4]);
        assert.equal(actual[3].false, actual[5]);
        assert.equal(actual[1].false, actual[6]);
        assert.equal(actual[4].normal, actual[1]);
        assert.equal(actual[5].normal, actual[1]);
    });

});