var unmira = window.unmira;

unmira.state.handlers.keyup.push(function (_) {
  unmira.state.data["term"].update();
});

unmira.state.data["term"] = {
  keyupHandlerIndex: unmira.state.handlers.keyup.length - 1,
  prompt: "> ",
  cmds: {
    "not": function(){
      unmira.state.stack.push(unmira.state.stack.pop()?0:1);
      unmira.state.running = true;
    },
    "+": function () {
      var fst = unmira.state.stack.pop();
      unmira.state.stack.push(unmira.state.stack.pop() + fst);
      unmira.state.running = true;
    },
    "*": function () {
      var fst = unmira.state.stack.pop();
      unmira.state.stack.push(unmira.state.stack.pop() * fst);
      unmira.state.running = true;
    },
    nl: unmira.cmds._push("\n"),
    "[": function () {
      var compiled = [];
      var cmd = unmira.state.queue.shift();
      while (cmd !== "]") {
        compiled.push(cmd);
        cmd = unmira.state.queue.shift();
      }
      unmira.state.stack.push(compiled);
      unmira.state.running = true;
    },
    "]": "]",
    _get: function (varname) {
      return function () {
        unmira.state.stack.push(unmira.state.data["term"].words[varname]);
        unmira.state.running = true;
      };
    },
    _set: function (varname) {
      return function () {
        unmira.state.data["term"].words[varname] = unmira.state.stack.pop();
        unmira.state.running = true;
      };
    },
    _run: function (cmdname) {
      return function () {
        unmira.state.queue = unmira.state.data["term"].words[cmdname].concat(
          unmira.state.queue
        );
        unmira.state.running = true;
      };
    },
    help: unmira.cmds._print(`UnMiRa term: a forth-like interactive shell
basic commands:
readline (-- x): doesn't echo input
dup (x -- x x), drop (x --): manipulate stack
puts, print (x --): output with or without a trailing newline
+ (x x -- x): add or concatenate
screen (-- x), draw (x --): view, set contents of screen
!<var>, @<var>: set, get value of variable
[ <code> ] !<word>: define word
<word>: call word
" <multi word string> ": literal string
'<singlewordquoting>: another literal string
"<csd> <string> <dsc>": custom string delimiters
\\: comment (no parenthesis comments yet)
`),
    dowhile: function () {
      var body = unmira.state.stack.pop();
      body.push(function () {
        if (unmira.state.stack.pop()) {
          unmira.state.queue = body.concat(unmira.state.queue);
        }
        unmira.state.running = true;
      });
      unmira.state.queue = body.concat(unmira.state.queue);
      unmira.state.running = true;
    }
  },
  words: {},
  update: function () {
    unmira.graphics.setTerm(
      unmira.state.termBuf + (unmira.state.input.buf[0] || "")
    );
  },
  cleanup: function () {
    delete unmira.state.handlers.keyup[
      unmira.state.data["term"].keyupHandlerIndex
    ];
    delete unmira.state.data["term"];
  },
  readeval_cmd: function () {
    var data = unmira.state.data["term"];
    if (!data) {
      unmira.state.running = true; //do nothing
      return;
    }
    unmira.state.queue.push(
      unmira.cmds._push(data.prompt),
      unmira.cmds.print,
      unmira.cmds._do(data.update),
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
    var cmd;
    while (commands.length) {
      cmd = commands.shift();
      if (cmd[0] === '"') {
        cmd = cmd.split("").reverse().join("");
        var stringbit = "";
        var nextbit = commands.shift();
        while (nextbit !== cmd) {
          if (!commands.length) {
            unmira.state.queue.unshift(
              unmira.cmds._push("ERROR: unfinished string "),
              unmira.cmds.puts
            );
            break;
          }
          stringbit += " " + nextbit;
          nextbit = commands.shift();
        }
        unmira.state.queue.push(unmira.cmds._push(stringbit.substring(1)));
      } else if (cmd[0] === "'") {
        unmira.state.queue.push(unmira.cmds._push(cmd.substring(1)));
      } else if (cmd[0] === "\\") {
        break;
      } else if (cmd[0] === "!") {
        unmira.state.queue.push(
          unmira.state.data["term"].cmds._set(cmd.substring(1))
        );
      } else if (cmd[0] === "@") {
        unmira.state.queue.push(
          unmira.state.data["term"].cmds._get(cmd.substring(1))
        );
      } else if (parseInt(cmd, 10)) {
        unmira.state.queue.push(unmira.cmds._push(parseInt(cmd, 10)));
      } else if (unmira.state.data["term"].words[cmd] !== undefined) {
        unmira.state.queue.push(unmira.state.data["term"].cmds._run(cmd));
      } else {
        unmira.state.queue.push(
          unmira.state.data["term"].cmds[cmd] ||
            unmira.cmds[cmd] ||
            unmira.cmds._print("ERROR: unknown command: '" + cmd + "'\n")
        );
      }
    }
    unmira.state.running = true;
  }
};

unmira.state.queue.push(
  unmira.cmds._push(`Welcome to the unmira console. Try 'help'.`),
  unmira.cmds.puts,
  unmira.state.data["term"].readeval_cmd
);
unmira.run();
