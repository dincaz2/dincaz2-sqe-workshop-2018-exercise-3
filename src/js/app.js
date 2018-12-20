import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {buildGraph} from './cfg-maker';
import {dot} from './dotter';
import {colorPath} from './code-evaluator';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let cfg = buildGraph(parsedCode);
        colorPath(cfg, parsedCode, $('#parametersPlaceholder').val());
        let cfgDot = dot(cfg);
        renderDot(cfgDot);
    });
});

function renderDot(dot){
    let graphElement = document.getElementById('graph');
    var viz = new Viz({ Module, render });
    viz.renderSVGElement(dot)
        .then(function(element) {
            graphElement.innerHTML = '';
            graphElement.append(element);
        });
}
