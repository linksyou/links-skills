const notes = {
  light: {
    type: "Research paper · October 2026",
    title: "What survives a change in light?",
    paragraphs: [
      "A sphere on a table stays put when a lamp moves. Its brightest point, its shadow and almost every pixel in its image change. Which of those cues does a vision model treat as the object?",
      "We photograph the same surfaces under a sequence of light positions, then compare the patches a model groups together. A moving shadow can split a single surface into two. Repeating the test with a matte finish helps separate the effect of the shadow from that of a reflection."
    ]
  },
  depth: {
    type: "Field note · September 2026",
    title: "Depth from a second glance",
    paragraphs: [
      "Close one eye, then the other. Nearby edges appear to shift farther than distant ones. A pair of cameras can use the same displacement to estimate depth.",
      "In our test scene, two ridges overlap from one viewpoint. Moving the camera sideways reveals a strip of the rear ridge. We track where the new strip appears and which points are visible in both frames."
    ]
  },
  approach: {
    type: "Our approach",
    title: "Change one thing at a time.",
    paragraphs: [
      "We start with scenes simple enough to take apart. We keep a shape still, change the light, and look for the first point at which a model changes its answer.",
      "Each study pairs a visual experiment with a written account of its limits. Our field notes collect the observations that lead to the next experiment."
    ]
  },
  about: {
    type: "About the lab",
    title: "Serein Research",
    paragraphs: [
      "Serein is an independent lab studying machine perception. We use controlled visual experiments to ask which parts of an image a model relies on to recognise a scene.",
      "The lab publishes its studies alongside shorter field notes on lighting, viewpoint and the limits of visual recognition."
    ]
  }
};

const noteDialog = document.getElementById("note-dialog");
for (const button of document.querySelectorAll("[data-note]")) {
  button.addEventListener("click", () => {
    const note = notes[button.dataset.note];
    document.getElementById("note-type").textContent = note.type;
    document.getElementById("note-title").textContent = note.title;
    document.getElementById("note-body").replaceChildren(...note.paragraphs.map(text => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    }));
    noteDialog.querySelector(".note-link").hidden = button.dataset.note !== "about";
    if (!noteDialog.open) noteDialog.showModal();
    else document.getElementById("note-title").focus();
  });
}
noteDialog.addEventListener("click", event => {
  if (event.target !== noteDialog) return;
  const r = noteDialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) noteDialog.close();
});

// A printed dot's radius follows the illumination of a sphere by a side light.
const light = document.getElementById("light-plate").getContext("2d");
light.fillStyle = "#becdba";
light.fillRect(0, 0, 336, 224);
light.fillStyle = "#25372f";
for (let row = 0; row < 48; row++) {
  for (let col = 0; col < 75; col++) {
    const x = col * 4.8 + (row % 2) * 2.4, y = row * 4.8;
    const nx = (x - 169) / 86, ny = (y - 109) / 86;
    const r2 = nx * nx + ny * ny;
    let radius = .34;
    if (r2 <= 1) {
      const nz = Math.sqrt(1 - r2);
      const lit = Math.max(0, -.71 * nx - .54 * ny + .38 * nz);
      radius = 3.16 - lit * 2.78;
    } else if (y > 190 && ((x - 196) / 85) ** 2 + ((y - 197) / 8) ** 2 < 1) {
      radius = 1.1;
    }
    light.beginPath();
    light.arc(x, y, radius, 0, 2 * Math.PI);
    light.fill();
  }
}

// Two overlapping ridges, plotted as cross-sections along the depth axis.
const depth = document.getElementById("depth-plate").getContext("2d");
depth.fillStyle = "#c8c8e2";
depth.fillRect(0, 0, 336, 224);
depth.strokeStyle = "#404565";
depth.lineWidth = 1.6;
for (let z = 0; z < 42; z++) {
  depth.beginPath();
  for (let x = -24; x <= 360; x += 3) {
    const ridge = 89 * Math.exp(-((x - 137 - z * 1.2) ** 2 / 3100 + (z - 17) ** 2 / 420));
    const shoulder = 64 * Math.exp(-((x - 189 - z * 1.25) ** 2 / 1070 + (z - 25) ** 2 / 180));
    const y = 89 + z * 2.55 - ridge - shoulder + Math.sin((x + 2 * z) / 49) * 6;
    if (x === -24) depth.moveTo(x, y);
    else depth.lineTo(x, y);
  }
  depth.stroke();
}
