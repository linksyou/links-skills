const byId = id => document.getElementById(id);
const fromTemplate = id => byId(id + "-template").content.firstElementChild.cloneNode(true);
const panel = byId("panel"), drawer = byId("drawer"), thread = byId("thread");
const input = byId("prompt"), scroller = byId("scroll");

function make(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function icon(name) {
  const svg = svgPart("svg", { class: "ic", "aria-hidden": "true" });
  svg.append(svgPart("use", { href: "#" + name }));
  return svg;
}
function button(text, action, className) {
  const node = make("button", text, className);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}
function peakAnswer() {
  const difference = peakEnd.hour - peakDay.hour;
  const offset = difference === 2 ? "two" : String(difference);
  return {
    heading: "Weekends peak " + offset + " hours later.",
    body: "The weekday high is **" + peakDay.weekday + " visitors at " + clockText(peakDay.hour) + "**, compared with **" + peakEnd.weekend + " at " + clockText(peakEnd.hour) + "** on weekends.",
    chart: true
  };
}
function hourly(row) {
  return { body: "At **" + clockText(row.hour) + "**, the reading room averages **" + row.weekday + " visitors on weekdays** and **" + row.weekend + " on weekends**." };
}
function answerFor(question) {
  const query = question.toLowerCase();
  if (/quiet|lowest|least|empty/.test(query)) {
    const weekend = visits.reduce((a, b) => a.weekend <= b.weekend ? a : b);
    const minimum = Math.min(...visits.map(row => row.weekday));
    const times = visits.filter(row => row.weekday === minimum).map(row => clockText(row.hour)).join(" and ");
    return { body: "The quietest weekend hour is **" + clockText(weekend.hour) + "** with **" + weekend.weekend + " visitors**. Weekdays reach their low of **" + minimum + "** at **" + times + "**." };
  }
  if (/clos(e|ing)|last hour/.test(query)) return hourly(visits.at(-1));
  const hour24 = query.match(/\b([01]?\d|2[0-3]):00\b/);
  const hour12 = query.match(/\b(1[0-2]|[1-9])\s*(am|pm)\b/);
  let hour;
  if (hour24) hour = Number(hour24[1]);
  else if (hour12) hour = Number(hour12[1]) % 12 + (hour12[2] === "pm" ? 12 : 0);
  else if (query.includes("noon")) hour = 12;
  if (hour !== undefined) {
    const row = visits.find(item => item.hour === hour);
    return row ? hourly(row) : { body: "This file has one observation per hour from **8 am to 6 pm**. Choose an hour in that range to compare weekday and weekend visits." };
  }
  if (/peak|busy|busiest|later|staff|chart|plot|graph|compare/.test(query)) return peakAnswer();
  return { body: "I can use **reading-room.csv** to compare the two peaks, find the quietest hour, or look up a specific time. Try “How many visitors come at 10 am?”" };
}

const samples = [
  ["traffic", "Reading room traffic", "When is the reading room busiest on weekdays and weekends?"],
  ["staff", "Weekend staffing notes", "When is weekend demand at its peak?"],
  ["morning", "The morning rush", "How many visitors arrive at 10 am?"],
  ["quiet", "Finding a quiet hour", "When is the reading room quietest?"],
  ["closing", "Closing-time comparison", "How many visitors are there at closing time?"]
];
function newState(id, title) {
  return { id, title, turns: [], draft: "", attached: false, scrollTop: 0 };
}
const chats = samples.map(([id, title, question]) => {
  const chat = newState(id, title);
  chat.turns.push({ question, file: true, answer: answerFor(question) });
  return chat;
});
let current = chats[0], nextId = 1;

function richText(target, text) {
  for (const part of text.split(/(\*\*.+?\*\*)/g)) {
    target.append(part.startsWith("**") ? make("strong", part.slice(2, -2)) : document.createTextNode(part));
  }
}
function appendTurn(turn) {
  thread.querySelector(".followups")?.remove();
  const question = make("div", undefined, "question");
  if (turn.file) question.append(fromTemplate("file"));
  question.append(make("p", turn.question, "user-bubble"));
  const reply = fromTemplate("answer");
  const content = reply.querySelector(".reply-content");
  if (turn.answer.heading) content.append(make("h2", turn.answer.heading));
  const p = make("p");
  richText(p, turn.answer.body); content.append(p);
  if (turn.answer.chart) content.append(fromTemplate("chart"));
  if (turn.rating) reply.querySelector("[data-action=" + turn.rating + "]").setAttribute("aria-pressed", "true");
  reply.dataset.index = String(current.turns.indexOf(turn));
  if (turn.answer.chart && turn === current.turns.at(-1)) {
    const followups = make("div", undefined, "followups");
    for (const text of ["Find the quietest hour", "Compare closing time"]) {
      const next = button(text, () => submitQuestion(text, false));
      next.append(icon("chevron-right")); followups.append(next);
    }
    reply.append(followups);
  }
  thread.append(question, reply);
  const plot = reply.querySelector(".plot");
  if (plot) { drawVisits(plot); plotSizes.observe(plot); }
}
function threadButton(chat, inHistory) {
  const node = button(chat.title, () => openChat(chat), "history-item");
  node.title = chat.title;
  if (inHistory && current === chat) node.setAttribute("aria-current", "page");
  return node;
}
function refreshHistory() {
  byId("history").replaceChildren(...chats.map(chat => threadButton(chat, true)));
}
function resizeInput() {
  input.style.height = "auto";
  input.style.height = Math.min(100, input.scrollHeight) + "px";
  byId("send").disabled = !input.value.trim();
}
function updateAttachment() {
  const chip = byId("draft-file");
  chip.hidden = !current.attached;
  chip.replaceChildren();
  if (!current.attached) return;
  const remove = button("", () => { current.attached = false; updateAttachment(); input.focus(); });
  remove.setAttribute("aria-label", "Remove attachment"); remove.title = "Remove attachment"; remove.append(icon("x"));
  chip.append("reading-room.csv", remove);
}
function renderChat() {
  thread.querySelectorAll(".plot").forEach(plot => plotSizes.unobserve(plot));
  thread.replaceChildren();
  byId("chat-title").textContent = current.title;
  document.title = current.title + " · Marginalia";
  byId("export").disabled = !current.turns.length;
  if (current.turns.length) current.turns.forEach(appendTurn);
  else {
    const empty = make("div", undefined, "empty");
    empty.append(make("h2", "Ask about the reading room"));
    empty.append(button("Compare weekday and weekend peaks", () => {
      input.value = "Compare weekday and weekend peaks."; current.draft = input.value; resizeInput(); input.focus();
    }, "suggestion"));
    thread.append(empty);
  }
  input.value = current.draft;
  input.placeholder = current.turns.length ? "Ask a follow-up…" : "Message Marginalia…";
  resizeInput(); updateAttachment(); refreshHistory();
  scroller.scrollTop = current.scrollTop;
}
function openChat(chat) {
  if (drawer.open) drawer.close();
  if (panel.open) panel.close();
  current.draft = input.value; current.scrollTop = scroller.scrollTop;
  current = chat;
  renderChat();
}
function createChat() {
  const empty = chats.find(chat => !chat.turns.length && !chat.draft && !chat.attached);
  const chat = empty || newState("new-" + nextId++, "New chat");
  if (!empty) chats.unshift(chat);
  openChat(chat); input.focus();
}
input.addEventListener("input", () => { current.draft = input.value; resizeInput(); });
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault(); byId("composer").requestSubmit();
  }
});
function submitQuestion(question, fromComposer) {
  if (!question) return;
  const first = !current.turns.length;
  const turn = { question, file: fromComposer && current.attached, answer: answerFor(question) };
  current.turns.push(turn);
  if (fromComposer) { current.attached = false; current.draft = ""; input.value = ""; }
  if (first) {
    current.title = question;
    renderChat();
  } else {
    appendTurn(turn); resizeInput(); updateAttachment();
  }
  scroller.scrollTop = scroller.scrollHeight;
  input.focus();
  byId("notice").textContent = "Answer added to " + current.title;
}
byId("composer").addEventListener("submit", event => {
  event.preventDefault();
  submitQuestion(input.value.trim(), true);
});

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = make("a"); anchor.href = url; anchor.download = filename;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function showPanel(title, ...nodes) {
  if (drawer.open) drawer.close();
  byId("panel-title").textContent = title;
  byId("panel-body").replaceChildren(...nodes);
  if (!panel.open) panel.showModal();
}
function sourceTable() {
  const table = make("table");
  const heading = table.createTHead().insertRow();
  for (const text of ["Hour", "Weekdays", "Weekends"]) {
    const th = make("th", text); th.scope = "col"; heading.append(th);
  }
  const body = table.createTBody();
  for (const visit of visits) {
    const tr = body.insertRow();
    for (const value of [visit.time, visit.weekday, visit.weekend]) tr.insertCell().textContent = value;
  }
  const save = button("Download CSV", () => download("reading-room.csv", csv + "\n", "text/csv"), "panel-action");
  save.prepend(icon("download"));
  showPanel("reading-room.csv", make("p", "Average number of visitors in each hourly observation."), table, save);
}
function sourceLibrary(choose) {
  const file = fromTemplate("file");
  file.addEventListener("click", () => {
    if (!choose) { sourceTable(); return; }
    current.attached = true; updateAttachment(); panel.close(); input.focus();
  });
  showPanel(choose ? "Attach a source" : "Source library", file);
}
function chatList(searchable) {
  const list = make("nav");
  const fill = (term = "") => {
    const matches = chats.filter(chat => chat.title.toLowerCase().includes(term.toLowerCase()));
    list.replaceChildren(...matches.map(chat => threadButton(chat, false)));
    if (!matches.length) list.append(make("p", "No matching chats."));
  };
  fill();
  if (!searchable) { showPanel("Library study", list); return; }
  const search = make("input");
  search.type = "search"; search.placeholder = "Search by chat title"; search.setAttribute("aria-label", "Search by chat title");
  search.addEventListener("input", () => fill(search.value));
  showPanel("Search chats", search, list); search.focus();
}

const rail = byId("rail");
byId("menu").addEventListener("click", () => { drawer.append(rail); drawer.showModal(); });
drawer.addEventListener("close", () => { if (!drawer.open) byId("shell").prepend(rail); });
window.matchMedia("(max-width: 720px)").addEventListener("change", event => {
  if (!event.matches && drawer.open) drawer.close();
});
for (const dialog of [panel, drawer]) {
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}
byId("new-chat").addEventListener("click", createChat);
byId("search").addEventListener("click", () => chatList(true));
byId("project").addEventListener("click", () => chatList(false));
byId("sources").addEventListener("click", () => sourceLibrary(false));
byId("attach").addEventListener("click", () => sourceLibrary(true));
if (!/Mac|iPad|iPhone/.test(navigator.platform)) byId("search-key").textContent = "Ctrl K";
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); chatList(true);
  }
});
byId("export").addEventListener("click", () => {
  const lines = ["# " + current.title];
  for (const { question, file, answer } of current.turns) {
    lines.push("## You", ...(file ? ["Attachment: reading-room.csv"] : []), question, "## Marginalia");
    if (answer.heading) lines.push(answer.heading);
    lines.push(answer.body);
    if (answer.chart) lines.push(csv);
  }
  download(current.id + ".md", lines.join("\n\n") + "\n", "text/markdown");
});
thread.addEventListener("click", async event => {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const name = action.dataset.action;
  if (name === "file") { sourceTable(); return; }
  const reply = action.closest(".reply");
  if (!reply) return;
  const turn = current.turns[Number(reply.dataset.index)];
  if (name === "copy") {
    const plain = [turn.answer.heading, turn.answer.body.replaceAll("**", "")].filter(Boolean).join("\n\n");
    try {
      await navigator.clipboard.writeText(plain);
      action.replaceChildren(icon("check"));
      byId("notice").textContent = "Answer copied.";
      setTimeout(() => action.replaceChildren(icon("copy")), 1300);
    } catch {
      const text = make("textarea"); text.value = plain; text.readOnly = true; text.setAttribute("aria-label", "Answer to copy");
      showPanel("Copy answer", text); text.select();
    }
    return;
  }
  turn.rating = turn.rating === name ? undefined : name;
  reply.querySelectorAll("[aria-pressed]").forEach(control => control.setAttribute("aria-pressed", String(turn.rating === control.dataset.action)));
});
renderChat();
