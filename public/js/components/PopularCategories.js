/**
 * CampusCart - Popular Categories Section
 */
const PopularCategories = {
  render() {
    const el = document.getElementById('categories-mount');
    if (!el) return;

    el.innerHTML = `
      <section id="categories-section" class="container" style="padding-top: 3.5rem; padding-bottom: 1.5rem;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Explore Categories</h2>
            <p class="section-subtitle">Everything students need, curated for campus life in India</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="PopularCategories.selectCategory('All')">
            Reset to All
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
