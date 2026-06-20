(function () {
  const config = window.BAIMAI_CONFIG;
  const defaultMessage = "Hi BaiMai Wholesale, I'm interested in BaiPure / EnerGo pricing for my business.";

  const $ = (selector) => document.querySelector(selector);
  const icons = {
    leaf: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 5c-5.5.4-9.7 2.3-12.2 5.6C4.9 13 4.2 16.3 5 19c2.7.8 6-.1 8.4-2.1C16.7 14.3 18.6 10 19 5Z"/>
        <path d="M8 16c2.3-2.1 4.9-3.9 8-5.5"/>
      </svg>`,
    truck: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h11v8H3z"/>
        <path d="M14 10h3l3 3v2h-6z"/>
        <circle cx="7.5" cy="18" r="1.8"/>
        <circle cx="17.5" cy="18" r="1.8"/>
      </svg>`,
    box: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 4.5 7 12 11 19.5 7 12 3Z"/>
        <path d="M4.5 7v9L12 20l7.5-4V7"/>
        <path d="M12 11v9"/>
      </svg>`,
    badgeLeaf: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 5c-5.5.4-9.7 2.3-12.2 5.6C4.9 13 4.2 16.3 5 19c2.7.8 6-.1 8.4-2.1C16.7 14.3 18.6 10 19 5Z"/>
        <path d="M8 16c2.3-2.1 4.9-3.9 8-5.5"/>
      </svg>`,
    message: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
      </svg>`,
    price: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v16"/>
        <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.2 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3"/>
      </svg>`,
    order: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h12"/>
        <path d="M6 10h12"/>
        <path d="M6 16h8"/>
        <path d="m15 19 2 2 4-4"/>
      </svg>`,
    arrow: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14"/>
        <path d="m13 6 6 6-6 6"/>
      </svg>`
  };

  function whatsappUrl(message = defaultMessage) {
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function iconMarkup(name) {
    return `<span class="icon icon-${name}" aria-hidden="true">${icons[name] || ""}</span>`;
  }

  function renderHero() {
    $("#heroHeadline").textContent = config.headline;
    $("#heroSubheadline").textContent = config.subheadline;
    $("#heroHighlights").innerHTML = config.heroHighlights
      .map((note) => `<span><em>${note}</em></span>`)
      .join("");

    const pricingMessage = config.contactMessage;
    $("#directWhatsApp").href = whatsappUrl(pricingMessage);
    $("#heroPricingCta").href = whatsappUrl(pricingMessage);
    $("#productsPricingCta").href = whatsappUrl(pricingMessage);
    $("#floatingWhatsApp").href = whatsappUrl(pricingMessage);
    $("#footerWhatsApp").href = whatsappUrl(pricingMessage);
    $("#directWhatsApp").innerHTML = `${iconMarkup("message")}<span>Request Pricing on WhatsApp</span>`;
    $("#heroPricingCta").innerHTML = `<span>Request Pricing</span>${iconMarkup("arrow")}`;
    $("#productsPricingCta").innerHTML = `<span>Request Wholesale Pricing</span>${iconMarkup("arrow")}`;
  }

  function productCard(product) {
    const slug = `${product.name}-${product.flavor || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `
      <article class="carousel-product ${product.focus ? "carousel-product-focus" : ""} product-${slug}">
        <figure class="carousel-product-figure">
          ${
            product.image
              ? `<img class="carousel-product-image" src="${product.image}" alt="${product.name}">`
              : `<div class="carousel-product-placeholder" aria-hidden="true"><span>${product.name}</span></div>`
          }
        </figure>
        <div class="carousel-product-copy">
          <strong>${product.name}</strong>
          ${product.flavor ? `<small class="carousel-product-flavor">${product.flavor}</small>` : ""}
          <span>${product.type}</span>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const products = config.featuredProducts;
    const track = $("#productCarouselTrack");
    $("#productsIntro").textContent = config.productsIntro;
    const repeated = [...products, ...products, ...products];
    track.innerHTML = repeated.map(productCard).join("");
  }

  function renderProcess() {
    const processIcons = ["message", "price", "order"];
    $("#processGrid").innerHTML = config.howItWorks
      .map(
        (step, index) => `
          <article class="process-card">
            <span>${iconMarkup(processIcons[index] || "message")}</span>
            <h3>${step.title}</h3>
          </article>
        `
      )
      .join("");
  }

  function setupCarouselControls() {
    const carousel = $(".product-carousel");
    const prevButton = $("#carouselPrev");
    const nextButton = $("#carouselNext");
    const track = $("#productCarouselTrack");
    if (!carousel || !prevButton || !nextButton) return;

    const baseCount = config.featuredProducts.length;
    if (!track || !baseCount) return;

    let setWidth = 0;

    const measure = () => {
      setWidth = track.scrollWidth / 3;
      if (setWidth > 0 && carousel.scrollLeft === 0) {
        carousel.scrollLeft = setWidth;
      }
    };

    const normalizeLoop = () => {
      if (!setWidth) return;
      if (carousel.scrollLeft < setWidth * 0.5) {
        carousel.scrollLeft += setWidth;
      } else if (carousel.scrollLeft > setWidth * 1.5) {
        carousel.scrollLeft -= setWidth;
      }
    };

    const scrollAmount = () => Math.max(220, Math.round(carousel.clientWidth * 0.72));

    prevButton.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    nextButton.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });

    carousel.addEventListener("scroll", normalizeLoop, { passive: true });
    window.addEventListener("resize", measure);

    measure();
  }

  function setupSectionNav() {
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (!navLinks.length) return;

    const sectionIds = navLinks
      .map((link) => link.getAttribute("href"))
      .filter(Boolean)
      .map((href) => href.slice(1));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActiveLink = (targetId) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${targetId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          setActiveLink(href.slice(1));
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupMobileFloatingWhatsApp() {
    const floatingButton = $("#floatingWhatsApp");
    const hero = $(".hero");
    const mobileQuery = window.matchMedia("(max-width: 560px)");
    if (!floatingButton || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        floatingButton.classList.toggle("is-hidden-on-hero", mobileQuery.matches && entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    observer.observe(hero);

    mobileQuery.addEventListener("change", () => {
      if (!mobileQuery.matches) {
        floatingButton.classList.remove("is-hidden-on-hero");
      }
    });
  }

  renderHero();
  renderProducts();
  renderProcess();
  setupCarouselControls();
  setupSectionNav();
  setupMobileFloatingWhatsApp();
})();
