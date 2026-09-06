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

  // Resilient Web Audio Synthesizer fallback
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
      coverSection.classList.add('is-opening');
      playAudio();

      if (prefersReducedMotion) {
        coverSection.classList.add('is-opened');
        body.classList.remove('is-locked');
        body.classList.add('is-revealing-suite');
        const invMain = document.getElementById('invitation-main');
        if (invMain) invMain.classList.add('is-revealed');
        invitationOpened = true;
        audioToggle.classList.remove('is-hidden');
        triggerScrollReveals();
        triggerLiveWritingInView();
        return;
      }

      // Conclude cover transition, then present the personal note interlude
      setTimeout(() => {
        coverSection.classList.add('is-opened');
        audioToggle.classList.remove('is-hidden');

        playPersonalNoteSequence(() => {
          body.classList.remove('is-locked');
          body.classList.add('is-revealing-suite');
          const invMain = document.getElementById('invitation-main');
          if (invMain) invMain.classList.add('is-revealed');
          invitationOpened = true;
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

  // Scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleChildhoodTransformation();
        handleParallax();
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
      let lastGalleryTime = performance.now();
      let userPauseUntil = 0;
      let galleryScrollPosition = scrollContainer.scrollLeft;
      const autoplaySpeed = 0.018;

      function pauseGalleryAutoplay(duration = 2400) {
        userPauseUntil = performance.now() + duration;
        scrollContainer.classList.remove('is-auto-moving');
      }

      function getFrameAdvance() {
        const firstFrame = track.firstElementChild;
        const secondFrame = firstFrame ? firstFrame.nextElementSibling : null;
        if (!firstFrame || !secondFrame) return 0;

        const firstRect = firstFrame.getBoundingClientRect();
        const secondRect = secondFrame.getBoundingClientRect();
        return secondRect.left - firstRect.left;
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

      galleryRafId = window.requestAnimationFrame(runGalleryAutoplay);

      window.addEventListener('beforeunload', () => {
        if (galleryRafId) window.cancelAnimationFrame(galleryRafId);
      });
    }
  }

  // ==========================================================================
  // 5. INTIMATE STATIONERY GUESTBOOK WISH FORM
  // ==========================================================================
  const guestbookForm = document.getElementById('guestbook-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestMessageInput = document.getElementById('guest-message');
  const wishToast = document.getElementById('wish-success-toast');
  const wishesScrollBox = document.getElementById('wishes-scroll-box');
  const wishesList = document.getElementById('wishes-list');

  const STORAGE_KEY = 'makarious_sarah_wishes_v3';

  function loadStoredWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveStoredWish(name, message, dateStr) {
    try {
      const current = loadStoredWishes();
      current.unshift({ name, message, date: dateStr });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  function appendWishToDOM(name, message, dateStr) {
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

    const rule = document.createElement('div');
    rule.className = 'wish-rule';

    if (wishesList.firstChild) {
      wishesList.insertBefore(rule, wishesList.firstChild);
      wishesList.insertBefore(wishEntry, rule);
    } else {
      wishesList.appendChild(wishEntry);
    }
  }

  function renderStoredWishes() {
    const stored = loadStoredWishes();
    stored.forEach((item) => {
      appendWishToDOM(item.name, item.message, item.date);
    });
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = guestNameInput.value.trim();
      const message = guestMessageInput.value.trim();

      if (!name || !message) return;

      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateFormatted = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

      appendWishToDOM(name, message, dateFormatted);
      saveStoredWish(name, message, dateFormatted);

      guestbookForm.reset();

      if (wishesScrollBox) {
        wishesScrollBox.scrollTo({ top: 0, behavior: 'smooth' });
      }

      wishToast.classList.remove('is-hidden');
      setTimeout(() => {
        wishToast.classList.add('is-hidden');
      }, 4000);
    });
  }

  renderStoredWishes();
});
