import * as escodegen from 'escodegen';

function findFunction(exp){
    return exp.body.filter(e => e.type === 'FunctionDeclaration')[0].body;
}

function buildGraph(parsedCode){
    const esgraph = require('esgraph');
    let functionExp = findFunction(parsedCode);
    let cfg = esgraph(functionExp)[2];
    removeExceptions(cfg);
    cfg = removeEntryAndExit(cfg);
    addLabels(cfg);
    joinNormals(cfg);
    return cfg;
}

function removeEntryAndExit(nodes){
    let exitNode = nodes[nodes.length - 1];
    let returnNode = exitNode.prev.filter(node => node.astNode.type === 'ReturnStatement')[0];
    nodes[0].normal.type = 'entry';
    nodes[0].normal.prev = [];
    returnNode.type = 'exit';
    returnNode.next = [];
    delete returnNode.normal;
    return nodes.slice(1, nodes.length - 1);
}

function removeExceptions(cfg){
    cfg.forEach(node => delete node.exception);
}

function addLabels(cfg){
    cfg.forEach(node => node.label = escodegen.generate(node.astNode));
}

function joinNormals(cfg){
    for (var i=0; i<cfg.length; i++){
        let node = cfg[i];
        if (node.normal && node.normal.normal){
            let next = node.normal;
            node.next = next.next;
            node.normal = next.normal;
            node.label += '\n' + next.label;
            cfg.splice(cfg.indexOf(next), 1);
            i--;
        }
    }
}

export {buildGraph};