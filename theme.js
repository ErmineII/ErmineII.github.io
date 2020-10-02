var css = document.getElementById("theme");
var icon = document.getElementById("themech");

icon.width = 30;
icon.height = 30;
var themes = [
  ["media/sun.svg", "khak.css"],
  ["media/moon.svg", "dp.css"],
  ["media/tree.svg", "olive.css"],
  ["media/snowflake.svg", "all.css"]
];

var dtheme = localStorage.getItem("theme");

if (dtheme === null) {
  for (let i = 0; i < themes.length; i++)
    if (css.href.match(themes[i][1])) {
      dtheme = i;
      break;
    }
} else {
  css.href = themes[dtheme][1];
}

dtheme = parseInt(dtheme, 10);

icon.src = themes[(dtheme + 1) % themes.length][0];
icon.onclick = () => {
  dtheme = (1 + dtheme) % themes.length;
  localStorage.setItem("theme", dtheme);
  css.href = themes[dtheme][1];
  icon.src = themes[(dtheme + 1) % themes.length][0];
};
