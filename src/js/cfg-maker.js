import * as esprima from 'esprima';


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {range:true});
};

function buildGraph(code){
    const esgraph = require('esgraph');
    const parsedCode = parseCode(code);
    const cfg = esgraph(parsedCode);
    removeExceptions(cfg[2]);
    // joinNormals(cfg[0].normal);
    const dot = 'digraph { ' + esgraph.dot(cfg, { source: code }) + ' }';
    return dot;
}

function removeExceptions(cfg){
    cfg.forEach(node => delete node.exception);
}

function joinNormals(node){
    if (!node)
        return;
    while (node.normal && node.normal.normal){
        let next = node.normal;
        node.next = next.next;
        node.normal = next.normal;
        node.true = next.true;
        node.false = next.false;
        node.astNode = [node.astNode, next.astNode];
    }
    node.next.forEach(next => joinNormals(next));
    // joinNormals(node.normal);
    // joinNormals(node.true);
    // joinNormals(node.normal);
}

export {buildGraph};