var unmira = window.unmira;
unmira.graphics.screen = document.getElementById("screen");
unmira.graphics.term = document.getElementById("term");
unmira.graphics.all = document.getElementById("interface");

unmira.graphics.setScreen = function (contents) {
  unmira.graphics.screen.value = contents;
};

unmira.graphics.setTerm = function (contents) {
  unmira.graphics.term.value = contents;
  unmira.graphics.term.scrollTop = unmira.graphics.term.scrollHeight;
};

unmira.graphics.term.onkeydown = function (k) {
  unmira.state.handlers.keydown.forEach(function (f) {
    f(k.key);
  });
  if (k.key === "Enter") {
    if (unmira.state.input.waiting) {
      unmira.state.stack.push(unmira.state.input.buf.pop() || "");
      unmira.state.input.waiting = false;
      return unmira.run();
    } else {
      unmira.state.input.buf.unshift("");
    }
  } // if is enter

  if (k.key === "Backspace") {
    unmira.state.input.buf[0] = unmira.state.input.buf[0].slice(0, -1);
    return;
  }
  if (k.key.length === 1) {
    unmira.state.input.buf[0] = unmira.state.input.buf[0] || "";
    unmira.state.input.buf[0] += k.key;
  }

  if (unmira.state.input.getchar) {
    unmira.state.input.getchar = false;
    return unmira.cmds.getchar();
  }
};

unmira.graphics.term.onkeyup = function (k) {
  unmira.state.handlers.keyup.forEach(function (f) {
    f(k.key);
  });
};

unmira.keepRunning = function () {
  unmira.state.interval = window.setInterval(function () {
    if (unmira.state.running) unmira.run();
  });
};
