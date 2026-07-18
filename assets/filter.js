(function () {
  "use strict";

  var buttons = document.querySelectorAll(".tag-filter-btn");
  if (!buttons.length) return;

  var sections = document.querySelectorAll(".recipe-section");

  function applyFilter(tag) {
    sections.forEach(function (section) {
      var anyVisible = false;
      section.querySelectorAll("li").forEach(function (li) {
        var itemTags = (li.getAttribute("data-tags") || "")
          .split(",")
          .map(function (t) {
            return t.trim();
          });
        var show = tag === "all" || itemTags.indexOf(tag) !== -1;
        li.style.display = show ? "" : "none";
        if (show) anyVisible = true;
      });
      section.style.display = anyVisible ? "" : "none";
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tag = btn.getAttribute("data-tag");
      var alreadyActive = btn.classList.contains("active");

      buttons.forEach(function (b) {
        b.classList.remove("active");
      });

      // clicking the already-active tag (other than "All") resets to show everything
      var nextTag = alreadyActive && tag !== "all" ? "all" : tag;
      var nextBtn = alreadyActive && tag !== "all"
        ? document.querySelector('.tag-filter-btn[data-tag="all"]')
        : btn;

      nextBtn.classList.add("active");
      applyFilter(nextTag);
    });
  });
})();
