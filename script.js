/**
 * MAKARIOUS NAGY & SARAH HANY — BESPOKE LUXURY DIGITAL WEDDING INVITATION
 * Consolidated Visual Journey Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. OPENING COVER & AUDIO EXPERIENCE
  // ==========================================================================
  const body = document.body;
  const coverSection = document.getElementById('opening-cover');
  const btnOpen = document.getElementById('btn-open-invitation');
  const audioToggle = document.getElementById('audio-toggle');
  const audioElement = document.getElementById('wedding-audio');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isAudioPlaying = false;
  let webAudioCtx = null;
  let webAudioTimer = null;
  let invitationOpened = !body.classList.contains('is-locked');

  // Scroll Alignment Controller: Guarantees opening from the true top without jump or mid-section start
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function resetScrollToTop() {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const invMain = document.getElementById('invitation-main');
    if (invMain) invMain.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.documentElement.style.scrollBehavior = '';
    });
  }

  resetScrollToTop();
  function startWebAudioFallback() {
    if (webAudioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      webAudioCtx = new AudioContext();

      // Soft ambient felt piano chord sequence in F-Major / D-Minor
      const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [130.81, 164.81, 196.00, 246.94], // Cmaj / Bb
        [116.54, 146.83, 174.61, 220.00]  // Bbmaj7
      ];
      let chordIndex = 0;

      function playChord() {
        if (!webAudioCtx || webAudioCtx.state === 'suspended') return;
        const now = webAudioCtx.currentTime;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          const osc = webAudioCtx.createOscillator();
          const gain = webAudioCtx.createGain();
          const filter = webAudioCtx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.04, now + 0.5 + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(webAudioCtx.destination);

          osc.start(now + idx * 0.12);
          osc.stop(now + 5.0);
        });
      }

      playChord();
      webAudioTimer = setInterval(playChord, 5200);
    } catch (e) {
      console.warn('Web Audio Fallback not available', e);
    }
  }

  function stopWebAudioFallback() {
    if (webAudioTimer) {
      clearInterval(webAudioTimer);
      webAudioTimer = null;
    }
    if (webAudioCtx && webAudioCtx.state !== 'closed') {
      webAudioCtx.close();
      webAudioCtx = null;
    }
  }

  function playAudio() {
    if (audioElement && audioElement.src) {
      audioElement.volume = 0;
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          isAudioPlaying = true;
          audioToggle.classList.add('is-playing');
          let vol = 0;
          const fadeInterval = setInterval(() => {
            if (vol < 0.65) {
              vol += 0.05;
              audioElement.volume = Math.min(vol, 0.65);
            } else {
              clearInterval(fadeInterval);
            }
          }, 100);
        }).catch(() => {
          startWebAudioFallback();
          isAudioPlaying = true;
          audioToggle.classList.add('is-playing');
        });
      }
    } else {
      startWebAudioFallback();
      isAudioPlaying = true;
      audioToggle.classList.add('is-playing');
    }
  }

  function pauseAudio() {
    if (audioElement && !audioElement.paused) {
      let vol = audioElement.volume;
      const fadeInterval = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          audioElement.volume = Math.max(vol, 0);
        } else {
          clearInterval(fadeInterval);
          audioElement.pause();
        }
      }, 50);
    }
    stopWebAudioFallback();
    isAudioPlaying = false;
    audioToggle.classList.remove('is-playing');
  }

  // Intimate Personal Note Controller
  const noteInterlude = document.getElementById('personal-note-interlude');
  const noteLead = document.getElementById('personal-note-lead');
  const noteSub = document.getElementById('personal-note-sub');

  function playPersonalNoteSequence(callback) {
    if (!noteInterlude || !noteLead) {
      if (callback) callback();
      return;
    }

    if (prefersReducedMotion) {
      noteLead.textContent = 'THIS ONE’S FOR YOU.';
      if (noteSub) {
        noteSub.textContent = 'We’re so happy you’re here.';
        noteSub.classList.add('is-revealed');
      }
      if (callback) callback();
      return;
    }

    // Prepare live character writing on lead text
    const text = 'THIS ONE’S FOR YOU.';
    noteLead.innerHTML = '';
    const chars = [];

    Array.from(text).forEach((char) => {
      if (char === ' ') {
        const space = document.createTextNode(' ');
        noteLead.appendChild(space);
      } else {
        const span = document.createElement('span');
        span.className = 'live-char';
        span.textContent = char;
        noteLead.appendChild(span);
        chars.push(span);
      }
    });

    const cursor = document.createElement('span');
    cursor.className = 'live-cursor';
    noteLead.appendChild(cursor);

    noteInterlude.classList.add('is-active');

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      noteInterlude.classList.add('is-fading-out');
      setTimeout(() => {
        noteInterlude.classList.remove('is-active', 'is-fading-out');
        noteInterlude.style.display = 'none';
        if (callback) callback();
      }, 550);
    };

    // Tap/click note interlude to advance immediately if desired
    noteInterlude.addEventListener('click', dismiss, { once: true });

    // Progressive character appearance (subtle blur-to-sharp)
    chars.forEach((span, idx) => {
      setTimeout(() => {
        if (dismissed) return;
        span.classList.add('is-visible');
      }, 40 + idx * 30);
    });

    // Fade cursor and reveal softer subtitle
    setTimeout(() => {
      if (dismissed) return;
      cursor.classList.add('is-faded');
      if (noteSub) {
        noteSub.classList.add('is-revealed');
      }
    }, 40 + chars.length * 30 + 80);

    // Intimate dwell pause, then smoothly dissolve interlude to invitation suite
    setTimeout(() => {
      if (dismissed) return;
      dismiss();
    }, 40 + chars.length * 30 + 1100);
  }

  // Cover opening handler
  if (btnOpen) {
    const handleOpen = () => {
      if (coverSection.classList.contains('is-opening') || coverSection.classList.contains('is-opened')) return;
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      resetScrollToTop();
      coverSection.classList.add('is-opening');
      playAudio();

      if (prefersReducedMotion) {
        resetScrollToTop();
        coverSection.classList.add('is-opened');
        body.classList.remove('is-locked');
        body.classList.add('is-revealing-suite');
        const invMain = document.getElementById('invitation-main');
        if (invMain) invMain.classList.add('is-revealed');
        invitationOpened = true;
        audioToggle.classList.remove('is-hidden');
        resetScrollToTop();
        triggerScrollReveals();
        triggerLiveWritingInView();
        return;
      }

      // Conclude cover transition, then present the personal note interlude
      setTimeout(() => {
        coverSection.classList.add('is-opened');
        audioToggle.classList.remove('is-hidden');

        playPersonalNoteSequence(() => {
          resetScrollToTop();
          body.classList.remove('is-locked');
          body.classList.add('is-revealing-suite');
          const invMain = document.getElementById('invitation-main');
          if (invMain) invMain.classList.add('is-revealed');
          invitationOpened = true;
          resetScrollToTop();
          triggerScrollReveals();
          triggerLiveWritingInView();
        });
      }, 700);
    };

    btnOpen.addEventListener('click', handleOpen);
    btnOpen.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });

    const coverCard = document.getElementById('cover-card');
    if (coverCard) {
      coverCard.addEventListener('click', (e) => {
        if (e.target !== btnOpen && !btnOpen.contains(e.target)) {
          handleOpen();
        }
      });
    }
  }

  // Minimal audio button toggle
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // ==========================================================================
  // 2. SCROLL REVEALS
  // ==========================================================================
  const liveWritingElements = document.querySelectorAll('[data-live-write]');

  function prepareLiveWriting(element) {
    let charIndex = 0;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeValue && node.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      Array.from(node.nodeValue).forEach((char) => {
        if (/\s/.test(char)) {
          fragment.appendChild(document.createTextNode(char));
          return;
        }

        const span = document.createElement('span');
        span.className = 'write-char';
        span.style.setProperty('--char-index', charIndex);
        span.textContent = char;
        charIndex += 1;
        fragment.appendChild(span);
      });
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function triggerLiveWriting(element) {
    if (!element || element.dataset.writeComplete === 'true') return;
    element.dataset.writeComplete = 'true';
    element.classList.add('is-writing');
  }

  function triggerLiveWritingInView() {
    liveWritingElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        triggerLiveWriting(el);
      }
    });
  }

  liveWritingElements.forEach((el) => {
    prepareLiveWriting(el);
    if (prefersReducedMotion) {
      triggerLiveWriting(el);
    }
  });

  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const accentElements = document.querySelectorAll('.scene-transition-accent');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && invitationOpened) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.1
  });

  scrollElements.forEach((el) => revealObserver.observe(el));
  accentElements.forEach((el) => revealObserver.observe(el));

  const writingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && invitationOpened) {
        triggerLiveWriting(entry.target);
        writingObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -18% 0px',
    threshold: 0.25
  });

  liveWritingElements.forEach((el) => writingObserver.observe(el));

  function triggerScrollReveals() {
    scrollElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      }
    });
    accentElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      }
    });
  }

  // Calendar Day 11 Circle Draw: Triggers only when roughly 40–60% of the calendar is visible, runs once only
  const calStationery = document.querySelector('.cal-stationery');
  if (calStationery) {
    if (prefersReducedMotion) {
      calStationery.classList.add('is-visible', 'is-animated');
    } else {
      const calendarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!invitationOpened) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            calStationery.classList.add('is-visible', 'is-animated');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: [0.5, 0.6]
      });

      calendarObserver.observe(calStationery);
    }
  }

  // ==========================================================================
  // 3. LIVE COUNTDOWN — 11 OCTOBER 2026, 7:00 PM, CAIRO (UTC+3)
  // ==========================================================================
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const weddingDate = new Date('2026-10-11T19:00:00+03:00').getTime();
  let countdownTimerId = null;

  function padUnit(value) {
    return String(value).padStart(2, '0');
  }

  function setCountdownText(element, value) {
    if (!element || element.textContent === value) return;
    if (prefersReducedMotion) {
      element.textContent = value;
      return;
    }

    element.classList.add('is-rolling');
    window.setTimeout(() => {
      element.textContent = value;
      element.classList.remove('is-rolling');
    }, 170);
  }

  function updateCountdown() {
    const distance = weddingDate - Date.now();

    if (distance <= 0) {
      setCountdownText(cdDays, '0');
      setCountdownText(cdHours, '00');
      setCountdownText(cdMinutes, '00');
      setCountdownText(cdSeconds, '00');
      return false;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setCountdownText(cdDays, String(days));
    setCountdownText(cdHours, padUnit(hours));
    setCountdownText(cdMinutes, padUnit(minutes));
    setCountdownText(cdSeconds, padUnit(seconds));
    return true;
  }

  function scheduleCountdown() {
    const stillCounting = updateCountdown();
    if (!stillCounting) return;
    const msToNextSecond = 1000 - (Date.now() % 1000);
    countdownTimerId = window.setTimeout(scheduleCountdown, msToNextSecond);
  }

  scheduleCountdown();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (countdownTimerId) window.clearTimeout(countdownTimerId);
    scheduleCountdown();
  });

  // ==========================================================================
  // 4. CONSOLIDATED GALLERY SCROLL DYNAMICS
  // ==========================================================================

  // --- A. Childhood to Adult Transformation ---
  const nodeChildhood = document.getElementById('node-childhood');
  const childhoodPrint = document.getElementById('childhood-print');
  const adultCrossfade = document.getElementById('adult-crossfade');

  function handleChildhoodTransformation() {
    if (!nodeChildhood || !childhoodPrint || !adultCrossfade) return;

    const rect = nodeChildhood.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Generous scroll tracking range for ample dwell time
    const progress = Math.min(Math.max((viewportHeight * 0.78 - rect.top) / (viewportHeight * 0.65), 0), 1);

    // 0%–45%: childhood image remains fully visible
    if (progress <= 0.45) {
      adultCrossfade.style.opacity = '0';
      adultCrossfade.style.transform = 'scale(1.03)';
      childhoodPrint.style.transform = 'scale(1)';
    } 
    // 45%–75%: smooth gradual childhood-to-adult crossfade
    else if (progress < 0.75) {
      const p = (progress - 0.45) / 0.30;
      adultCrossfade.style.opacity = String(p);
      adultCrossfade.style.transform = `scale(${1.03 - p * 0.03})`;
      childhoodPrint.style.transform = `scale(${1 + p * 0.03})`;
    } 
    // 75%–100%: adult image becomes fully dominant
    else {
      adultCrossfade.style.opacity = '1';
      adultCrossfade.style.transform = 'scale(1)';
      childhoodPrint.style.transform = 'scale(1.03)';
    }
  }

  // --- B. Cinematic Parallax Break ---
  const breakModule = document.getElementById('cinematic-break');
  const breakParallax = breakModule ? breakModule.querySelector('.cinematic-bg-parallax') : null;

  function handleParallax() {
    if (!breakModule || !breakParallax) return;
    const rect = breakModule.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (rect.top - window.innerHeight / 2) * 0.1;
      breakParallax.style.transform = `translateY(${offset}px)`;
    }
  }

  let childhoodInView = false;
  let parallaxInView = false;
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === nodeChildhood) childhoodInView = entry.isIntersecting;
      if (entry.target === breakModule) parallaxInView = entry.isIntersecting;
    });
    if (childhoodInView || parallaxInView) {
      window.requestAnimationFrame(() => {
        if (childhoodInView) handleChildhoodTransformation();
        if (parallaxInView) handleParallax();
      });
    }
  }, { rootMargin: '12% 0px' });

  if (nodeChildhood) sceneObserver.observe(nodeChildhood);
  if (breakModule) sceneObserver.observe(breakModule);

  // Scroll work is scheduled only while a scroll-reactive scene is near the viewport.
  const scrollCue = document.getElementById('suite-scroll-cue');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (scrollCue && window.scrollY > 15) {
      scrollCue.classList.add('is-scrolled');
    }
    if (!ticking && (childhoodInView || parallaxInView)) {
      window.requestAnimationFrame(() => {
        if (childhoodInView) handleChildhoodTransformation();
        if (parallaxInView) handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleChildhoodTransformation();

  // Desktop horizontal wheel support and slow auto movement for ribbon
  const horizontalModule = document.getElementById('horizontal-module');
  if (horizontalModule) {
    const scrollContainer = horizontalModule.querySelector('.ribbon-viewport');
    const track = document.getElementById('horizontal-track');
    if (scrollContainer && track) {
      let galleryRafId = null;
      let lastGalleryTime = 0;
      let userPauseUntil = 0;
      let galleryScrollPosition = scrollContainer.scrollLeft;
      let galleryIsVisible = false;
      const autoplaySpeed = 0.018;

      function pauseGalleryAutoplay(duration = 2400) {
        userPauseUntil = performance.now() + duration;
        scrollContainer.classList.remove('is-auto-moving');
      }

      function getFrameAdvance() {
        const firstFrame = track.firstElementChild;
        const secondFrame = firstFrame ? firstFrame.nextElementSibling : null;
        if (!firstFrame || !secondFrame) return 0;

        return secondFrame.offsetLeft - firstFrame.offsetLeft;
      }

      function keepRibbonLooping() {
        let advance = getFrameAdvance();
        while (advance > 0 && galleryScrollPosition >= advance) {
          const firstFrame = track.firstElementChild;
          if (!firstFrame) break;
          track.appendChild(firstFrame);
          galleryScrollPosition -= advance;
          scrollContainer.scrollLeft = galleryScrollPosition;
          advance = getFrameAdvance();
        }
      }

      function runGalleryAutoplay(now) {
        const delta = Math.min(now - lastGalleryTime, 48);
        lastGalleryTime = now;

        if (!prefersReducedMotion && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
          if (now >= userPauseUntil) {
            scrollContainer.classList.add('is-auto-moving');
            galleryScrollPosition += delta * autoplaySpeed;
            scrollContainer.scrollLeft = galleryScrollPosition;
            keepRibbonLooping();
          }
        }

        if (galleryIsVisible && !document.hidden) {
          galleryRafId = window.requestAnimationFrame(runGalleryAutoplay);
        } else {
          galleryRafId = null;
        }
      }

      function startGalleryAutoplay() {
        if (galleryRafId || !galleryIsVisible || document.hidden || prefersReducedMotion) return;
        lastGalleryTime = performance.now();
        galleryRafId = window.requestAnimationFrame(runGalleryAutoplay);
      }

      ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
        scrollContainer.addEventListener(eventName, () => {
          galleryScrollPosition = scrollContainer.scrollLeft;
          pauseGalleryAutoplay();
        }, { passive: true });
      });

      scrollContainer.addEventListener('touchend', () => {
        galleryScrollPosition = scrollContainer.scrollLeft;
        pauseGalleryAutoplay(1800);
      }, { passive: true });
      scrollContainer.addEventListener('pointerup', () => {
        galleryScrollPosition = scrollContainer.scrollLeft;
        pauseGalleryAutoplay(1800);
      }, { passive: true });

      scrollContainer.addEventListener('wheel', (evt) => {
        galleryScrollPosition = scrollContainer.scrollLeft;
        pauseGalleryAutoplay();
        if (window.innerWidth > 768 && Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
          const atStart = scrollContainer.scrollLeft <= 0;
          const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 2;
          if ((evt.deltaY > 0 && !atEnd) || (evt.deltaY < 0 && !atStart)) {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY * 0.85;
            galleryScrollPosition = scrollContainer.scrollLeft;
          }
        }
      }, { passive: false });

      scrollContainer.addEventListener('scroll', () => {
        if (performance.now() < userPauseUntil) {
          galleryScrollPosition = scrollContainer.scrollLeft;
        }
      }, { passive: true });

      const galleryVisibilityObserver = new IntersectionObserver((entries) => {
        galleryIsVisible = entries[0].isIntersecting;
        if (galleryIsVisible) startGalleryAutoplay();
      }, { rootMargin: '120px 0px' });
      galleryVisibilityObserver.observe(horizontalModule);

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) startGalleryAutoplay();
      });

      window.addEventListener('beforeunload', () => {
        if (galleryRafId) window.cancelAnimationFrame(galleryRafId);
        galleryVisibilityObserver.disconnect();
      });
    }
  }

  // ==========================================================================
  // 5. INTIMATE STATIONERY GUESTBOOK WISH FORM
  // ==========================================================================
  const guestbookForm = document.getElementById('guestbook-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestMessageInput = document.getElementById('guest-message');
  const guestbookSubmit = document.getElementById('guestbook-submit');
  const guestbookFormError = document.getElementById('guestbook-form-error');
  const guestbookLoadError = document.getElementById('guestbook-load-error');
  const wishToast = document.getElementById('wish-success-toast');
  const wishesContainer = document.getElementById('wishes-container') || document.querySelector('.wishes-scroll-container');
  const wishesScrollBox = document.getElementById('wishes-scroll-box');
  const wishesList = document.getElementById('wishes-list');

  function updateWishesVisibility(hasWishes) {
    if (!wishesContainer) return;
    if (hasWishes) {
      wishesContainer.classList.remove('is-hidden');
    } else {
      wishesContainer.classList.add('is-hidden');
    }
  }

  const SUPABASE_URL = 'https://aguvswjvkhbxpdzjyovo.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndXZzd2p2a2hieHBkemp5b3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NDM4MDMsImV4cCI6MjEwNDIxOTgwM30.RsFENQjlq_7iU0d1pb_E6QNMEn51yT-VOnGANGMYFEI';
  const GUESTBOOK_ENDPOINT = `${SUPABASE_URL}/rest/v1/guestbook`;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let isSubmittingWish = false;

  function supabaseHeaders(extra) {
    return Object.assign({
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }, extra || {});
  }

  function formatWishDate(iso) {
    const date = iso ? new Date(iso) : new Date();
    if (Number.isNaN(date.getTime())) return '';
    return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  function setStatus(el, message) {
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.classList.remove('is-hidden');
    } else {
      el.textContent = '';
      el.classList.add('is-hidden');
    }
  }

  function createWishEntry(name, message, dateStr) {
    const wishEntry = document.createElement('div');
    wishEntry.className = 'wish-entry';

    const wishMeta = document.createElement('div');
    wishMeta.className = 'wish-meta';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'wish-name';
    nameSpan.textContent = name;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'wish-time';
    timeSpan.textContent = dateStr;

    wishMeta.appendChild(nameSpan);
    wishMeta.appendChild(timeSpan);

    const textP = document.createElement('p');
    textP.className = 'wish-text';
    textP.textContent = message;

    wishEntry.appendChild(wishMeta);
    wishEntry.appendChild(textP);
    return wishEntry;
  }

  function createWishRule() {
    const rule = document.createElement('div');
    rule.className = 'wish-rule';
    return rule;
  }

  function prependWishToDOM(name, message, dateStr) {
    if (!wishesList) return;
    updateWishesVisibility(true);
    const wishEntry = createWishEntry(name, message, dateStr);

    if (wishesList.firstChild) {
      const rule = createWishRule();
      wishesList.insertBefore(rule, wishesList.firstChild);
      wishesList.insertBefore(wishEntry, rule);
    } else {
      wishesList.appendChild(wishEntry);
    }
  }

  function renderWishes(rows) {
    if (!wishesList) return;
    wishesList.replaceChildren();

    const validRows = Array.isArray(rows) ? rows.filter(r => r && (r.wish || r.name)) : [];

    if (validRows.length === 0) {
      updateWishesVisibility(false);
      return;
    }

    validRows.forEach((row, index) => {
      if (index > 0) wishesList.appendChild(createWishRule());
      wishesList.appendChild(createWishEntry(row.name, row.wish, formatWishDate(row.created_at)));
    });

    updateWishesVisibility(true);
  }

  async function loadGuestbookWishes() {
    setStatus(guestbookLoadError, '');
    try {
      const response = await fetch(
        `${GUESTBOOK_ENDPOINT}?select=id,name,wish,created_at&order=created_at.desc`,
        { headers: supabaseHeaders() }
      );
      if (!response.ok) throw new Error('load failed');
      const rows = await response.json();
      renderWishes(Array.isArray(rows) ? rows : []);
    } catch (e) {
      updateWishesVisibility(false);
      setStatus(guestbookLoadError, 'We couldn’t load the wishes just now. Please try again in a moment.');
    }
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmittingWish) return;

      const name = guestNameInput.value.trim();
      const message = guestMessageInput.value.trim();

      if (!name || !message) return;

      isSubmittingWish = true;
      if (guestbookSubmit) guestbookSubmit.disabled = true;
      setStatus(guestbookFormError, '');

      try {
        const response = await fetch(GUESTBOOK_ENDPOINT, {
          method: 'POST',
          headers: supabaseHeaders({ Prefer: 'return=representation' }),
          body: JSON.stringify({ name, wish: message })
        });

        if (!response.ok) throw new Error('insert failed');
        const inserted = await response.json();
        const row = Array.isArray(inserted) ? inserted[0] : inserted;

        prependWishToDOM(
          row && row.name ? row.name : name,
          row && row.wish ? row.wish : message,
          formatWishDate(row && row.created_at)
        );

        guestbookForm.reset();

        if (wishesScrollBox) {
          wishesScrollBox.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (wishToast) {
          wishToast.classList.remove('is-hidden');
          setTimeout(() => {
            wishToast.classList.add('is-hidden');
          }, 4000);
        }
      } catch (err) {
        setStatus(guestbookFormError, 'We couldn’t save your wish. Please try again.');
      } finally {
        isSubmittingWish = false;
        if (guestbookSubmit) guestbookSubmit.disabled = false;
      }
    });
  }

  loadGuestbookWishes();
});
