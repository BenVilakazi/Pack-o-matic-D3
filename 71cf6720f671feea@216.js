// https://observablehq.com/@mbostock/bubble-o-matic@216
import define1 from "./576f8943dbfbd395@114.js";

function _1(md){return(
md`# Bubble-o-Matic

Edit the textarea below to update the chart!`
)}

function _sorted(html)
{
  const form = html`<form><label><input name=checkbox type=checkbox checked> Sort by value</label>`;
  form.checkbox.onclick = () => (form.value = form.checkbox.checked, form.dispatchEvent(new CustomEvent("input")));
  form.value = form.checkbox.checked;
  return form;
}


function _chart(pack,data,d3,fillColor,lightColor,darkColor,fit,format,autosize)
{
  const root = pack(data);
  const leaves = root.leaves().filter(d => d.depth && d.value);

  const svg = d3.create("svg")
      .style("width", "100%")
      .style("height", "auto")
      .style("background", "#fff")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle");

  svg.append("g")
      .attr("fill", fillColor)
    .selectAll("circle")
    .data(leaves)
    .enter().append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .attr("fill", d => d.data.color);

  svg.append("g")
      .attr("pointer-events", "none")
    .selectAll("text")
    .data(leaves)
    .enter().append("text")
      .attr("fill", d => d3.lab(d.data.color).l < 60 ? lightColor : darkColor)
      .attr("transform", d => {
        const {lines, radius} = fit(d.data.name, isNaN(d.data.value) ? undefined : format(d.data.value));
        d.lines = lines;
        if (!isNaN(d.data.value)) d.lines[d.lines.length - 1].value = true;
        return `translate(${d.x},${d.y})`;
      })
    .selectAll("tspan")
    .data(d => d.lines)
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, data) => (i - data.length / 2 + 0.8) * 11)
      .text(d => d.text)
    .filter(d => d.value)
      .attr("font-weight", 300)
      .attr("fill-opacity", 0.5);

  return autosize(svg.node());
}


async function _4(html,DOM,rasterize,chart,serialize){return(
html`
${DOM.download(await rasterize(chart), null, "Download as PNG")}
${DOM.download(await serialize(chart), null, "Download as SVG")}
`
)}

function* _source(html)
{
  const textarea = html`<textarea>China,1409517397
India,1339180127
United States,324459463,#333
Indonesia,263991379
Brazil,209288278
Pakistan,197015955
Nigeria,190886311
Bangladesh,164669751
Russia,143989754
Mexico,129163276
Japan,127484450
Ethiopia,104957438
Philippines,104918090
Egypt,97553151
Vietnam,95540800
Germany,82114224`;
  textarea.style.display = "block";
  textarea.style.boxSizing = "border-box";
  textarea.style.width = "calc(100% + 28px)";
  textarea.style.font = "var(--mono_fonts)";
  textarea.style.minHeight = "60px";
  textarea.style.border = "none";
  textarea.style.padding = "4px 10px";
  textarea.style.margin = "0 -14px";
  textarea.style.background = "rgb(247,247,249)";
  textarea.style.tabSize = 2;
  textarea.oninput = () => {
    textarea.style.height = "initial";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  yield textarea;
  textarea.oninput();
}


function _6(md){return(
md`Each line in the textarea above represents a bubble in the chart. The area of the circle is determined by the number after the comma. You can also specify a fill color after the number. (The contents of the textarea are interpreted as [CSV](https://en.wikipedia.org/wiki/Comma-separated_values), so put quotes around names if you want them to contain commas.)`
)}

function _7(md){return(
md`---

## Appendix`
)}

function _data(d3,source,sorted)
{
  const data = d3.csvParseRows(source, ([name, value, color]) => ({name, value: !value || isNaN(value = +value) ? undefined : value, color}));
  if (sorted) data.sort((a, b) => b.value - a.value);
  return data;
}


function _pack(d3,width,height){return(
data => {
  let alt = d3.median(data, d => d.value);
  if (!alt) alt = 1;
  return d3.pack()
      .size([width, height])
      .padding(3)
    (d3.hierarchy({children: data})
      .sum(d => isNaN(d.value) ? alt : d.value));
}
)}

function _width(){return(
954
)}

function _height(){return(
720
)}

function _fillColor(){return(
"#ddd"
)}

function _lightColor(){return(
"#fff"
)}

function _darkColor(){return(
"#000"
)}

function _format(d3){return(
d3.format(",d")
)}

function _fit(measureWidth){return(
function fit(text, value) {
  let line;
  let lineWidth0 = Infinity;
  const lineHeight = 12;
  const targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);
  const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) words.pop();
  if (!words[0]) words.shift();
  const lines = [];
  for (let i = 0, n = words.length; i < n; ++i) {
    let lineText1 = (line ? line.text + " " : "") + words[i];
    let lineWidth1 = measureWidth(lineText1);
    if ((lineWidth0 + lineWidth1) * 0.4 < targetWidth) {
      line.width = lineWidth0 = lineWidth1;
      line.text = lineText1;
    } else {
      lineWidth0 = measureWidth(words[i]);
      line = {width: lineWidth0, text: words[i]};
      lines.push(line);
    }
  }
  if (value !== undefined) lines.push({width: measureWidth(value), text: value});
  let radius = 0;
  for (let i = 0, n = lines.length; i < n; ++i) {
    const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
    const dx = lines[i].width / 2;
    radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
  }
  return {lines, radius};
}
)}

function _measureWidth()
{
  const context = document.createElement("canvas").getContext("2d");
  return text => context.measureText(text).width;
}


function _autosize(){return(
function autosize(svg) {
  document.body.appendChild(svg);
  const box = svg.getBBox();
  document.body.removeChild(svg);
  svg.setAttribute("viewBox", `${box.x - 1} ${box.y - 1} ${box.width + 2} ${box.height + 2}`);
  return svg;
}
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof sorted")).define("viewof sorted", ["html"], _sorted);
  main.variable(observer("sorted")).define("sorted", ["Generators", "viewof sorted"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["pack","data","d3","fillColor","lightColor","darkColor","fit","format","autosize"], _chart);
  main.variable(observer()).define(["html","DOM","rasterize","chart","serialize"], _4);
  main.variable(observer("viewof source")).define("viewof source", ["html"], _source);
  main.variable(observer("source")).define("source", ["Generators", "viewof source"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("data")).define("data", ["d3","source","sorted"], _data);
  main.variable(observer("pack")).define("pack", ["d3","width","height"], _pack);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("fillColor")).define("fillColor", _fillColor);
  main.variable(observer("lightColor")).define("lightColor", _lightColor);
  main.variable(observer("darkColor")).define("darkColor", _darkColor);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer("fit")).define("fit", ["measureWidth"], _fit);
  main.variable(observer("measureWidth")).define("measureWidth", _measureWidth);
  main.variable(observer("autosize")).define("autosize", _autosize);
  const child1 = runtime.module(define1);
  main.import("rasterize", child1);
  main.import("serialize", child1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
