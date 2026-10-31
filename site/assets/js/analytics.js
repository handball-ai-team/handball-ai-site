/* Shared with Elsa's public/handball-analytics.js. No conversation data here. */
(function () {
  'use strict';
  if (window.handballAnalytics || location.pathname !== '/') return;
  var hosts = ['handballai.tech', 'www.handballai.tech', 'voice.handballai.tech', 'staging.handballai.tech', 'voice-ai-receptionist-staging.handballai-au.workers.dev'];
  if (hosts.indexOf(location.hostname) === -1) return;
  var environment = location.hostname.indexOf('staging') !== -1 ? 'staging' : 'production';
  var voice = location.hostname.indexOf('voice') === 0;
  var campaign = {};
  var params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
    var value = params.get(key);
    if (value && /^[a-z][a-z0-9_-]{0,79}$/.test(value)) campaign[key] = value;
  });
  var queue = [];
  var ready = false;
  var allowed = ['$pageview', '$pageleave', '$snapshot', 'contact_clicked', 'elsa_opened', 'page_scrolled', 'elsa_call_started', 'elsa_call_ended', 'elsa_call_failed', 'elsa_enquiry_saved'];
  function cleanUrl(value) {
    try { var url = new URL(value); return url.origin + '/'; } catch (_) { return ''; }
  }
  function capture(name, properties) {
    if (allowed.indexOf(name) === -1) return;
    // Callers supply only fixed event names and enumerated properties.
    if (!ready) { if (queue.length < 30) queue.push([name, properties || {}]); return; }
    try { window.posthog.capture(name, Object.assign({}, campaign, { environment: environment, site: voice ? 'voice' : 'landing' }, properties)); } catch (_) { /* Analytics must never interrupt enquiries. */ }
  }
  window.handballAnalytics = { capture: capture, campaign: campaign };
  ['elsa_call_started', 'elsa_call_ended', 'elsa_call_failed', 'elsa_enquiry_saved'].forEach(function (name) {
    window.addEventListener('handball:' + name, function () { capture(name); });
  });
  document.addEventListener('click', function (event) {
    var target = event.target instanceof Element ? event.target.closest('a,button') : null;
    if (!target) return;
    if (target.matches('.voice-open')) capture('elsa_opened');
    if (target.matches('.ft-copy')) capture('contact_clicked', { channel: 'email_copy' });
    var href = target.getAttribute('href') || '';
    if (href.indexOf('https://wa.me/') === 0) capture('contact_clicked', { channel: 'whatsapp' });
    if (href.indexOf('mailto:') === 0) capture('contact_clicked', { channel: 'email' });
  });
  var milestones = {};
  window.addEventListener('scroll', function () {
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (height <= 0) return;
    var percent = window.scrollY / height * 100;
    [25, 50, 75, 100].forEach(function (depth) {
      if (!milestones[depth] && percent >= depth - 1) { milestones[depth] = true; capture('page_scrolled', { depth: depth }); }
    });
  }, { passive: true });
  var script = document.createElement('script');
  script.src = 'https://us-assets.i.posthog.com/static/array.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  // The array bundle consumes this standard snippet queue when it loads.
  var stub = [];
  stub._i = [];
  stub.__SV = 1;
  stub.people = [];
  stub.init = function (token, config) { stub._i.push([token, config, 'posthog']); };
  window.posthog = stub;
  function initialize() {
    try {
      window.posthog.init('phc_yVrr87ViDH2gDLMwRpMiCdsFrTr3Cg9VoPnNwuMR9jxG', {
        api_host: 'https://us.i.posthog.com', defaults: '2026-05-30',
        person_profiles: 'identified_only', autocapture: false,
        capture_pageview: true, capture_pageleave: true,
        capture_dead_clicks: false, rageclick: false, capture_exceptions: false,
        capture_heatmaps: false, capture_performance: false,
        enable_recording_console_log: false, cross_subdomain_cookie: false,
        persistence: 'sessionStorage',
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '.ph-mask, [data-private], .voice-transcript-reveal, .voice-lead',
          blockSelector: '.voice-transcript-reveal, .voice-lead, .voice-frame, iframe, audio, video, input, textarea, select',
          recordCrossOriginIframes: false,
          recordHeaders: false, recordBody: false,
          maskCapturedNetworkRequestFn: function (request) { request.name = cleanUrl(request.name); return request; }
        },
        before_send: function (event) {
          if (allowed.indexOf(event.event) === -1) return null;
          var properties = event.properties || {};
          function scrub(object) {
            Object.keys(object).forEach(function (key) {
              if (/utm_|gclid|fbclid|msclkid/i.test(key)) { delete object[key]; return; }
              if (/url|referrer|pathname/i.test(key) || /^(href|src|action)$/.test(key)) { object[key] = cleanUrl(object[key]); return; }
              if (object[key] && typeof object[key] === 'object') scrub(object[key]);
            });
          }
          scrub(properties);
          if (event.$set) scrub(event.$set);
          if (event.$set_once) scrub(event.$set_once);
          Object.assign(properties, campaign, { environment: environment, site: voice ? 'voice' : 'landing' });
          event.properties = properties;
          return event;
        },
        loaded: function (instance) {
          // loaded runs before the snippet queue is replaced on window.
          window.posthog = instance;
          ready = true;
          queue.splice(0).forEach(function (item) { capture(item[0], item[1]); });
        }
      });
    } catch (_) { /* Blocked analytics must not affect the site. */ }
  }
  initialize();
  document.head.appendChild(script);
})();
