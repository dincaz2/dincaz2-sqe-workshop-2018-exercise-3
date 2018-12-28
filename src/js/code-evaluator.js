import {parseCode} from './code-analyzer';

const handlers = {
    'Program': block,
    'BlockStatement': block,
    'AssignmentExpression': assignmentExpression,
    'ExpressionStatement': expressionStatement,
    'FunctionDeclaration': functionDeclaration,
    'VariableDeclaration' : variableDeclaration,

    'BinaryExpression': binaryExpression,
    'LogicalExpression': binaryExpression,
    'Identifier': identifier,
    'Literal': literal,
    'MemberExpression': memberExpression,
    'ArrayExpression': arrayExpression,
};

function evalExp(exp, params) {
    return handlers[exp.type](exp, params);
}

function block(exp, params) {
    exp.body.forEach(e => evalExp(e, params));
}

function assignmentExpression(exp, params) {
    let right = evalExp(exp.right, params);
    let left = exp.left;
    if (left.type === 'Identifier')
        params[exp.left.name] = right;
    else { // array
        let val = params[left.object.name];
        let members = val.slice(1, val.length - 1).split(',');
        members[left.property.value] = right;
        params[left.object.name] = '[' + members.join(',') + ']';
    }
    return true;
}

function expressionStatement(exp, params) {
    return evalExp(exp.expression, params);
}

function functionDeclaration(exp, params) {
    exp.params.forEach((p, i) => {params[p.name] = params[i]; delete params[i];});
}

function variableDeclaration(exp, params) {
    exp.declarations.forEach(e => params[e.id.name] = evalExp(e.init, params));
    return true;
}

function binaryExpression(exp, params) {
    let left = evalExp(exp.left, params);
    let right = evalExp(exp.right, params);
    return eval(left + exp.operator + right);
}

function identifier(exp, params) {
    return params[exp.name];
}

function literal(exp) {
    return exp.raw;
}

function memberExpression(exp, params) {
    let object = evalExp(exp.object, params);
    let property = evalExp(exp.property, params);
    return eval(object + '[' + property + ']');
}

function arrayExpression(exp, params){
    return '[' + exp.elements.map(e => evalExp(e, params)).join(',') + ']';
}

function colorPath (cfg, parsedCode, params) {
    let node = cfg[0];
    params = extractFunctionParams(params);
    evalExp(parsedCode, params); // evaluates globals and params
    while (node.type !== 'exit'){
        node.color = true;
        if (node.normal){
            evalExp(parseCode(node.label), params);
            node = node.normal;
        }
        else if (evalExp(parseCode(node.label).body[0], params))
            node = node.true;
        else
            node = node.false;
    }
    node.color = true;
}

function pushUntil(paramArr, i, terminator){
    var s = paramArr[i];
    while (!paramArr[i].endsWith(terminator)){
        s += ',' + paramArr[++i];
    }
    return [s, i];
}

function extractFunctionParams(paramString) {
    let paramStringArr = paramString.split(',');
    var params = {};
    var index = 0;
    for (var i = 0; i < paramStringArr.length; i++) {
        if (paramStringArr[i].startsWith('[')) {
            let res = pushUntil(paramStringArr, i, ']');
            params[index++] = res[0];
            i = res[1];
        } else if (paramStringArr[i].startsWith('\'')) {
            let res = pushUntil(paramStringArr, i, '\'');
            params[index++] = res[0];
            i = res[1];
        } else
            params[index++] = paramStringArr[i];
    }
    return params;
}

export {colorPath};