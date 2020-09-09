let myconsole = {};

(function () {
  myconsole.outp = document.getElementById("out");
  myconsole.inp = document.getElementById("inp");
  myconsole.waiting = true;

  myconsole.log = function (args) {
    myconsole.outp.innerHTML = myconsole.outp.innerHTML + " " + args + "<br> ";
  };

  myconsole.error = function (args) {
    myconsole.outp.innerHTML =
      myconsole.outp.innerHTML + " <strong>ERROR:</strong> " + args + "<br> ";
  };

  var oldLog = console.log;
  console.log = (args) => {
    myconsole.log(args);
    oldLog.apply(console, arguments);
  };

  var oldErr = console.error;
  console.error = (args) => {
    myconsole.error(args);
    oldErr.apply(console, arguments);
  };

  myconsole.inputs = [];
  myconsole.inputoffset = 0;

  myconsole.inp.onkeypress = function (key) {
    myconsole.inputs = myconsole.inputs.map((x) => {
      return x.replace(/^ *$/, "");
    });
    switch (key.keyCode) {
      case 13:
        if (key.shiftKey) {
          myconsole.inputoffset -= 1;
          myconsole.inp.value =
            myconsole.inputs[myconsole.inputs.length - myconsole.inputoffset] ||
            myconsole.inp.value;
          break;
        }
        myconsole.input = myconsole.inp.value;
        myconsole.inputs.push(myconsole.inp.value);
        myconsole.inp.value = "";
        console.log("=> " + myconsole.input);
        myconsole.outp.scrollTop = myconsole.outp.scrollHeight;
        myconsole.waiting = false;
        myconsole.inputhandler && myconsole.inputhandler(myconsole.input);
        myconsole.inputoffset = 0;
        break;
      case 32:
        if (!key.shiftKey) break;
      case 38:
        if (myconsole.inp.value && !myconsole.inputoffset) {
          myconsole.inputs.push(myconsole.inp.value);
        }
        myconsole.inputoffset += 1;
        myconsole.inp.value =
          myconsole.inputs[myconsole.inputs.length - myconsole.inputoffset] ||
          myconsole.inp.value;
        break;
      case 40:
        myconsole.inputoffset -= 1;
        myconsole.inp.value =
          myconsole.inputs[myconsole.inputs.length - myconsole.inputoffset] ||
          myconsole.inp.value;
        break;
      default:
        break;
    }
  };

  myconsole.setinputhandler = function (handler) {
    myconsole.inputhandler = handler;
  };
})();
