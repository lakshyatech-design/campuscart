/**
 * CampusCart - Master Rebuilt Popular Categories Section
 */
const PopularCategories = {
  render() {
    const el = document.getElementById('categories-mount');
    if (!el) return;

    el.innerHTML = `
      <section id="categories-section" class="container category-section-master">
        <div class="section-editorial-heading">
          <div>
            <div class="editorial-kicker-label">CURATED CAMPUS COMMERCE</div>
            <h2 class="editorial-title-large">Browse by Department & Life Need</h2>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="PopularCategories.selectCategory('All')">
            Reset to All Categories
          </button>
        </div>

        <div class="category-grid">
          ${CATEGORIES.map(cat => {
            const isActive = state.activeCategory === cat.id;
            const iconFn = Icons[cat.icon] || Icons.tag;
            return `
              <div 
                class="category-pill ${isActive ? 'active' : ''}" 
                onclick="PopularCategories.selectCategory('${cat.id}')"
                title="${cat.desc}"
              >
                <div class="cat-icon-wrap">
                  ${iconFn("w-5 h-5")}
                </div>
                <div class="cat-name">${cat.name}</div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  selectCategory(categoryId) {
    state.setActiveCategory(categoryId);
    this.render();
    Marketplace.loadProducts();
    const marketEl = document.getElementById('marketplace-section');
    if (marketEl) marketEl.scrollIntoView({ behavior: 'smooth' });
  }
};
