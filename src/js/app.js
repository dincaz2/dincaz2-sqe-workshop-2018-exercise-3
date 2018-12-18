import $ from 'jquery';
import {buildGraph} from './cfg-maker';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let cfgDot = buildGraph(codeToParse);

        let graphElement = document.getElementById('graph');
        var viz = new Viz({ Module, render });
        viz.renderSVGElement(cfgDot)
            .then(function(element) {
                graphElement.innerHTML = '';
                graphElement.append(element);
            });
        // let parsedCode = parseCode(codeToParse);
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        // populateTable(parseAndView(parsedCode));
    });
});

function populateTable(rows){
    let table = document.getElementById('parseTable');
    if (table === null) {
        table = document.createElement('table');
        table.id = 'parseTable';
    } else
        table.innerHTML = '';
    for (let row of rows) {
        let newRow = table.insertRow();
        for (let cell of row) {
            let newCell = newRow.insertCell();
            newCell.textContent = cell;
        }
    }
    document.body.appendChild(table);
}
