function ShowLoading() {

  // overlay
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999"
  });

  // loader
  const loader = document.createElement("div");
  Object.assign(loader.style, {
    width: "40px",
    height: "40px",
    border: "2px solid #ccc",
    borderTop: "2px solid #333",
    borderRadius: "50%"
  });

  let angle = 0;
  function spin() {
    angle = (angle + 6) % 360;
    loader.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(spin);
  }
  spin();

  overlay.appendChild(loader);
  document.body.appendChild(overlay);
}
ShowLoading()
