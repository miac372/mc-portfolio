/* =========================================================
   CAPSTONE CAROUSELS
   Each <article data-carousel> cycles through its .cap-slide
   blocks. The label in the counter comes from data-label.
   ========================================================= */
document.querySelectorAll("[data-carousel]").forEach(function (card) {
  var slides = card.querySelectorAll(".cap-slide");
  var count = card.querySelector(".cap-count");
  var dotsWrap = card.querySelector(".cap-dots");
  var current = 0;

  // Build one dot per slide
  slides.forEach(function (slide, i) {
    var dot = document.createElement("button");
    dot.className = "cap-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Slide " + (i + 1) + ": " + slide.dataset.label);
    dot.addEventListener("click", function () { show(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll(".cap-dot");

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === current); });
    dots.forEach(function (d, n) {
      d.classList.toggle("is-active", n === current);
      d.setAttribute("aria-selected", n === current);
    });
    count.textContent = (current + 1) + " / " + slides.length + " · " + slides[current].dataset.label;
  }

  card.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
  card.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });

  // Left/right arrow keys when focus is inside the card
  card.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  
  // Check whether the URL links to a specific carousel slide
  var params = new URLSearchParams(window.location.search);
  var targetCarousel = params.get("carousel");
  var targetSlide = Number(params.get("slide"));

  if (
    card.id === targetCarousel &&
    params.has("slide") &&
    Number.isInteger(targetSlide) &&
    targetSlide >= 1 &&
    targetSlide <= slides.length
  ) {
    show(targetSlide - 1);

    // Scroll to the carousel after the page loads
    window.addEventListener("load", function () {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  } else {
    show(0);
  }

});

// Draw the icons (safe to run even if main.js already did)
if (window.lucide) lucide.createIcons();

// Footer year
var yearEl = document.getElementById("year");
if (yearEl && !yearEl.textContent) yearEl.textContent = new Date().getFullYear();

/* ---------- EVENT GALLERY ---------- */
document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
  var main = gallery.querySelector(".cap-gallery__main img");
  var thumbs = gallery.querySelectorAll(".cap-gallery__thumbs img");
  var caption = gallery.querySelector("figcaption");
  var count = gallery.querySelector(".cap-gallery__count");
  var current = 0;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    var t = thumbs[current];
    main.src = t.src;
    main.alt = t.alt;
    caption.textContent = t.dataset.caption || "";
    count.textContent = (current + 1) + " / " + thumbs.length;
    thumbs.forEach(function (th, n) { th.classList.toggle("is-active", n === current); });
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(i); });
  });


  if (thumbs.length < 2) gallery.classList.add("is-single");
  if (thumbs.length) show(0);
});

/* ---------- PHOTO POP-OUT ---------- */
/* ---------- PHOTO LIGHTBOX ---------- */

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.querySelector(".lightbox-close");

// Open any Capstone image, including the networking gallery
document.querySelectorAll(".cap-shot").forEach(function (img) {
  img.addEventListener("click", function () {
    if (!img.getAttribute("src")) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;

    lightbox.classList.add("active");
  });
});

// Close by clicking the X or outside the image
lightbox.addEventListener("click", function (e) {
  if (e.target === lightbox || e.target === closeButton) {
    lightbox.classList.remove("active");
  }
});

// Close using Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    lightbox.classList.remove("active");
  }
});

// Plus button opens the selected gallery photo
document.querySelectorAll(".cap-gallery__zoom").forEach(function (button) {
  button.addEventListener("click", function () {
    const img = button.closest(".cap-gallery__main").querySelector("img");
    img.click();
  });
});