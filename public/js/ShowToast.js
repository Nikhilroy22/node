// =======================================
// PROFESSIONAL TOAST SYSTEM (JS ONLY)
// =======================================
(function initToastSystem() {
  // Prevent duplicate init
  if (document.getElementById("toastContainer")) return;

  const container = document.createElement("div");
  container.id = "toastContainer";

  Object.assign(container.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "90vw",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
  });

  document.body.appendChild(container);

  // Styles + animations
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      to { opacity: 0; transform: translateY(10px); }
    }

    @media (max-width: 640px) {
      #toastContainer {
        top: auto !important;
        bottom: 16px !important;
        right: 50% !important;
        transform: translateX(50%);
        align-items: center;
      }
    }
  `;
  document.head.appendChild(style);
})();

// =======================================
// SHOW TOAST
// =======================================
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");

  Object.assign(toast.style, {
    minWidth: "240px",
    background: "#1f2937",
    color: "#fff",
    padding: "12px 40px 12px 16px",
    borderRadius: "8px",
    boxShadow: "0 6px 18px rgba(0,0,0,.35)",
    position: "relative",
    animation: "toastIn .3s ease forwards",
    fontSize: "14px",
    lineHeight: "1.4"
  });

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b"
  };

  toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
  toast.textContent = message;

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "6px",
    right: "10px",
    cursor: "pointer",
    fontSize: "18px",
    opacity: "0.7"
  });

  closeBtn.onclick = () => removeToast();
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  const timer = setTimeout(removeToast, duration);

  function removeToast() {
    clearTimeout(timer);
    toast.style.animation = "toastOut .25s ease forwards";
    setTimeout(() => toast.remove(), 350);
  }
}







