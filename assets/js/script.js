const btn = document.querySelector(".menu");
// const theme1 = document.querySelectorAll(".numb-color");
// const theme2 = document.querySelectorAll(".numb-color-1");
// const theme3 = document.querySelectorAll(".sign-color");
// const theme4 = document.querySelectorAll(".sign-color-1");
// const border1 = document.querySelector(".selector-border");
// const border2 = document.querySelector(".selector-border-1");

btn.addEventListener("click", () => {
  const elements = document.querySelectorAll(".keys-numb");
  const istheme = elements[0].classList.contains("numb-color");
  const istheme1 = elements[0].classList.contains("numb-color-1");
  elements.forEach(el => {
    el.classList.toggle('numb-color' , !istheme);
    el.classList.toggle('numb-color-1' , istheme);
    el.classList.toggle('numb-color-2' , istheme1);
    el.classList.toggle('numb-color' , !istheme1);
  });
});
btn.addEventListener("click", () => {
  const elements = document.querySelectorAll(".keys");
  const istheme = elements[0].classList.contains("sign-color");
  const istheme1 = elements[0].classList.contains("sign-color-1");
  elements.forEach(el => {
    el.classList.toggle('sign-color' , !istheme);
    el.classList.toggle('sign-color-1' , istheme);
    el.classList.toggle('sign-color-2', istheme1);
    el.classList.toggle('sign-color' , !istheme1);
  });
});
btn.addEventListener("click", () => {
  const elements = document.querySelectorAll(".selector");
  const istheme = elements[0].classList.contains("selector-border");
  const istheme1 = elements[0].classList.contains("selector-border-1");
  elements.forEach(el => {
    el.classList.toggle('selector-border' , !istheme);
    el.classList.toggle('selector-border-1' , istheme);
    el.classList.toggle('selector-border-2' , istheme1);
    el.classList.toggle('selector-border' , !istheme1);
  });
});

// btn.addEventListener("click", () => {
//   const elements = document.querySelectorAll(".keys");
//   const istheme = elements[0].classList.contains("sign-color-2");
//   elements.forEach(el => {
//     el.classList.toggle('keys-2', !istheme);
//     el.classList.toggle('keys-2', istheme);
//   });
// });
// btn.addEventListener("click", () => {
//   const elements = document.querySelectorAll(".keys");
//   const istheme = elements[0].classList.contains("numb-color-2");
//   elements.forEach(el => {
//     el.classList.toggle('keys-numb-2', !istheme);
//     el.classList.toggle('keys-numb-2', istheme);
//   });
// });
