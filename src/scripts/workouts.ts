document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(
    ".card-item"
  ) as NodeListOf<HTMLElement>;
  const searchInput = document.getElementById(
    "cards-search-input"
  ) as HTMLInputElement;

  if (!searchInput) {
    console.error("Search input not found");
    return;
  }

  const filterCards = (searchTerm: string): void => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    console.log("Filtering cards with search term:", normalizedSearchTerm);

    cards.forEach((card) => {
      const cardTitleElement = card.querySelector(
        ".card-title"
      ) as HTMLElement | null;
      const cardTitle =
        cardTitleElement?.textContent?.trim().toLowerCase() || "";

      console.log("Card title:", cardTitle);
      console.log(
        "Card title includes search term:",
        cardTitle.includes(normalizedSearchTerm)
      );

      // If searchTerm is empty, or the card title includes the searchTerm, show the card
      card.style.display =
        normalizedSearchTerm === "" || cardTitle.includes(normalizedSearchTerm)
          ? ""
          : "none";
    });
  };

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    filterCards(searchTerm);
  });

  // Initial display: show all cards
  filterCards("");
});
