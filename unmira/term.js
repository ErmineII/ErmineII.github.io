var unmira = window.unmira;

unmira.state.handlers.keyup.push(function (_) {
  unmira.state.data["term"].update();
});

unmira.state.data["term"] = {
  keyupHandlerIndex: unmira.state.handlers.keyup.length - 1,
  prompt: "> ",
  cmds: {},
  update: function () {
    unmira.graphics.setTerm(
      unmira.state.termBuf + (unmira.state.input.buf[0] || "")
    );
  },
  cleanup: function () {
    unmira.state.handlers.keyup[
      unmira.state.data["term"].keyupHandlerIndex
    ] = null;
    unmira.state.data["term"] = null;
  },
  readeval_cmd: function () {
    var data = unmira.state.data["term"];
    if (!data) {
      unmira.state.running = true; //do nothing
      return;
    }
    unmira.state.queue.push(
      unmira.cmds.dopush(data.prompt),
      unmira.cmds.print,
      unmira.cmds.do(data.update),
      unmira.cmds.readline,
      unmira.cmds.dup,
      unmira.cmds.puts,
      data.runstring_cmd,
      data.readeval_cmd
    );
    unmira.state.running = true;
  },
  runstring_cmd: function () {
    // actually evaluate the input at the terminal
    var commands = unmira.state.stack.pop();
    if (commands === "END!") {
      unmira.state.data["term"].cleanup();
      unmira.state.running = true;
      return;
    }
    commands = commands.split(" ");
    console.log(commands);
    commands.forEach(function (cmd) {
      if (cmd[0] === "'") {
        unmira.state.queue.push(unmira.cmds.dopush(cmd.substring(1)));
      } else {
        unmira.state.queue.push(
          unmira.state.data["term"].cmds[cmd] || unmira.cmds[cmd]
        );
      }
    });
    console.log(unmira.state);
    unmira.state.running = true;
  }
};

unmira.state.queue.push(
  unmira.cmds.dopush(`Welcome to the unmira console. Try 'help'.`),
  unmira.cmds.puts,
  unmira.state.data["term"].readeval_cmd
);
unmira.run();
