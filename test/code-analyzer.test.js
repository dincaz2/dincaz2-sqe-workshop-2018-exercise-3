import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            JSON.stringify(JSON.parse('{\n' +
            '  "type": "Program",\n' +
            '  "body": [],\n' +
            '  "sourceType": "script",\n' +
            '  "range": [0,0]\n' +
            '}'))
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            JSON.stringify(JSON.parse('{\n' +
                '  "type": "Program",\n' +
                '  "body": [\n' +
                '    {\n' +
                '      "type": "VariableDeclaration",\n' +
                '      "declarations": [\n' +
                '        {\n' +
                '          "type": "VariableDeclarator",\n' +
                '          "id": {\n' +
                '            "type": "Identifier",\n' +
                '            "name": "a",\n' +
                '            "range": [4,5]\n' +
                '          },\n' +
                '          "init": {\n' +
                '            "type": "Literal",\n' +
                '            "value": 1,\n' +
                '            "raw": "1",\n' +
                '            "range": [8,9]\n' +
                '          },\n' +
                '          "range": [4,9]\n' +
                '        }\n' +
                '      ],\n' +
                '      "kind": "let",\n' +
                '      "range": [0,10]\n' +
                '    }\n' +
                '  ],\n' +
                '  "sourceType": "script",\n' +
                '  "range": [0,10]\n' +
                '}'))
        );
    });
});
