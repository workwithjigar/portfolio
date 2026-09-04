const searchInput = document.getElementById('case-search');
const filterPills = document.querySelectorAll('.filter-pill');
const cards = document.querySelectorAll('#case-studies-grid .project-card');
const emptyState = document.getElementById('case-studies-empty');

if (searchInput && cards.length) {
  let activeIndustry = 'all';

  const cardData = Array.from(cards).map((card) => ({
    el: card,
    industry: card.dataset.industry || '',
    text: card.textContent.toLowerCase(),
  }));

  const applyFilters = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cardData.forEach(({ el, industry, text }) => {
      const matchesIndustry = activeIndustry === 'all' || industry === activeIndustry;
      const matchesQuery = !query || text.includes(query);
      const visible = matchesIndustry && matchesQuery;
      el.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  let debounceId;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(applyFilters, 120);
  });

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      activeIndustry = pill.dataset.industry;
      filterPills.forEach((p) => p.classList.toggle('is-active', p === pill));
      applyFilters();
    });
  });
}
