// https://observablehq.com/@mbostock/pack-o-matic@500
import define1 from "./71cf6720f671feea@216.js";
import define2 from "./576f8943dbfbd395@114.js";
import define3 from "./5b4cd9a986b9fe0f@175.js";

function _1(md){return(
md`# Pack-o-Matic

Edit the textarea below to update the chart!`
)}

function _rooted(html)
{
  const form = html`<form>
  <label>
    <input name=checkbox type=checkbox>
    Show root circle
  </label>
`;
  form.checkbox.onclick = () => {
    form.value = form.checkbox.checked;
    form.dispatchEvent(new CustomEvent("input"));
  };
  form.value = form.checkbox.checked;
  return form;
}


function _sorted(html)
{
  const form = html`<form><label><input name=checkbox type=checkbox checked> Sort by value</label>`;
  form.checkbox.onclick = () => (form.value = form.checkbox.checked, form.dispatchEvent(new CustomEvent("input")));
  form.value = form.checkbox.checked;
  return form;
}


function _chart(pack,data,d3,rooted,DOM,fit,format,lightColor,darkColor,autosize)
{
  const root = pack(data);

  const circle = d3.arc()
      .innerRadius(0)
      .outerRadius(d => d)
      .startAngle(-Math.PI)
      .endAngle(Math.PI);

  const svg = d3.create("svg")
      .style("width", "100%")
      .style("height", "auto")
      .style("background", "#fff")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle");

  const node = svg.selectAll("g")
    .data(root.descendants().slice(rooted ? 0 : 1).reverse())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  node.append("path")
      .attr("id", d => (d.circleUid = DOM.uid("circle")).id)
      .attr("d", d => circle(d.r));

  const internal = node.filter(d => d.children);

  internal.select("path")
      .attr("stroke", d => d.data.color)
      .attr("fill", "none");

  internal.append("text")
      .attr("dy", "1em")
      .attr("fill", "#555")
    .append("textPath")
      .attr("xlink:href", d => d.circleUid.href)
      .attr("startOffset", "50%")
      .text(d => d.data.name);

  const leaf = node.filter(d => !d.children)
      .attr("fill", d => d.data.color);

  leaf.append("text")
      .each(d => {
        const {lines, radius} = fit(d.data.name, isNaN(d.data.value) ? undefined : format(d.data.value));
        d.lines = lines;
        if (!isNaN(d.data.value)) d.lines[d.lines.length - 1].value = true;
      })
      .attr("fill", d => d3.lab(d.data.color).l < 60 ? lightColor : darkColor)
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


async function _5(html,DOM,rasterize,chart,serialize){return(
html`
${DOM.download(await rasterize(chart), null, "Download as PNG")}
${DOM.download(await serialize(chart), null, "Download as SVG")}
`
)}

function* _source(html)
{
  const textarea = html`<textarea>World
 Asia
  China,1409517397
  India,1339180127
  Indonesia,263991379
  Pakistan,197015955
  Bangladesh,164669751
  Japan,127484450
  Philippines,104918090
  Vietnam,95540800
 Europe
  Russia,143989754
  Germany,82114224
 Americas
  United States,324459463,#333
  Brazil,209288278
  Mexico,129163276
 Africa
  Nigeria,190886311
  Ethiopia,104957438
  Egypt,97553151`;
  textarea.onkeypress = event => {
    if (event.key !== "Enter" || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return;
    let i = textarea.selectionStart;
    let j = textarea.selectionEnd;
    let v = textarea.value;
    if (i === j) {
      let k = 0;
      while (i > 0 && v[--i - 1] !== "\n");
      while (i < j && v[i] === " ") ++i, ++k;
      textarea.value = v.substring(0, j) + "\n" + new Array(k + 1).join(" ") + v.substring(j);
      textarea.selectionStart = textarea.selectionEnd = j + k + 1;
      textarea.dispatchEvent(new CustomEvent("input"));
      event.preventDefault();
    }
  };
  textarea.oninput = () => {
    textarea.style.height = "initial";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  yield textarea;
  textarea.oninput();
}


function _7(md){return(
md`Each line in the textarea above represents a node in the tree. The depth of the node is determined by the number of leading spaces (the indentation): the root node has depth zero; its direct children have depth one; their children have depth two, and so on. The parent of each node is the closest preceding node with lesser depth.

The area of each node is determined by the number after the comma. You can also specify a fill color after the number. The contents of the textarea are interpreted as [CSV](https://en.wikipedia.org/wiki/Comma-separated_values), so put quotes around names if you want them to contain commas.`
)}

function _8(md){return(
md`---

## Appendix`
)}

function _data(cstParseRows,source,fillColor){return(
cstParseRows(source, ([name, value, color = fillColor]) => ({
  name, 
  value: value === undefined ? undefined : +value, 
  color
}))
)}

function _pack(d3,sorted,width,height){return(
data => {
  const root = d3.hierarchy(data);
  root.sum(d => d.children ? 0 : isNaN(d.value) ? 1 : d.value);
  if (sorted) root.sort((a, b) => b.value - a.value);
  return d3.pack()
      .size([width - 2, height - 2])
      .padding(3)
    (root);
}
)}

function _format(d3){return(
d3.format(",d")
)}

function _height(){return(
720
)}

function _fillColor(){return(
"#e4e4e4"
)}

function _lightColor(){return(
"#fff"
)}

function _darkColor(){return(
"#000"
)}

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

function _21(html){return(
html`<style>

textarea {
  display: block;
  boxSizing: border-box;
  width: calc(100% + 28px);
  font: var(--monospace-font, var(--mono_fonts));
  minHeight: 33px;
  border: none;
  padding: 4px 10px;
  margin: 0 -14px;
  background: rgb(247,247,249);
  tabSize: 2;
}

textarea:focus {
  outline: none;
}

</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof rooted")).define("viewof rooted", ["html"], _rooted);
  main.variable(observer("rooted")).define("rooted", ["Generators", "viewof rooted"], (G, _) => G.input(_));
  main.variable(observer("viewof sorted")).define("viewof sorted", ["html"], _sorted);
  main.variable(observer("sorted")).define("sorted", ["Generators", "viewof sorted"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["pack","data","d3","rooted","DOM","fit","format","lightColor","darkColor","autosize"], _chart);
  main.variable(observer()).define(["html","DOM","rasterize","chart","serialize"], _5);
  main.variable(observer("viewof source")).define("viewof source", ["html"], _source);
  main.variable(observer("source")).define("source", ["Generators", "viewof source"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("data")).define("data", ["cstParseRows","source","fillColor"], _data);
  main.variable(observer("pack")).define("pack", ["d3","sorted","width","height"], _pack);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("fillColor")).define("fillColor", _fillColor);
  main.variable(observer("lightColor")).define("lightColor", _lightColor);
  main.variable(observer("darkColor")).define("darkColor", _darkColor);
  main.variable(observer("autosize")).define("autosize", _autosize);
  const child1 = runtime.module(define1);
  main.import("fit", child1);
  main.import("measureWidth", child1);
  const child2 = runtime.module(define2);
  main.import("rasterize", child2);
  main.import("serialize", child2);
  const child3 = runtime.module(define3);
  main.import("cstParseRows", child3);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["html"], _21);
  return main;
}
