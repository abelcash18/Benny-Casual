const menuButton = document.querySelector(".menu-button");
const navPanel = document.querySelector(".nav-panel");
const navLinks = [...document.querySelectorAll('a[href^="#"]')];
const sectionLinks = [...document.querySelectorAll(".nav-links a")];
const newsletter = document.querySelector(".newsletter");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector(".form-message");
const toast = document.querySelector(".toast");
let toastTimer;

const showToast = (message) => {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

const closeMenu = () => {
  if (!menuButton || !navPanel) return;
  menuButton.setAttribute("aria-expanded", "false");
  navPanel.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navPanel?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) return;

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", targetId);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  if (!navPanel?.classList.contains("is-open")) return;
  if (navPanel.contains(event.target) || menuButton?.contains(event.target)) return;
  closeMenu();
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
);

sectionLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionObserver.observe(section);
});

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product || "Item";
    button.textContent = "Added";
    button.disabled = true;
    showToast(`${product} added to your preview bag.`);

    setTimeout(() => {
      button.textContent = "Quick add";
      button.disabled = false;
    }, 1800);
  });
});

newsletter?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  formMessage.classList.remove("is-error");

  if (!emailInput.checkValidity()) {
    formMessage.textContent = "Enter a valid email address to join the drop list.";
    formMessage.classList.add("is-error");
    emailInput.focus();
    return;
  }

  localStorage.setItem("bennycasual-email", email);
  formMessage.textContent = "You're on the list. First access is saved in this browser.";
  newsletter.reset();
  showToast("Drop alert saved.");
});

const savedEmail = localStorage.getItem("bennycasual-email");
if (savedEmail && formMessage) {
  formMessage.textContent = "You're already on the first-access list in this browser.";
}