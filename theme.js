var css = document.getElementById("theme");
var icon = document.getElementById("themech");

icon.width = 30;
icon.height = 30;
var themes = [
  ["media/moon.svg", "khak.css"],
  ["media/tree.svg", "dp.css"],
  ["media/snowflake.svg", "olive.css"],
  ["media/sun.svg", "all.css"]
];

var dtheme = 0;
for (let i = 0; i < themes.length; i++)
  if (css.href.match(themes[i][1])) {
    dtheme = i;
    break;
  }

icon.src = themes[dtheme][0];
icon.onclick = () => {
  dtheme = (1 + dtheme) % themes.length;
  css.href = themes[dtheme][1];
  icon.src = themes[dtheme][0];
};
