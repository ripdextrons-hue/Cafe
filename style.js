
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const backTop = document.getElementById("backTop");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");

  // Current year in footer
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Sticky header and back-to-top button
  function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 30);
    backTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  // Mobile navigation
  menuToggle.addEventListener("click", function () {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.textContent = isOpen ? "☰" : "✕";
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation"
    );

    nav.classList.toggle("open", !isOpen);
  });

  // Close mobile navigation after selecting a link
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  // Close menu and gallery using Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
      closeGallery();
    }
  });

  // Back to top
  backTop.addEventListener("click", function () {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  // Functional menu category filters
  const filters = document.querySelectorAll(".filter");
  const menuCards = document.querySelectorAll(".menu-card");

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.filter;

      filters.forEach(function (filter) {
        filter.classList.toggle("active", filter === button);
      });

      menuCards.forEach(function (card) {
        const matches =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        card.classList.toggle("hidden", !matches);
      });
    });
  });

  // Reveal elements when they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      function (entries, observerInstance) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("in-view");
    });
  }

  // Gallery lightbox
  const galleryButtons = Array.from(
    document.querySelectorAll(".gallery-item")
  );

  let currentImageIndex = 0;
  let lastFocusedElement = null;

  const galleryImages = galleryButtons.map(function (button) {
    const image = button.querySelector("img");

    return {
      src: image.src,
      alt: image.alt,
      caption: button.querySelector("span").textContent
        .replace("↗", "")
        .trim()
    };
  });

  function showGalleryImage(index) {
    currentImageIndex =
      (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[currentImageIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
  }

  function openGallery(index) {
    lastFocusedElement = document.activeElement;

    showGalleryImage(index);
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");

    document.getElementById("closeLightbox").focus();
  }

  function closeGallery() {
    if (lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      openGallery(index);
    });
  });

  document.getElementById("closeLightbox")
    .addEventListener("click", closeGallery);

  document.getElementById("prevImage")
    .addEventListener("click", function () {
      showGalleryImage(currentImageIndex - 1);
    });

  document.getElementById("nextImage")
    .addEventListener("click", function () {
      showGalleryImage(currentImageIndex + 1);
    });

  // Close gallery by clicking the dark background
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeGallery();
    }
  });

  // Keyboard gallery navigation
  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;

    if (event.key === "ArrowLeft") {
      showGalleryImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showGalleryImage(currentImageIndex + 1);
    }
  });
});
