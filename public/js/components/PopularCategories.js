/**
 * CampusCart - Apple Store Category Navigation
 * Sleek, horizontal product family strip inspired by apple.com/store & apple.com/mac
 */

const PopularCategories = {
  render() {
    const el = document.getElementById('categories-mount');
    if (!el) return;

    el.innerHTML = `
      <section id="categories-section" class="apple-categories-section">
        <div class="apple-section-header">
          <span class="apple-section-kicker">CURATED CATEGORIES</span>
          <h2 class="apple-section-title">The Student Collection.</h2>
          <p class="apple-section-sub">Explore verified campus equipment, academic essentials, and railway exchanges.</p>
        </div>

        <div class="apple-categories-scroller">
          <div class="apple-categories-track">
            ${CATEGORIES.map(cat => {
              const isActive = state.activeCategory === cat.id;
              const iconFn = Icons[cat.icon] || Icons.tag;
              return `
                <button 
                  class="apple-cat-card ${isActive ? 'active' : ''}" 
                  onclick="PopularCategories.selectCategory('${cat.id}')"
                  title="${cat.desc}"
                >
                  <div class="apple-cat-icon-frame">
                    ${iconFn("w-6 h-6")}
                  </div>
                  <span class="apple-cat-name">${cat.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  },

  selectCategory(categoryId) {
    state.setActiveCategory(categoryId);
    this.render();
    Marketplace.loadProducts();
    const marketEl = document.getElementById('marketplace-section');
    if (marketEl) marketEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.PopularCategories = PopularCategories;
