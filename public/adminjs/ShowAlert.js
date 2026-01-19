function showAlert(message, title = "Alert") {
  // Overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  });

  // Modal box
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#073615",
    color: "#fff",
    padding: "20px",
    width: "300px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative"
  });

  // Title
  const h3 = document.createElement("h3");
  h3.innerText = title;

  // Message
  const p = document.createElement("p");
  p.innerText = message;

  // OK Button
  const btn = document.createElement("button");
  btn.innerText = "OK";
  Object.assign(btn.style, {
    marginTop: "15px",
    padding: "8px 20px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px"
  });

  // Close logic
  btn.onclick = () => overlay.remove();

  modal.appendChild(h3);
  modal.appendChild(p);
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

//showAlert("আপনার কাজ সফল হয়েছে");