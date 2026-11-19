const csv = document.getElementById("dataset").textContent.trim();
const visits = csv.split("\n").slice(1).map(line => {
  const [time, weekday, weekend] = line.split(",");
  return { time, hour: Number(time.slice(0, 2)), weekday: Number(weekday), weekend: Number(weekend) };
});
const peakDay = visits.reduce((a, b) => a.weekday >= b.weekday ? a : b);
const peakEnd = visits.reduce((a, b) => a.weekend >= b.weekend ? a : b);

function clockText(hour) {
  if (hour === 12) return "noon";
  return (hour % 12 || 12) + (hour < 12 ? " am" : " pm");
}

function svgPart(name, attributes, text) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (text !== undefined) element.textContent = text;
  return element;
}

// Monotone interpolation passes through every sample and preserves local peaks.
function curve(points) {
  const steps = points.slice(1).map((p, i) => p.y - points[i].y);
  const slopes = points.map((_, i) => {
    if (!i) return steps[0];
    if (i === steps.length) return steps[i - 1];
    const a = steps[i - 1], b = steps[i];
    return a * b <= 0 ? 0 : 2 * a * b / (a + b);
  });
  let path = "M " + points[0].x + " " + points[0].y;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], dx = (b.x - a.x) / 3;
    path += " C " + [a.x + dx, a.y + slopes[i - 1] / 3, b.x - dx, b.y - slopes[i] / 3, b.x, b.y].join(" ");
  }
  return path;
}

let plotIndex = 0;
function drawVisits(plot) {
  const width = Math.round(plot.clientWidth), height = Math.round(plot.clientHeight);
  if (!width || !height) return;
  if (!plot.dataset.fill) plot.dataset.fill = "area-" + ++plotIndex;
  const start = 27, end = width - 20, base = height - 23, top = 18;
  const x = hour => start + (hour - visits[0].hour) / (visits.at(-1).hour - visits[0].hour) * (end - start);
  const y = value => base - value / 90 * (base - top);
  plot.setAttribute("viewBox", [0, 0, width, height].join(" "));
  plot.setAttribute("aria-label", "Average visitors by hour. Weekdays peak at " + peakDay.weekday + " at " + clockText(peakDay.hour) + ". Weekends peak at " + peakEnd.weekend + " at " + clockText(peakEnd.hour) + ".");
  plot.replaceChildren();
  const defs = svgPart("defs", {});
  const fade = svgPart("linearGradient", { id: plot.dataset.fill, x1: "0", x2: "0", y1: "0", y2: "1" });
  fade.append(svgPart("stop", { offset: "0", "stop-color": "#777acd", "stop-opacity": ".19" }), svgPart("stop", { offset: "1", "stop-color": "#777acd", "stop-opacity": ".025" }));
  defs.append(fade);
  plot.append(defs);
  const label = (content, px, py, anchor, extra = {}) => svgPart("text", { x: px, y: py, fill: "#686d7a", "font-size": 11.5, "text-anchor": anchor, ...extra }, content);
  for (const value of [0, 30, 60, 90]) {
    plot.append(svgPart("line", { x1: start, x2: end, y1: y(value), y2: y(value), stroke: value ? "#e6e7ee" : "#d4d6e0", "stroke-width": 1, "stroke-dasharray": value ? "3 4" : "none" }));
    plot.append(label(value, start - 9, y(value) + 4, "end"));
  }
  for (const hour of (width < 410 ? [8, 12, 14, 18] : [8, 10, 12, 14, 16, 18])) {
    plot.append(label(hour === 12 ? "Noon" : clockText(hour), x(hour), base + 18, "middle"));
  }
  for (const series of ["weekday", "weekend"]) {
    const isDay = series === "weekday", colour = isDay ? "#5556a7" : "#ad5f36";
    const points = visits.map(row => ({ x: x(row.hour), y: y(row[series]) }));
    const path = curve(points);
    if (isDay) plot.append(svgPart("path", { d: path + " L " + end + " " + base + " H " + start + " Z", fill: "url(#" + plot.dataset.fill + ")" }));
    plot.append(svgPart("path", { d: path, fill: "none", stroke: colour, "stroke-width": 2.7, "stroke-dasharray": isDay ? "none" : "6 5", "stroke-linecap": "round", "stroke-linejoin": "round" }));
  }
  for (const [row, key, colour] of [[peakDay, "weekday", "#5556a7"], [peakEnd, "weekend", "#ad5f36"]]) {
    const cx = x(row.hour), cy = y(row[key]);
    const marker = key === "weekday" ? svgPart("circle", { cx, cy, r: 4.5 }) : svgPart("rect", { x: cx - 3.8, y: cy - 3.8, width: 7.6, height: 7.6, transform: "rotate(45 " + cx + " " + cy + ")" });
    marker.setAttribute("fill", colour); marker.setAttribute("stroke", "white"); marker.setAttribute("stroke-width", "1.7");
    plot.append(marker, label(row[key], cx, cy - 10, "middle", { fill: colour, "font-size": 12, "font-weight": 650, stroke: "white", "stroke-width": 3, "paint-order": "stroke" }));
  }
}
const plotSizes = new ResizeObserver(entries => entries.forEach(entry => drawVisits(entry.target)));
