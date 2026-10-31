import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../site/assets/js/analytics.js', import.meta.url), 'utf8');
function boot(hostname = 'staging.handballai.tech', pathname = '/', search = '?utm_source=facebook&utm_content=post_001&email=private@example.com') {
  const events = [], scripts = [], listeners = {};
  const window = { addEventListener: (name, fn) => { listeners[name] = fn; }, innerHeight: 500, scrollY: 500 };
  const document = { head: { appendChild: script => scripts.push(script) }, createElement: () => ({}), addEventListener() {}, documentElement: { scrollHeight: 1000 } };
  vm.runInNewContext(source, { window, document, location: { hostname, pathname, search }, URLSearchParams, URL, Element: class {} });
  const config = window.posthog?._i[0]?.[1];
  if (config) {
    const sdk = { capture: (event, properties) => events.push(config.before_send({ event, properties })) };
    config.loaded(sdk);
    // The SDK schedules its native pageview after its loaded callback finishes.
    if (config.capture_pageview) sdk.capture('$pageview', {});
  }
  return { window, config, events, scripts, listeners };
}
test('private reader paths and unknown hosts never load PostHog', () => {
  assert.equal(boot('voice.handballai.tech', '/transcripts/private-token').scripts.length, 0);
  assert.equal(boot('localhost').scripts.length, 0);
});
test('standard SDK queue contains config; fixed events carry campaign and environment only', () => {
  const { window, events } = boot();
  assert.equal(events[0].event, '$pageview');
  assert.equal(window.posthog !== undefined, true);
  assert.equal(events[0].properties.environment, 'staging');
  assert.equal(events[0].properties.utm_content, 'post_001');
  assert.equal(JSON.stringify(events).includes('private@example.com'), false);
  window.handballAnalytics.capture('unknown');
  assert.equal(events.length, 1);
});
test('queries, fragments, automatic attribution and nested profile URLs are removed', () => {
  const { config } = boot();
  const event = config.before_send({ event: '$pageview', $set: { $initial_current_url: 'https://handballai.tech/?contact=secret' }, properties: {
    $current_url: 'https://handballai.tech/?email=secret#token',
    $set: { $initial_current_url: 'https://handballai.tech/?contact=secret', $initial_utm_content: 'secret' },
    fbclid: 'secret',
    $snapshot_data: [{ type: 4, data: { href: 'https://handballai.tech/?email=secret#token' } }, { data: { attributes: { href: 'mailto:secret@example.com', src: 'https://example.com/?token=secret' } } }]
  } });
  assert.equal(event.properties.$current_url, 'https://handballai.tech/');
  assert.equal(JSON.stringify(event).includes('secret'), false);
});
test('recording excludes sensitive regions and automatic payload capture', () => {
  const { config } = boot('voice.handballai.tech');
  assert.equal(config.autocapture, false);
  assert.equal(config.capture_exceptions, false);
  assert.equal(config.capture_performance, false);
  assert.equal(config.enable_recording_console_log, false);
  assert.equal(config.session_recording.maskAllInputs, true);
  assert.notEqual(config.session_recording.maskTextSelector, '*');
  assert.match(config.session_recording.maskTextSelector, /voice-transcript-reveal/);
  assert.match(config.session_recording.maskTextSelector, /voice-lead/);
  assert.match(config.session_recording.blockSelector, /voice-transcript-reveal/);
  assert.match(config.session_recording.blockSelector, /voice-lead/);
  assert.equal(config.session_recording.recordBody, false);
});
test('blocked SDK leaves enquiry event hooks safe and queues bounded', () => {
  const { window, listeners } = boot();
  delete window.posthog;
  assert.doesNotThrow(() => listeners['handball:elsa_enquiry_saved']());
});
