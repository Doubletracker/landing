(() => {
  "use strict";

  const config = window.DOUBLETRACKER_CONFIG || {};
  const trackDefinitions = [
    ["original", "Reference DI", "recorded · mono"],
    ["originalMix", "Reference mix", "recorded L + recorded R"],
    ["generated", "Generated DI", "model output · mono"],
    ["generatedMix", "Generated mix", "reference L + generated R"]
  ];

  function createTrack(files, definition) {
    const [key, title, detail] = definition;
    const track = document.createElement("div");
    track.className = `track${key.includes("generated") || key === "generated" ? " generated-track" : ""}`;

    const label = document.createElement("div");
    label.className = "track-label";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = detail;
    label.append(strong, small);
    track.append(label);

    if (files && files[key]) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "metadata";
      audio.src = files[key];
      audio.setAttribute("aria-label", `${title}: ${detail}`);
      track.append(audio);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "audio-placeholder";
      placeholder.textContent = "Audio file pending";
      placeholder.setAttribute("aria-label", `${title} audio file has not been added yet`);
      track.append(placeholder);
    }
    return track;
  }

  const demoList = document.querySelector("#demo-list");
  (config.demos || []).forEach((demo, index) => {
    const article = document.createElement("article");
    article.className = "demo-card";
    const head = document.createElement("div");
    head.className = "demo-head";
    const number = document.createElement("span");
    number.className = "demo-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("h3");
    title.textContent = demo.title;
    const meta = document.createElement("span");
    meta.className = "demo-meta";
    meta.textContent = demo.meta || "";
    head.append(number, title, meta);
    const tracks = document.createElement("div");
    tracks.className = "tracks";
    trackDefinitions.forEach((definition) => tracks.append(createTrack(demo.files, definition)));
    article.append(head, tracks);
    demoList.append(article);
  });

  document.querySelectorAll("[data-link]").forEach((link) => {
    const key = link.dataset.link;
    const value = config.links && config.links[key];
    if (value) link.href = value;
    if (!value || value.includes("REPLACE_ME")) {
      link.dataset.placeholder = "true";
      link.title = "Replace this link in site-config.js";
    }
  });

  Object.entries(config.stats || {}).forEach(([key, value]) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (element) element.textContent = value;
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
})();
