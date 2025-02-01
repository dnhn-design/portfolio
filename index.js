const elements = document.querySelectorAll('.hover-effect');

elements.forEach((element) => {
  // Add touchstart event listener
  element.addEventListener('touchstart', () => {
    element.classList.add('touch-hover-effect');
  });

  element.addEventListener('touchend', () => {
    // Remove touch effect
    element.classList.remove('touch-hover-effect');
  });
});

let navbar = document.getElementById(navbar);
let shouldStickPos = navbar.offsetTop;

function addOrRemoveStickyClass() {
    if(window.scrollY >= shouldStickPos) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    };
}

window.onscroll = () => {
    addOrRemoveStickyClass();
}

window.onresize = () => {
    shouldStickPos = navbar.offsetTop;
}
