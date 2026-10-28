// Walk-in: scroll scrubs the silent video and swaps the chapter headline.
// Runs only when motion is allowed and Save-Data is off. Otherwise (and without JS)
// the video keeps native controls, preloads nothing, and the chapters stack as text.
(function () {
  var section = document.querySelector('.walkin');
  var video = document.getElementById('walkin-video');
  if (!section || !video) return;

  var chapters = Array.prototype.slice.call(section.querySelectorAll('.chapter'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var saveData = navigator.connection && navigator.connection.saveData;
  var root = document.documentElement;
  var ticking = false;
  var active = -1;

  function progress() {
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    if (travel <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / travel));
  }

  function render() {
    ticking = false;
    var p = progress();
    if (video.duration) video.currentTime = p * (video.duration - 0.05);
    for (var i = 0; i < chapters.length; i++) {
      var from = parseFloat(chapters[i].getAttribute('data-from'));
      var to = parseFloat(chapters[i].getAttribute('data-to'));
      if (p >= from && p < to) {
        if (i !== active) {
          if (active >= 0) chapters[active].classList.remove('is-active');
          chapters[i].classList.add('is-active');
          active = i;
        }
        break;
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  }

  function enable() {
    root.classList.add('scrub');
    video.removeAttribute('controls');
    video.preload = 'auto';
    video.load();
    video.addEventListener('loadedmetadata', render);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }

  function disable() {
    root.classList.remove('scrub');
    video.setAttribute('controls', '');
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (active >= 0) chapters[active].classList.remove('is-active');
    active = -1;
  }

  if (!reduceMotion.matches && !saveData) enable();

  function onMotionChange(e) {
    if (e.matches) disable();
  }
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', onMotionChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(onMotionChange);
  }
})();

// At work: muted film loops only while on screen and only when motion is allowed,
// with a visible play/pause control. Without JS it keeps native controls.
(function () {
  var video = document.getElementById('work-video');
  var toggle = document.getElementById('work-toggle');
  if (!video || !toggle) return;

  var label = toggle.querySelector('.video-toggle-label');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var saveData = navigator.connection && navigator.connection.saveData;
  var userPaused = false;

  video.removeAttribute('controls');
  video.muted = true;
  toggle.hidden = false;

  function sync() {
    label.textContent = video.paused ? 'Play film' : 'Pause film';
  }

  toggle.addEventListener('click', function () {
    if (video.paused) {
      userPaused = false;
      video.play().catch(sync);
    } else {
      userPaused = true;
      video.pause();
    }
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);

  if (!reduceMotion.matches && !saveData && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && video.paused && !userPaused && !reduceMotion.matches) {
        video.preload = 'auto';
        video.play().catch(sync);
      } else if (!visible && !video.paused) {
        video.pause();
      }
    }, { threshold: 0.35 }).observe(video);
  }

  function onMotionChange(e) {
    if (e.matches) video.pause();
  }
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', onMotionChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(onMotionChange);
  }
  sync();
})();
