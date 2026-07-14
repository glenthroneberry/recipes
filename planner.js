(function () {
  "use strict";

  var STORAGE_SELECTIONS = "recipeSite:plannerSelections";
  var STORAGE_CHECKED = "recipeSite:shoppingChecked";

  var pickerEl = document.getElementById("recipe-picker");
  var listSectionEl = document.getElementById("shopping-list-section");
  var listEl = document.getElementById("shopping-list");

  var recipes = [];
  // selections: { [recipe.url]: multiplier (integer >= 1) }
  var selections = loadJSON(STORAGE_SELECTIONS, {});
  // checked: { [itemKey]: true }
  var checked = loadJSON(STORAGE_CHECKED, {});

  function loadJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* localStorage unavailable — selections just won't persist */
    }
  }

  function fetchRecipes() {
    // relative to this page's own URL, so it works whether the site
    // lives at the domain root or under a /reponame/ subpath
    var url = new URL("recipes.json", window.location.href);
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load recipes.json");
        return res.json();
      })
      .then(function (data) {
        recipes = data || [];
        renderPicker();
        renderShoppingList();
      })
      .catch(function (err) {
        pickerEl.innerHTML =
          '<p class="error">Could not load recipes. If you\'re running this locally, ' +
          "make sure you're serving it (e.g. <code>bundle exec jekyll serve</code>) " +
          "rather than opening the HTML file directly.</p>";
        console.error(err);
      });
  }

  function renderPicker() {
    if (!recipes.length) {
      pickerEl.innerHTML = "<p>No recipes yet — add some to <code>_recipes/</code>.</p>";
      return;
    }

    var html = '<ul class="planner-list">';
    recipes.forEach(function (recipe, i) {
      var mult = selections[recipe.url] || 0;
      var checkedAttr = mult > 0 ? "checked" : "";
      html +=
        '<li class="planner-item" data-index="' + i + '">' +
        '<label>' +
        '<input type="checkbox" class="recipe-toggle" data-url="' +
        escapeAttr(recipe.url) +
        '" ' +
        checkedAttr +
        " />" +
        '<a href="' + escapeAttr(recipe.url) + '">' + escapeHtml(recipe.title) + "</a>" +
        "</label>" +
        '<span class="mult-controls" style="' +
        (mult > 0 ? "" : "visibility:hidden") +
        '">' +
        '<button type="button" class="mult-btn" data-url="' +
        escapeAttr(recipe.url) +
        '" data-delta="-1">-</button>' +
        '<span class="mult-count">' + (mult || 1) + "&times;</span>" +
        '<button type="button" class="mult-btn" data-url="' +
        escapeAttr(recipe.url) +
        '" data-delta="1">+</button>' +
        "</span>" +
        "</li>";
    });
    html += "</ul>";
    pickerEl.innerHTML = html;

    // wire up events
    Array.prototype.forEach.call(
      pickerEl.querySelectorAll(".recipe-toggle"),
      function (cb) {
        cb.addEventListener("change", function () {
          var url = cb.getAttribute("data-url");
          if (cb.checked) {
            selections[url] = selections[url] || 1;
          } else {
            delete selections[url];
          }
          saveJSON(STORAGE_SELECTIONS, selections);
          renderPicker();
          renderShoppingList();
        });
      }
    );

    Array.prototype.forEach.call(
      pickerEl.querySelectorAll(".mult-btn"),
      function (btn) {
        btn.addEventListener("click", function () {
          var url = btn.getAttribute("data-url");
          var delta = parseInt(btn.getAttribute("data-delta"), 10);
          var current = selections[url] || 1;
          var next = current + delta;
          if (next < 1) next = 1;
          selections[url] = next;
          saveJSON(STORAGE_SELECTIONS, selections);
          renderPicker();
          renderShoppingList();
        });
      }
    );
  }

  function renderShoppingList() {
    var selectedUrls = Object.keys(selections);
    if (!selectedUrls.length) {
      listSectionEl.style.display = "none";
      return;
    }
    listSectionEl.style.display = "";

    var combined = {}; // key: "name|unit" -> { name, unit, amount }
    recipes.forEach(function (recipe) {
      var mult = selections[recipe.url];
      if (!mult) return;
      (recipe.ingredients || []).forEach(function (ing) {
        var name = (ing.name || "").trim();
        var unit = (ing.unit || "").trim();
        var amount = parseFloat(ing.amount) || 0;
        var key = name.toLowerCase() + "|" + unit.toLowerCase();
        if (!combined[key]) {
          combined[key] = { name: name, unit: unit, amount: 0 };
        }
        combined[key].amount += amount * mult;
      });
    });

    var items = Object.keys(combined)
      .map(function (key) {
        return combined[key];
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

    listEl.innerHTML = items
      .map(function (item) {
        var amountText = formatAmount(item.amount);
        var unitText = item.unit && item.unit !== "whole" ? " " + item.unit : "";
        var label = (amountText ? amountText + unitText + " " : "") + item.name;
        var itemKey = item.name.toLowerCase() + "|" + item.unit.toLowerCase();
        var isChecked = !!checked[itemKey];
        return (
          '<li class="' +
          (isChecked ? "checked" : "") +
          '">' +
          '<label><input type="checkbox" class="item-check" data-key="' +
          escapeAttr(itemKey) +
          '" ' +
          (isChecked ? "checked" : "") +
          " />" +
          escapeHtml(label) +
          "</label></li>"
        );
      })
      .join("");

    Array.prototype.forEach.call(
      listEl.querySelectorAll(".item-check"),
      function (cb) {
        cb.addEventListener("change", function () {
          var key = cb.getAttribute("data-key");
          if (cb.checked) {
            checked[key] = true;
          } else {
            delete checked[key];
          }
          saveJSON(STORAGE_CHECKED, checked);
          cb.closest("li").classList.toggle("checked", cb.checked);
        });
      }
    );
  }

  function formatAmount(n) {
    if (!n) return "";
    var rounded = Math.round(n * 100) / 100;
    return String(rounded);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  document.getElementById("copy-btn").addEventListener("click", function () {
    var text = Array.prototype.map
      .call(listEl.querySelectorAll("li"), function (li) {
        return li.textContent.trim();
      })
      .join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  });

  document.getElementById("print-btn").addEventListener("click", function () {
    window.print();
  });

  document.getElementById("reset-checks-btn").addEventListener("click", function () {
    checked = {};
    saveJSON(STORAGE_CHECKED, checked);
    renderShoppingList();
  });

  fetchRecipes();
})();
