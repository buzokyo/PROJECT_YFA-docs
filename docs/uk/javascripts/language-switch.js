(function () {
  function targetPath(language) {
    return window.location.pathname.replace(
      /\/(en|uk)(?=\/|$)/,
      "/" + language
    ) + window.location.search + window.location.hash;
  }

  function updateLanguageLinks() {
    document.querySelectorAll(".md-select__link[hreflang]").forEach(function (link) {
      var language = link.getAttribute("hreflang");
      if (language !== "en" && language !== "uk") return;
      link.setAttribute("href", targetPath(language));
    });
  }

  // Capture the click before Material's own handler can use the original
  // alternate-language destination.
  document.addEventListener("click", function (event) {
    var link = event.target.closest(".md-select__link[hreflang]");
    if (!link) return;

    var language = link.getAttribute("hreflang");
    if (language !== "en" && language !== "uk") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.assign(targetPath(language));
  }, true);

  updateLanguageLinks();

  if (typeof document$ !== "undefined") {
    document$.subscribe(updateLanguageLinks);
  }
})();
