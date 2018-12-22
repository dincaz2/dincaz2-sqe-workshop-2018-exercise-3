function dot(nodes) {
    const output = ['digraph cfg { '];
    printNodes(nodes, output);
    printEdges(nodes, output);
    output.push(' }');
    return output.join('');
}

function printNodes(nodes, output){
    for (const [i, node] of nodes.entries()) {
        output.push(`n${i} [label="${node.label}" xlabel=${i+1}`);
        if (node.color)
            output.push(' style = filled fillcolor = darkolivegreen3');
        let shape = 'box';
        if (node.true || node.false)
            shape = 'diamond';
        output.push(` shape="${shape}"]\n`);
    }
}

function printEdges(nodes, output){
    for (const [i, node] of nodes.entries()) {
        for (const type of ['normal', 'true', 'false']) {
            handleNodeWithType(nodes, output, i, node, type);
        }
    }
}

function handleNodeWithType(nodes, output, i, node, type){
    const next = node[type];
    if (!next) return;
    output.push(`n${i} -> n${nodes.indexOf(next)} [`);
    if (['true', 'false'].includes(type)) output.push(`label="${type.charAt(0).toUpperCase()}"`);
    output.push(']\n');
}

export {dot};