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