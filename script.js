/* ===========================
   PORTFOLIO JAVASCRIPT
=========================== */

// ===========================
// Typing Animation
// ===========================

const typingElement = document.getElementById("typing");

const words = [
    "Java Developer",
    "Web Developer",
    "AI Enthusiast",
    "Software Engineer"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    const currentWord = words[wordIndex];

    if (!deleting) {

        typingElement.textContent =
            currentWord.substring(0, charIndex++);

        if (charIndex > currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;

        }

    } else {

        typingElement.textContent =
            currentWord.substring(0, charIndex--);

        if (charIndex === 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

        }

    }

    setTimeout(typeEffect, deleting ? 60 : 120);

}

typeEffect();


// ===========================
// Smooth Scroll
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});


// ===========================
// Navbar Shadow
// ===========================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        navbar.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.5)";

    } else {

        navbar.style.boxShadow =
            "0 5px 20px rgba(0,0,0,.3)";

    }

});


// ===========================
// Active Menu Highlight
// ===========================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});
/* ===========================
   SCROLL REVEAL ANIMATION
=========================== */

const revealElements = document.querySelectorAll(
    ".about-card, .skill, .project-card, .certificate-card, .contact-card"
);

function revealOnScroll() {

    const trigger = window.innerHeight * 0.85;

    revealElements.forEach(element => {

        const top = element.getBoundingClientRect().top;

        if (top < trigger) {

            element.style.opacity = "1";
            element.style.transform = "translateY(0px)";

        }

    });

}

revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(50px)";

    element.style.transition = "0.8s ease";

});

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


/* ===========================
   BACK TO TOP BUTTON
=========================== */

const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

topBtn.id = "topBtn";

document.body.appendChild(topBtn);

Object.assign(topBtn.style, {

    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    background: "#00abf0",
    color: "#081b29",
    fontSize: "22px",
    cursor: "pointer",
    display: "none",
    zIndex: "9999",
    boxShadow: "0 0 20px #00abf0"

});

window.addEventListener("scroll", () => {

    topBtn.style.display = window.scrollY > 300 ? "block" : "none";

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* ===========================
   RIPPLE EFFECT ON BUTTONS
=========================== */

document.querySelectorAll(".btn, .btn-outline").forEach(button => {

    button.addEventListener("click", function(e) {

        const ripple = document.createElement("span");

        ripple.style.position = "absolute";
        ripple.style.width = "15px";
        ripple.style.height = "15px";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255,255,255,.7)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple .6s linear";
        ripple.style.left = (e.offsetX - 8) + "px";
        ripple.style.top = (e.offsetY - 8) + "px";

        this.style.position = "relative";
        this.style.overflow = "hidden";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});


/* ===========================
   RIPPLE KEYFRAMES
=========================== */

const style = document.createElement("style");

style.innerHTML = `
@keyframes ripple{

    to{

        transform:scale(15);

        opacity:0;

    }

}
`;

document.head.appendChild(style);


/* ===========================
   CONSOLE MESSAGE
=========================== */

console.log("Portfolio loaded successfully 🚀");