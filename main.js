(function () {
  var WA_NUMBER = "917574996656";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (links) {
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* Custom selects */
  var selects = document.querySelectorAll(".custom-select");

  function closeSelect(sel) {
    sel.classList.remove("open");
    var trigger = sel.querySelector(".cs-trigger");
    var menu = sel.querySelector(".cs-menu");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (menu) menu.hidden = true;
  }

  function closeAllSelects(except) {
    selects.forEach(function (sel) {
      if (sel !== except) closeSelect(sel);
    });
  }

  selects.forEach(function (sel) {
    var trigger = sel.querySelector(".cs-trigger");
    var menu = sel.querySelector(".cs-menu");
    var hidden = sel.querySelector('input[type="hidden"]');
    var valueEl = sel.querySelector(".cs-value");
    if (!trigger || !menu || !hidden || !valueEl) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = sel.classList.contains("open");
      closeAllSelects();
      if (!open) {
        sel.classList.add("open");
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        var first = menu.querySelector("li");
        if (first) first.focus();
      } else {
        closeSelect(sel);
      }
    });

    menu.querySelectorAll("li").forEach(function (option) {
      option.addEventListener("click", function (e) {
        e.stopPropagation();
        var val = option.getAttribute("data-value") || option.textContent.trim();
        hidden.value = val;
        valueEl.textContent = option.textContent.trim();
        valueEl.classList.remove("is-placeholder");
        menu.querySelectorAll("li").forEach(function (li) {
          li.classList.remove("selected");
          li.setAttribute("aria-selected", "false");
        });
        option.classList.add("selected");
        option.setAttribute("aria-selected", "true");
        closeSelect(sel);
        trigger.focus();
      });
    });

    menu.addEventListener("keydown", function (e) {
      var options = Array.prototype.slice.call(menu.querySelectorAll("li"));
      var current = options.indexOf(document.activeElement);
      if (e.key === "Escape") {
        closeSelect(sel);
        trigger.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (current < options.length - 1) options[current + 1].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (current > 0) options[current - 1].focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (document.activeElement && document.activeElement.tagName === "LI") {
          document.activeElement.click();
        }
      }
    });
  });

  document.addEventListener("click", function () {
    closeAllSelects();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllSelects();
  });

  /* Form submit → WhatsApp */
  var form = document.getElementById("leadForm");
  var formError = document.getElementById("formError");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var mobile = (data.get("mobile") || "").toString().trim();
      var practice = (data.get("practice") || "").toString().trim();
      var type = (data.get("type") || "").toString().trim();
      var locations = (data.get("locations") || "").toString().trim();

      var mobileOk = /^[0-9+\s\-()]{8,15}$/.test(mobile);

      if (!name || !mobile || !practice || !type || !locations || !mobileOk) {
        if (formError) formError.hidden = false;
        return;
      }

      if (formError) formError.hidden = true;

      var message = [
        "Hi FlowCare! I'd like to book a demo.",
        "",
        "*Demo request*",
        "Name: " + name,
        "Mobile: " + mobile,
        "Practice: " + practice,
        "Practice type: " + type,
        "Locations: " + locations,
        "",
        "Source: FlowCare website inquiry form"
      ];

      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message.join("\n"));
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
})();
