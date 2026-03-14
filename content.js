(function () {
  const path = window.location.pathname;
  const lang = path.startsWith("/nl/") ? "nl" : "en";

  const href = "/" + lang + "/association/committee/BAC";
  const subtitle = "Mannen Dispuut de BAC";
  const description =
    lang === "nl" ? "Wie dit leest trekt bak." : "Who reads this chugs a beer.";

  const fallbackCard = document.createElement("div");
  fallbackCard.className = "card";
  fallbackCard.innerHTML =
    '<a href="' +
    href +
    '" class="stretched-link"></a>' +
    '<img class="card-image" src="/data/ae/fa424340c37f2c625320f5a0b325353abf0af0.jpg" alt="">' +
    '<div class="card-body">' +
    '<h5 class="card-title">BAC</h5>' +
    '<h6 class="card-subtitle text-muted">' +
    subtitle +
    "</h6>" +
    '<p class="card-text">' +
    description +
    "</p>" +
    "</div>" +
    '<div class="card-footer text-muted">' +
    "<hr>" +
    '<span class="fas fa-envelope"></span>' +
    '<span class="fas fa-globe"></span>' +
    "</div>";

  // Remove BAC from the committees page, as it is not a committee but a fraternity
  if (/^\/(nl|en)\/association\/committees(\/|$)/.test(path)) {
    const link = document.querySelector(
      'a.stretched-link[href="' + href + '"]',
    );
    if (link) {
      link.closest(".card").remove();
    }
  }

  // Puts the BAC on the fraternities page, as this is where it belongs
  if (/^\/(nl|en)\/association\/fraternities(\/|$)/.test(path)) {
    const cardGrid = document.querySelector(".card-grid");

    if (!cardGrid) return;

    // If the card is already present update it, else prepend new card
    const existing = cardGrid
      .querySelector('a.stretched-link[href="' + href + '"]')
      ?.closest(".card");

    const card = existing ?? fallbackCard;

    if (!existing) cardGrid.prepend(card);

    fetch("https://gewis.nl/" + lang + "/association/committees")
      .then((r) => r.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const bacCard = doc
          .querySelector('a.stretched-link[href="' + href + '"]')
          ?.closest(".card");
        if (!bacCard) throw new Error("BAC card not found in committees page");
        // Update the image and description from the live data
        const liveImg = bacCard.querySelector(".card-image");
        const liveText = bacCard.querySelector(".card-text");
        if (liveImg)
          card
            .querySelector(".card-image")
            .setAttribute("src", liveImg.getAttribute("src"));
        if (liveText)
          card.querySelector(".card-text").textContent =
            liveText.textContent.trim();
      })
      .catch(() => {
        // Fetch failed — the card already shown stays in place.
      });
  }
})();
