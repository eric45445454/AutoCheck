/*
 * Configuración rápida
 * ------------------------------------------------------------------
 * 1) Video de Walter: coloca el MP4 en WALTER_VIDEO_PATH.
 * 2) Si guardas el programa en OneCompiler y obtienes una URL como
 *    https://onecompiler.com/cpp/ABC123, coloca solo ABC123 en
 *    ONECOMPILER_PROJECT_ID. Vacío también funciona: se abre el editor
 *    general y se carga final.cpp mediante postMessage.
 */
const ONECOMPILER_PROJECT_ID = "";
const WALTER_VIDEO_PATH = "assets/video/walter-autocheck.mp4";

const nav = document.querySelector(".main-nav");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress span");
const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll(".main-nav a")];

menuToggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progress) progress.style.width = `${percentage}%`;
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const activeObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    const activeId = visible.target.dataset.section;
    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", target === activeId);
    });
  },
  { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => activeObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Ejemplo interactivo del cálculo de mantenimiento.
const stateButtons = [...document.querySelectorAll(".state-switch button")];
const currentKm = document.getElementById("current-km");
const maintenanceStatus = document.getElementById("maintenance-status");
const statusMessage = maintenanceStatus?.querySelector(":scope > b");

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const overdue = button.dataset.state === "overdue";
    stateButtons.forEach((item) => item.classList.toggle("active", item === button));
    if (currentKm) currentKm.textContent = overdue ? "89,000 km" : "84,000 km";
    maintenanceStatus?.classList.toggle("overdue", overdue);
    maintenanceStatus?.classList.toggle("upcoming", !overdue);
    if (statusMessage) {
      statusMessage.textContent = overdue ? "MANTENIMIENTO VENCIDO" : "Faltan 4,000 km";
    }
  });
});

// Ruta preparada para el video grabado de Walter.
const walterVideo = document.getElementById("walter-video");
const walterSource = document.getElementById("walter-video-source");
const videoPlaceholder = document.getElementById("video-placeholder");

if (walterVideo instanceof HTMLVideoElement && walterSource instanceof HTMLSourceElement) {
  walterSource.src = WALTER_VIDEO_PATH;
  walterVideo.load();
  walterVideo.addEventListener("loadedmetadata", () => videoPlaceholder?.classList.add("hidden"));
  walterVideo.addEventListener("error", () => videoPlaceholder?.classList.remove("hidden"));
}

// Integración de OneCompiler.
const compilerFrame = document.getElementById("onecompiler-frame");
const compilerLoading = document.getElementById("compiler-loading");
const compilerFallback = document.getElementById("compiler-fallback");
const loadCodeButton = document.getElementById("load-code");
const retryCompilerButton = document.getElementById("retry-compiler");
let compilerTimeout;

function getOneCompilerUrl() {
  const projectId = ONECOMPILER_PROJECT_ID.trim();
  // El editor genérico/C++ embebido presenta actualmente un fallo de inicio en
  // algunos navegadores. La plantilla Python inicia de forma estable y el evento
  // populateCode cambia inmediatamente el editor a C++ al cargar AutoCheck.
  const projectSegment = projectId ? `/cpp/${encodeURIComponent(projectId)}` : "/python";
  // Usamos solo los parámetros esenciales documentados. La combinación de
  // opciones visuales adicionales puede impedir que el editor embebido inicie.
  return `https://onecompiler.com/embed${projectSegment}?codeChangeEvent=true&listenToEvents=true&hideNew=true`;
}

function populateAutoCheck() {
  if (!(compilerFrame instanceof HTMLIFrameElement)) return;

  // final-code.js expone el programa como texto. La compatibilidad con `.value`
  // evita que una copia generada anteriormente envíe un objeto a OneCompiler.
  const sourceCode =
    typeof window.AUTOCHECK_CPP === "string"
      ? window.AUTOCHECK_CPP
      : window.AUTOCHECK_CPP?.value;

  if (typeof sourceCode !== "string" || sourceCode.length === 0) {
    showCompilerFallback();
    return;
  }

  compilerFrame.contentWindow?.postMessage(
    {
      eventType: "populateCode",
      language: "cpp",
      files: [{ name: "main.cpp", content: sourceCode }],
    },
    "*",
  );
}

function showCompilerFallback() {
  compilerLoading?.classList.add("hidden");
  if (compilerFallback) compilerFallback.hidden = false;
}

function loadCompiler() {
  if (!(compilerFrame instanceof HTMLIFrameElement)) return;
  if (compilerFallback) compilerFallback.hidden = true;
  compilerLoading?.classList.remove("hidden");
  compilerFrame.src = getOneCompilerUrl();
  window.clearTimeout(compilerTimeout);
  compilerTimeout = window.setTimeout(showCompilerFallback, 15000);
}

compilerFrame?.addEventListener("load", () => {
  window.clearTimeout(compilerTimeout);
  compilerLoading?.classList.add("hidden");
  if (compilerFallback) compilerFallback.hidden = true;
});

loadCodeButton?.addEventListener("click", populateAutoCheck);
retryCompilerButton?.addEventListener("click", loadCompiler);

window.addEventListener("offline", showCompilerFallback);
window.addEventListener("online", () => {
  if (compilerFrame instanceof HTMLIFrameElement && !compilerFrame.src) loadCompiler();
});

// El compilador se carga solo cuando la demostración está cerca.
const compilerObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    if (navigator.onLine) loadCompiler();
    else showCompilerFallback();
    observer.disconnect();
  },
  { rootMargin: "500px" },
);

const demoSection = document.getElementById("demostracion");
if (demoSection) compilerObserver.observe(demoSection);
