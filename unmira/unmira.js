var unmira = {
  graphics: {},
  cmds: {
    /** commands to be pushed on unmira.state.queue
     * (like vm instructions)
     */
    readline: function () {
      unmira.state.running = false;
      if (unmira.state.input.buf.length > 1) {
        // if input buffered
        unmira.state.stack.push(unmira.state.input.buf.shift()); // push one line of input
        unmira.state.running = true; // continue
      } else {
        unmira.state.input.waiting = true; // wait for input
      }
    },
    getchar: function () {
      unmira.state.running = false;
      if (unmira.state.input.buf.length) {
        unmira.stack.push(unmira.state.input.buf[0][0] || "\n"); // first char
        unmira.state.running = true; // continue
      } else {
        unmira.state.input.getchar = true; // wait for input
      }
    },
    print: function () {
      unmira.state.termBuf += unmira.state.stack.pop();
      unmira.state.running = true;
    },
    puts: function () {
      unmira.state.termBuf += unmira.state.stack.pop() + "\n";
      unmira.state.running = true;
    },
    dopush: function (data) {
      return function () {
        unmira.state.stack.push(data);
        unmira.state.running = true;
      };
    },
    dup: function () {
      unmira.state.stack.push(
        unmira.state.stack[unmira.state.stack.length - 1]
      );
      unmira.state.running = true;
    },
    do: function (fn) {
      return function () {
        fn();
        unmira.state.running = true;
      };
    },
    halt: function () {
      window.clearInterval(unmira.state.interval);
      unmira.state.interval = undefined;
    }
  }
};

unmira.freshstate = function () {
  unmira.state = {
    queue: [],
    screenBuf: "",
    termBuf: "",
    data: {},
    stack: [],
    running: false,
    handlers: {
      keydown: [],
      keyup: []
    },
    input: {
      buf: [""],
      waiting: false,
      getchar: false
    }
  };
};

unmira.logo = `  A A A A A A A
 / V V V V V V \\
(  S----------, )  -----A-A------
 ) |          |(   || n IV Ii [)a
(  |          | )  \`'-------- I\\-
 ) |          |(
(  |          | )
 ) |          |(
(  |          | )
 ) |          |(
(  |          | )
 ) |          |(
(  \`----------' )
 \\ A A A A A A /
  V V V V V V V`;

unmira.run = function () {
  unmira.state.running = false;
  unmira.state.queue.shift()(); // run the front of the command queue
  if (unmira.state.interval === undefined) {
    unmira.keepRunning();
  }
};

unmira.freshstate();
