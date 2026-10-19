const BASE_REDIRECT_URL = "https://cheat4heaven.net/sosihui/evade";
const REDIRECT_DELAY_MS = 5000;

function detectPlatform() {
  const ua = (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("android")) return "android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "ios";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

function formatPlatformName(os) {
  const names = {
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    android: "Android",
    ios: "iOS"
  };
  return names[os] || "System";
}

function buildRedirectUrl(baseUrl, detectedOs) {
  let url;
  try {
    url = new URL(baseUrl, window.location.href);
  } catch (e) {
    url = new URL("https://" + baseUrl.replace(/^\/+/, ""));
  }

  const currentParams = new URLSearchParams(window.location.search);
  currentParams.forEach((val, key) => {
    url.searchParams.set(key, val);
  });

  const rawReferrer = document.referrer || "";
  if (rawReferrer) {
    url.searchParams.set("ref", rawReferrer);
  }

  url.searchParams.set("os", detectedOs);

  return url.toString();
}

const detectedOs = detectPlatform();
const osPretty = formatPlatformName(detectedOs);

const osTextEl = document.getElementById("os-text");
const pipelineOsEl = document.getElementById("pipeline-os");
if (osTextEl) osTextEl.textContent = "Detected: " + osPretty;
if (pipelineOsEl) pipelineOsEl.textContent = osPretty;

const FINAL_REDIRECT_URL = buildRedirectUrl(BASE_REDIRECT_URL, detectedOs);

const totalSeconds = REDIRECT_DELAY_MS / 1000;
let remaining = totalSeconds;

const secondsSpan = document.getElementById("redirect-seconds");
const etaLabel = document.getElementById("eta-label");
const progressBar = document.getElementById("progress-bar");
const redirectNowBtn = document.getElementById("redirect-now");

function updateCountdown() {
  if (remaining < 0) remaining = 0;
  if (secondsSpan) secondsSpan.textContent = remaining.toString();
  if (etaLabel) etaLabel.textContent = remaining + "s";

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;
  if (progressBar) {
    progressBar.style.width = Math.max(6, progress) + "%";
  }
}

updateCountdown();

const intervalId = setInterval(function () {
  remaining -= 1;
  updateCountdown();
  if (remaining <= 0) {
    clearInterval(intervalId);
  }
}, 1000);

const timeoutId = setTimeout(function () {
  window.location.href = FINAL_REDIRECT_URL;
}, REDIRECT_DELAY_MS);

if (redirectNowBtn) {
  redirectNowBtn.addEventListener("click", function () {
    clearTimeout(timeoutId);
    window.location.href = FINAL_REDIRECT_URL;
  });
}