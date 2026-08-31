import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

class TestStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.properties.get(name) ?? "";
  }
}

class TestElement {
  constructor(tagName) {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.attributes = new Map();
    this.style = new TestStyle();
    this.textContent = "";
    this._className = "";
    this.classList = {
      contains: (name) => this.classNames().includes(name),
      toggle: (name, force) => {
        const classes = new Set(this.classNames());
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        this._className = [...classes].join(" ");
        return enabled;
      }
    };
  }

  get className() {
    return this._className;
  }

  set className(value) {
    this._className = String(value ?? "");
  }

  classNames() {
    return this._className.split(/\s+/).filter(Boolean);
  }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    assert.match(selector, /^\.[a-z0-9_-]+$/i, `test DOM only supports a single class selector: ${selector}`);
    const className = selector.slice(1);
    const matches = [];
    const visit = (element) => {
      for (const child of element.children) {
        if (child.classNames().includes(className)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }
}

globalThis.Element = TestElement;
globalThis.document = {
  createElement(tagName) {
    return new TestElement(tagName);
  }
};

const {
  FORM_DEFINITIONS,
  FORM_ORDER,
  applyFormState,
  createFormSurface,
  formActionLabel,
  formStatusText
} = await import("../demo/book-form-demos.mjs");

const EXPECTED_FORMS = [
  "gatefold",
  "accordion",
  "popup",
  "diecut",
  "layers",
  "tunnel",
  "volvelle",
  "flipbook",
  "carousel",
  "infinite",
  "mixmatch",
  "pulltab",
  "iris",
  "waterfall",
  "venetian",
  "dosados",
  "jacob",
  "flexagon"
];

const GEOMETRY = {
  gatefold: [".form-gatefold__flap", 2],
  accordion: [".form-accordion__panel", 6],
  popup: [".form-popup__piece", 3],
  diecut: [".form-diecut__depth", 4],
  layers: [".form-layers__vellum", 3],
  tunnel: [".form-tunnel__frame", 5],
  volvelle: [".form-volvelle__sector", 8],
  flipbook: [".form-flipbook__sheet", 12],
  carousel: [".form-carousel__leaf", 6],
  infinite: [".form-infinite__panel", 6],
  mixmatch: [".form-mixmatch__band", 3],
  pulltab: [".form-pulltab__part", 3],
  iris: [".form-iris__blade", 8],
  waterfall: [".form-waterfall__card", 6],
  venetian: [".form-venetian__slat", 20],
  dosados: [".form-dosados__entry", 2],
  jacob: [".form-jacob__board", 6],
  flexagon: [".form-flexagon__triangle", 6]
};

const STATE_GEOMETRY = {
  gatefold: ".form-gatefold__flap",
  accordion: ".form-accordion__panel",
  popup: ".form-popup__piece",
  diecut: ".form-diecut__depth",
  layers: ".form-layers__vellum",
  tunnel: ".form-tunnel__frame",
  volvelle: ".form-volvelle__rotor",
  flipbook: ".form-flipbook__sheet",
  carousel: ".form-carousel__leaf",
  infinite: ".form-infinite__ring",
  mixmatch: ".form-mixmatch__strip",
  pulltab: ".form-pulltab__ribbon",
  iris: ".form-iris__blade",
  waterfall: ".form-waterfall__card",
  venetian: ".form-venetian__slat",
  dosados: ".form-dosados__book",
  jacob: ".form-jacob__board",
  flexagon: ".form-flexagon__triangle"
};

test("Revision 6 defines eighteen book forms in the public display order", () => {
  assert.deepEqual([...FORM_ORDER], EXPECTED_FORMS);
  assert.equal(Object.keys(FORM_DEFINITIONS).length, EXPECTED_FORMS.length);

  for (const formName of EXPECTED_FORMS) {
    const definition = FORM_DEFINITIONS[formName];
    assert.ok(definition, `${formName} has a definition`);
    for (const key of ["name", "kicker", "title", "dek", "accent", "action", "kind", "progressLabel"]) {
      assert.equal(typeof definition[key], "string", `${formName}.${key} is public copy`);
      assert.ok(definition[key].length > 0, `${formName}.${key} is not empty`);
    }
    assert.match(definition.accent, /^#[0-9a-f]{6}$/i);
    assert.ok(["toggle", "cycle", "play"].includes(definition.kind));
    if (definition.kind === "cycle" || definition.kind === "play") {
      assert.ok(Number.isInteger(definition.maxStep) && definition.maxStep > 0);
    }
  }
});

test("every book form builder creates its own observable DOM geometry", () => {
  for (const formName of EXPECTED_FORMS) {
    const [selector, expectedCount] = GEOMETRY[formName];
    const root = createFormSurface(formName, { accent: "#123456" });

    assert.ok(root instanceof Element);
    assert.equal(root.dataset.form, formName);
    assert.ok(root.classNames().includes("form-surface"));
    assert.ok(root.classNames().includes(`form-surface--${formName}`));
    assert.equal(root.getAttribute("role"), "img");
    assert.match(root.getAttribute("aria-label"), new RegExp(FORM_DEFINITIONS[formName].name));
    assert.equal(root.style.getPropertyValue("--form-accent"), "#123456");
    assert.equal(root.querySelectorAll(selector).length, expectedCount, `${formName} geometry count`);
  }

  assert.equal(createFormSurface("volvelle").querySelectorAll(".form-volvelle__tick").length, 12);
  assert.ok(createFormSurface("diecut").querySelector(".form-diecut__window"));
  assert.ok(createFormSurface("infinite").querySelector(".form-infinite__ring"));
  assert.equal(createFormSurface("mixmatch").querySelectorAll(".form-mixmatch__face").length, 15);
  assert.equal(createFormSurface("flexagon").querySelectorAll(".form-flexagon__face").length, 18);
  assert.equal(createFormSurface("jacob").querySelectorAll(".form-jacob__ribbon").length, 2);
});

test("every form applier writes normalized state and live geometry", () => {
  for (const formName of EXPECTED_FORMS) {
    const definition = FORM_DEFINITIONS[formName];
    const root = createFormSurface(formName);
    const geometry = root.querySelector(STATE_GEOMETRY[formName]);
    const initialTransform = geometry.style.transform ?? "";

    const returned = applyFormState(root, formName, {
      progress: 0.73,
      step: definition.maxStep ?? 4,
      turn: 0.35,
      fallback: true,
      playing: formName === "flipbook"
    });

    assert.equal(returned, root);
    assert.equal(root.dataset.progress, "0.730");
    assert.equal(root.dataset.step, String(definition.maxStep ?? 4));
    assert.equal(root.dataset.turn, "0.350");
    assert.equal(root.dataset.fallback, "true");
    assert.equal(root.dataset.playing, String(formName === "flipbook"));
    assert.equal(root.style.getPropertyValue("--form-progress"), "0.730");
    assert.notEqual(geometry.style.transform ?? "", initialTransform, `${formName} geometry responds to state`);
  }
});

test("form state clamps unsafe numbers and rejects unknown forms or non-elements", () => {
  const accordion = createFormSurface("accordion", { accent: "red;display:none" });
  assert.equal(accordion.style.getPropertyValue("--form-accent"), FORM_DEFINITIONS.accordion.accent);

  applyFormState(accordion, "accordion", { progress: 12, step: 99, turn: -9 });
  assert.equal(accordion.dataset.progress, "1.000");
  assert.equal(accordion.dataset.step, String(FORM_DEFINITIONS.accordion.maxStep));
  assert.equal(accordion.dataset.turn, "-1.000");

  assert.throws(() => createFormSurface("unknown"), /Unknown book form/);
  assert.throws(() => applyFormState({}, "gatefold"), /DOM Element/);
});

test("action and status copy reflects toggle, cycle, playback, and loop state", () => {
  assert.equal(formActionLabel("gatefold", { progress: 0 }), "打开双门");
  assert.equal(formActionLabel("gatefold", { progress: 1 }), "合上双门");
  assert.equal(formActionLabel("popup", { progress: 1 }), "收起立体结构");
  assert.equal(formActionLabel("flipbook", { playing: true }), "暂停翻动画面");
  assert.match(formActionLabel("accordion", { step: 0 }), /第 2 折/);
  assert.match(formActionLabel("accordion", { step: 5 }), /重新收拢/);
  assert.match(formActionLabel("infinite", { step: 5 }), /种子/);
  assert.match(formActionLabel("mixmatch", { step: 0 }), /002/);
  assert.match(formActionLabel("pulltab", { progress: 1 }), /推回/);
  assert.match(formActionLabel("iris", { progress: 1 }), /关闭/);
  assert.match(formActionLabel("waterfall", { step: 5 }), /收回/);
  assert.match(formActionLabel("flexagon", { step: 1 }), /生命/);

  for (const formName of EXPECTED_FORMS) {
    const status = formStatusText(formName, { progress: 0.5, step: 0 });
    assert.match(status, new RegExp(FORM_DEFINITIONS[formName].name));
    assert.ok(status.length > FORM_DEFINITIONS[formName].name.length);
  }
  assert.match(formStatusText("flipbook", { step: 2, playing: true }), /FRAME 03 \/ 12 · 播放中/);
});

test("Revision 6 form panel exposes eighteen choices, an atlas, and a unified operation dock", async () => {
  const html = await readFile(new URL("../demo/index.html", import.meta.url), "utf8");
  const formButtons = html.match(/<button[^>]+data-form="[^"]+"/g) || [];

  assert.equal((html.match(/class="deck-panel/g) || []).length, 5);
  assert.equal(formButtons.length, EXPECTED_FORMS.length);
  for (const formName of EXPECTED_FORMS) {
    assert.match(html, new RegExp(`data-form=["']${formName}["']`));
  }
  for (const id of ["form-state-output", "form-action", "form-reset", "form-progress", "form-progress-output", "form-exit"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /data-view="forms"/);
  assert.match(html, /data-panel="forms"/);
  assert.match(html, /data-view="explore"/);
  assert.match(html, /data-panel="explore"/);
  for (const id of ["axis-filter", "tier-filter", "direction-list", "direction-detail", "combination-list"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("Revision 6 controller wires forms, creative atlas selection, filters, and stage linkage", async () => {
  const script = await readFile(new URL("../demo/app.mjs", import.meta.url), "utf8");

  for (const importedName of [
    "FORM_DEFINITIONS",
    "FORM_ORDER",
    "applyFormState",
    "createFormSurface",
    "formActionLabel",
    "formStatusText"
  ]) {
    assert.match(script, new RegExp(`\\b${importedName}\\b`));
  }

  for (const refName of ["formButtons", "formAction", "formReset", "formExit", "formProgress", "formStateOutput"]) {
    assert.match(script, new RegExp(`\\b${refName}:`));
  }

  assert.match(script, /function isFormMode\(\)/);
  assert.match(script, /function selectForm\(/);
  assert.match(script, /function performFormAction\(/);
  assert.match(script, /function selectDirection\(/);
  assert.match(script, /function applyDirectionFilter\(/);
  assert.match(script, /function demonstrateCombination\(/);
  assert.match(script, /function renderCreativeAtlas\(/);
  assert.match(script, /createFormSurface\(state\.form/);
  assert.match(script, /applyFormState\(/);
  assert.match(script, /state\.formProgress/);
  assert.match(script, /state\.formStep/);
  assert.match(script, /state\.formDrag/);
  assert.match(script, /refs\.formProgress\.addEventListener\(['"]input['"]/);
  assert.match(script, /refs\.formAction\.addEventListener\(['"]click['"]/);
  assert.match(script, /event\.key === ['"]ArrowLeft['"]/);
  assert.match(script, /event\.key === ['"]ArrowRight['"]/);
});
