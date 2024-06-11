const toggleTheme = () => {
  const theme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
  document.getElementById("themeStyle").href = `styles/${theme}.css`;
  document.getElementById("themeIcon").src =
    theme === "light" ? "lib/sun.svg" : "lib/moon.svg";
  localStorage.setItem("theme", theme);
};

const setTheme = () => {
  const theme = localStorage.getItem("theme") || "dark";
  document.getElementById("themeStyle").href = `styles/${theme}.css`;
  document.getElementById("themeIcon").src =
    theme === "light" ? "lib/sun.svg" : "lib/moon.svg";
};

setTheme();
