// Runtime behaviour of main.js against a hand-rolled DOM stub. Zero dependencies: `node --test scripts/`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../public/hairline_matters_demo/main.js', import.meta.url), 'utf8');

function classList() {
  const set = new Set();
  return { add: (c) => set.add(c), remove: (c) => set.delete(c), contains: (c) => set.has(c) };
}

function makeVideo() {
  const attrs = { controls: '' };
  const listeners = {};
  return {
    attrs,
    listeners,
    paused: true,
    muted: false,
    preload: 'none',
    duration: 0,
    currentTime: 0,
    playCalls: 0,
    loadCalls: 0,
    removeAttribute: (n) => delete attrs[n],
    setAttribute: (n, v) => (attrs[n] = v),
    querySelectorAll: () => [
      { getAttribute: (n) => ({ media: '(max-width: 700px)', src: 'assets/media/walkin-480.mp4' })[n] ?? null },
      { getAttribute: (n) => ({ src: 'assets/media/walkin.mp4' })[n] ?? null },
    ],
    addEventListener: (e, f) => (listeners[e] = f),
    load() {
      this.loadCalls++;
    },
    play() {
      this.playCalls++;
      if (this.rejectPlay) return Promise.reject(new Error('blocked'));
      this.paused = false;
      this.listeners.play?.();
      return Promise.resolve();
    },
    pause() {
      this.paused = true;
      this.listeners.pause?.();
    },
  };
}

function setup({ reduce = false, saveData = false, intersection = true, rejectPlay = false, fetchImpl = null, narrow = false } = {}) {
  const win = { listeners: {}, innerHeight: 1000, rafQueue: [] };
  win.addEventListener = (e, f) => (win.listeners[e] = f);
  win.removeEventListener = (e) => delete win.listeners[e];
  win.requestAnimationFrame = (f) => win.rafQueue.push(f);
  const mq = { matches: reduce, handlers: [], addEventListener: (e, f) => mq.handlers.push(f) };
  mq.change = (ev) => mq.handlers.forEach((f) => f(ev));
  win.matchMedia = (q) => (q === '(max-width: 700px)' ? { matches: narrow } : mq);
  if (fetchImpl) {
    win.fetch = fetchImpl;
    win.URL = { createObjectURL: (b) => `blob:${b.from}` };
  }
  let observerCb = null;
  if (intersection) {
    win.IntersectionObserver = function (cb) {
      observerCb = cb;
      this.observe = () => {};
    };
  }

  const root = { classList: classList() };
  const walkVideo = makeVideo();
  const workVideo = makeVideo();
  workVideo.rejectPlay = rejectPlay;
  const chapters = [
    [0, 0.21],
    [0.21, 0.42],
    [0.42, 0.57],
    [0.57, 0.83],
    [0.83, 1.01],
  ].map(([from, to]) => ({
    classList: classList(),
    getAttribute: (n) => String(n === 'data-from' ? from : to),
  }));
  const section = {
    top: 0,
    height: 5000,
    getBoundingClientRect() {
      return { top: this.top, height: this.height };
    },
    querySelectorAll: () => chapters,
  };
  const label = { textContent: 'Play film' };
  const toggle = { hidden: true, listeners: {}, querySelector: () => label, addEventListener: (e, f) => (toggle.listeners[e] = f) };

  const ctx = {
    window: win,
    navigator: { connection: saveData ? { saveData: true } : undefined },
    document: {
      documentElement: root,
      querySelector: (s) => (s === '.walkin' ? section : null),
      getElementById: (id) => ({ 'walkin-video': walkVideo, 'work-video': workVideo, 'work-toggle': toggle })[id] || null,
    },
  };
  Object.assign(ctx, { IntersectionObserver: win.IntersectionObserver });
  vm.runInNewContext(src, ctx);

  function scrollTo(p) {
    section.top = -p * (section.height - win.innerHeight);
    win.listeners.scroll?.();
    while (win.rafQueue.length) win.rafQueue.shift()();
  }
  const activeIndex = () => chapters.findIndex((c) => c.classList.contains('is-active'));
  return { root, walkVideo, workVideo, chapters, section, toggle, label, mq, win, scrollTo, activeIndex, see: (v) => observerCb?.([{ isIntersecting: v }]) };
}

// Walk-in scroll scrub

test('walk-in: motion allowed enables scrub mode and loads the video', () => {
  const s = setup();
  assert.equal(s.root.classList.contains('scrub'), true);
  assert.equal('controls' in s.walkVideo.attrs, false);
  assert.equal(s.walkVideo.preload, 'auto');
  assert.equal(s.walkVideo.loadCalls, 1);
});

test('walk-in: scroll progress seeks the video and activates the matching chapter', () => {
  const s = setup();
  s.walkVideo.duration = 28.8;
  s.scrollTo(0.5);
  assert.ok(Math.abs(s.walkVideo.currentTime - 0.5 * (28.8 - 0.05)) < 0.01);
  assert.equal(s.activeIndex(), 2);
  s.scrollTo(0.9);
  assert.equal(s.activeIndex(), 4);
  assert.equal(s.chapters.filter((c) => c.classList.contains('is-active')).length, 1);
});

test('walk-in: progress clamps above and below the section', () => {
  const s = setup();
  s.walkVideo.duration = 10;
  s.section.top = 500;
  s.win.listeners.scroll();
  while (s.win.rafQueue.length) s.win.rafQueue.shift()();
  assert.equal(s.walkVideo.currentTime, 0);
  s.section.top = -99999;
  s.win.listeners.scroll();
  while (s.win.rafQueue.length) s.win.rafQueue.shift()();
  assert.ok(Math.abs(s.walkVideo.currentTime - 9.95) < 0.01);
});

test('walk-in: reduced motion keeps stacked text, native controls and no preload', () => {
  const s = setup({ reduce: true });
  assert.equal(s.root.classList.contains('scrub'), false);
  assert.equal('controls' in s.walkVideo.attrs, true);
  assert.equal(s.walkVideo.preload, 'none');
  assert.equal(s.win.listeners.scroll, undefined);
});

test('walk-in: Save-Data keeps the poster only', () => {
  const s = setup({ saveData: true });
  assert.equal(s.root.classList.contains('scrub'), false);
  assert.equal(s.walkVideo.loadCalls, 0);
});

test('walk-in: switching to reduced motion mid-session turns scrub off', () => {
  const s = setup();
  s.walkVideo.duration = 10;
  s.scrollTo(0.5);
  s.mq.change({ matches: true });
  assert.equal(s.root.classList.contains('scrub'), false);
  assert.equal('controls' in s.walkVideo.attrs, true);
  assert.equal(s.activeIndex(), -1);
  assert.equal(s.win.listeners.scroll, undefined);
});

test('walk-in: fetches the desktop clip into memory so it stays seekable', async () => {
  const urls = [];
  const s = setup({ fetchImpl: (u) => (urls.push(u), Promise.resolve({ ok: true, blob: () => Promise.resolve({ from: u }) })) });
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.deepEqual(urls, ['assets/media/walkin.mp4']);
  assert.equal(s.walkVideo.src, 'blob:assets/media/walkin.mp4');
  assert.equal(s.walkVideo.loadCalls, 0);
});

test('walk-in: narrow screens fetch the 480p clip', async () => {
  const urls = [];
  setup({ narrow: true, fetchImpl: (u) => (urls.push(u), Promise.resolve({ ok: true, blob: () => Promise.resolve({ from: u }) })) });
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.deepEqual(urls, ['assets/media/walkin-480.mp4']);
});

test('walk-in: primes the video (muted play, then pause) once data loads, for iOS frame painting', async () => {
  const s = setup();
  assert.equal(s.walkVideo.muted, true);
  s.walkVideo.listeners.loadeddata();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(s.walkVideo.playCalls, 1);
  assert.equal(s.walkVideo.paused, true);
});

test('walk-in: if autoplay is refused, the first touch primes it instead', async () => {
  const s = setup();
  s.walkVideo.rejectPlay = true;
  s.walkVideo.listeners.loadeddata();
  await Promise.resolve();
  await Promise.resolve();
  s.walkVideo.rejectPlay = false;
  s.win.listeners.touchstart();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(s.walkVideo.playCalls, 2);
  assert.equal(s.walkVideo.paused, true);
});

test('walk-in: a failed fetch falls back to the normal video load', async () => {
  const s = setup({ fetchImpl: () => Promise.resolve({ ok: false, status: 404 }) });
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.equal(s.walkVideo.loadCalls, 1);
  assert.equal(s.walkVideo.src, undefined);
});

test('walk-in: the video eases toward the scroll position instead of jumping', () => {
  const s = setup();
  s.walkVideo.duration = 20.05;
  s.section.top = -0.5 * (s.section.height - s.win.innerHeight);
  s.win.listeners.scroll();
  s.win.rafQueue.shift()(); // render: sets the target, schedules the glide
  s.win.rafQueue.shift()(); // first glide frame
  assert.ok(s.walkVideo.currentTime > 0 && s.walkVideo.currentTime < 10, String(s.walkVideo.currentTime));
  while (s.win.rafQueue.length) s.win.rafQueue.shift()();
  assert.equal(s.walkVideo.currentTime, 10);
});

test('walk-in: no new seek is issued while the decoder is still seeking', () => {
  const s = setup();
  s.walkVideo.duration = 20.05;
  s.walkVideo.seeking = true;
  s.scrollTo(0.5);
  assert.equal(s.walkVideo.currentTime, 0);
  s.walkVideo.seeking = false;
  s.walkVideo.listeners.seeked();
  assert.equal(s.walkVideo.currentTime, 10);
});

// Work film band

test('work film: JS removes native controls and reveals the toggle', () => {
  const s = setup();
  assert.equal('controls' in s.workVideo.attrs, false);
  assert.equal(s.toggle.hidden, false);
  assert.equal(s.workVideo.muted, true);
  assert.equal(s.label.textContent, 'Play film');
});

test('work film: plays only while on screen, pauses when scrolled away', () => {
  const s = setup();
  s.see(true);
  assert.equal(s.workVideo.playCalls, 1);
  assert.equal(s.label.textContent, 'Pause film');
  s.see(false);
  assert.equal(s.workVideo.paused, true);
  assert.equal(s.label.textContent, 'Play film');
});

test('work film: a user pause sticks when it scrolls back into view', () => {
  const s = setup();
  s.see(true);
  s.toggle.listeners.click();
  assert.equal(s.workVideo.paused, true);
  s.see(false);
  s.see(true);
  assert.equal(s.workVideo.playCalls, 1);
});

test('work film: reduced motion never autoplays, but the toggle still plays it', () => {
  const s = setup({ reduce: true });
  s.see(true);
  assert.equal(s.workVideo.playCalls, 0);
  s.toggle.listeners.click();
  assert.equal(s.workVideo.playCalls, 1);
  assert.equal(s.label.textContent, 'Pause film');
});

test('work film: rejected play leaves the label on "Play film"', async () => {
  const s = setup({ rejectPlay: true });
  s.see(true);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(s.label.textContent, 'Play film');
});

test('no IntersectionObserver: no autoplay, toggle still works', () => {
  const s = setup({ intersection: false });
  assert.equal(s.workVideo.playCalls, 0);
  s.toggle.listeners.click();
  assert.equal(s.workVideo.playCalls, 1);
});

test('missing elements: exits without throwing', () => {
  assert.doesNotThrow(() =>
    vm.runInNewContext(src, {
      window: { matchMedia: () => ({ matches: false }) },
      navigator: {},
      document: { querySelector: () => null, getElementById: () => null, documentElement: {} },
    }),
  );
});
