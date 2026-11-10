// Elsa demo on the "Dave's plumbing" card.
// Acts out steps 1-4: missed call -> Elsa answers -> chat -> summary to Dave. Step 5 stays with Dave.
// play(card) resolves "done" or "stopped". stop() can be called at any moment (e.g. "Talk to Elsa" clicked).
// pause() / resume() freeze it in place, e.g. while the card is scrolled off screen.
(function () {
  var STOP = {};
  var stopped = false;
  var paused = false;
  var held = []; // animations frozen by pause()
  var current = null; // { card, root, lis }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  // Like setTimeout, but the clock stops while paused.
  function wait(ms) {
    return new Promise(function (resolve, reject) {
      var left = ms, last = Date.now();
      (function tick() {
        if (stopped) return reject(STOP);
        var now = Date.now();
        if (!paused) left -= now - last;
        last = now;
        if (left <= 0) return resolve();
        setTimeout(tick, Math.min(left, 50));
      })();
    });
  }
  function cleanup() {
    if (!current) return;
    current.root.remove();
    current.card.classList.remove("ed-ring");
    current.lis.forEach(function (li) { li.classList.remove("ed-hot", "ed-hit", "ed-you"); });
    current = null;
  }

  async function act(card) {
    var lis = Array.prototype.slice.call(card.querySelectorAll(".mp-steps > li"));
    var root = el("div", "ed");
    root.setAttribute("aria-hidden", "true");
    root.style.setProperty("--ed-top", card.querySelector(".mp-steps").offsetTop + "px");
    card.appendChild(root);
    current = { card: card, root: root, lis: lis };

    // 1. Phone rings: card shakes, missed-call notification drops in over step 1
    var note = el("div", "ed-note",
      '<span class="ed-note-ic">📞</span><span class="ed-note-b">' +
      '<span class="ed-note-m"><span>PHONE</span><span>now</span></span>' +
      "<b>Missed call</b><span>0412 ••• ••• · 8:47pm</span></span>");
    root.appendChild(note);
    card.classList.add("ed-ring");
    lis[0].classList.add("ed-hot");
    await wait(1400);
    card.classList.remove("ed-ring");

    // 2. Elsa's orb rolls in and swallows the notification
    var orb = el("span", "ed-orb ed-roll", "<b><i></i><i></i><i></i><i></i></b>");
    root.appendChild(orb);
    await wait(750);
    note.classList.add("ed-eaten");
    orb.classList.replace("ed-roll", "ed-gulp");
    await wait(400);
    note.remove();
    lis[0].classList.remove("ed-hot");

    // 3. The call opens out of the orb and plays as chat
    var panel = el("div", "ed-panel",
      '<div class="ed-head"><span><b>Elsa</b> · answering for Dave</span><span class="ed-live">● live</span></div>' +
      '<div class="ed-chat"></div>');
    root.insertBefore(panel, orb);
    orb.classList.remove("ed-gulp");
    orb.classList.add("ed-dock");
    await wait(30);
    panel.classList.add("ed-open");
    await wait(650);

    var chat = panel.querySelector(".ed-chat");
    async function say(who, text) {
      if (who === "elsa") {
        var dots = el("div", "ed-msg ed-elsa ed-dots", "<i></i><i></i><i></i>");
        chat.appendChild(dots);
        await wait(700);
        dots.remove();
        orb.classList.add("ed-talk");
      }
      var msg = el("div", "ed-msg ed-" + who);
      msg.textContent = text;
      chat.appendChild(msg);
      await wait(who === "elsa" ? 1400 : 1100);
      orb.classList.remove("ed-talk");
    }
    await say("caller", "Hot water's gone. Can someone come tomorrow?");
    await say("elsa", "No worries. What's your name and suburb?");
    await say("caller", "Sam, in Belmont.");
    await say("elsa", "Thanks Sam. I'll pass it to Dave and he'll call you back.");
    await wait(300);

    // 4. Chat folds into a summary card, which flies to "Send Dave a summary"
    panel.classList.add("ed-fold");
    await wait(450);
    var sum = el("div", "ed-sum",
      '<span class="ed-sum-h">📋 New job for Dave</span>' +
      "<span><b>Sam</b> · 0412 ••• •••</span>" +
      "<span>Hot water's out · Belmont</span>" +
      "<span>Wants a visit tomorrow</span>");
    root.appendChild(sum);
    await wait(1500);
    panel.classList.add("ed-gone");
    orb.classList.add("ed-gone");
    var t = lis[3].getBoundingClientRect();
    var s = sum.getBoundingClientRect();
    var dx = (t.left + t.width / 2) - (s.left + s.width / 2);
    var dy = (t.top + t.height / 2) - (s.top + s.height / 2);
    sum.animate(
      [{ transform: "none", opacity: 1 }, { transform: "translate(" + dx + "px," + dy + "px) scale(0.25)", opacity: 0 }],
      { duration: 700, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" }
    );
    await wait(700);
    root.remove();

    // 5. Steps 1-4 tick off, step 5 stays with Dave
    for (var i = 0; i < 4; i++) {
      lis[i].classList.add("ed-hit");
      await wait(230);
    }
    lis[4].classList.add("ed-you");
    await wait(900);
  }

  window.handballElsaDemo = {
    play: function (card) {
      stopped = false;
      paused = false;
      return act(card).then(
        function () { cleanup(); return "done"; },
        function (err) { cleanup(); if (err === STOP) return "stopped"; throw err; }
      );
    },
    stop: function () {
      stopped = true;
      paused = false;
      held = [];
      cleanup();
    },
    pause: function () {
      if (!current || paused) return;
      paused = true;
      held = current.card.getAnimations({ subtree: true }).filter(function (a) { return a.playState === "running"; });
      held.forEach(function (a) { a.pause(); });
    },
    resume: function () {
      if (!paused) return;
      paused = false;
      held.forEach(function (a) { try { a.play(); } catch (_) { /* element already gone */ } });
      held = [];
    }
  };
})();
