const tabs = document.querySelectorAll(".product-tab");
const panels = document.querySelectorAll("[data-panel-content]");

function activatePanel(panelName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panelContent === panelName);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activatePanel(tab.dataset.panel));
});
