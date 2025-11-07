
const themes = ["theme", "theme1", "theme2"];
let currentTheme = 0;

const root = document.documentElement;
const toggleButton = document.querySelector(".menu");

toggleButton.addEventListener("click", () => {
  // حذف تمام تم‌ها از root
  themes.forEach(theme => root.classList.remove(theme));

  // انتخاب تم بعدی
  currentTheme = (currentTheme + 1) % themes.length;

  // اضافه کردن تم جدید
  root.classList.add(themes[currentTheme]);
});