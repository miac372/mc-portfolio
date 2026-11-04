// ===== Theme (light / dark) =====
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }

    // ===== Mobile menu =====
    var menuBtn = document.querySelector(".menu-btn");
    var links = document.querySelector(".nav-links");
    if (menuBtn && links) {
      menuBtn.addEventListener("click", function () {
        links.classList.toggle("open");
      });
    }

    // ===== Highlight current page in nav =====
    var page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href") === page) a.classList.add("active");
    });

    // ===== Navbar border on scroll =====
    var nav = document.querySelector(".navbar");
    window.addEventListener("scroll", function () {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
    });

    // ===== Reveal on scroll + animate skill bars =====
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          entry.target.querySelectorAll(".skill-fill").forEach(function (bar) {
            bar.style.width = bar.dataset.level + "%";
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });

    // ===== Skills accordion (one open at a time) =====
    document.querySelectorAll(".skill-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var row = head.parentElement;
        var wasOpen = row.classList.contains("open");
        document.querySelectorAll(".skill-row").forEach(function (r) {
          r.classList.remove("open");
          r.querySelector(".skill-head").setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          row.classList.add("open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });

    // ===== Footer year =====
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // ===== Icons =====
    if (window.lucide) window.lucide.createIcons();
  });
})();