var css  = document.getElementById("theme");
var icon = document.getElementById("themech");

icon.width = 30;
icon.height= 30;
var dtheme = css.href == "dp.css" ? 1 : 0;
var themes = [["media/moon.svg","khak.css"],
              ["media/sun.svg", "dp.css"  ]];

icon.src = themes[dtheme][0];
icon.onclick = ()=>{
  dtheme   = 1-dtheme;
  css.href = themes[dtheme][1];
  icon.src = themes[dtheme][0];
};