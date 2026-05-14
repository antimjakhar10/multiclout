function LearnCategoryTabs({
  categories = [],
  activeCategory,
  setActiveCategory,
}) {
  const normalizedCategories = categories
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          key: `${item}-${index}`,
          label: item,
          value: item,
        };
      }

      if (item && typeof item === "object") {
        const label = item.name || item.title || item.slug || `Category ${index + 1}`;
        const value = item.name || item.title || item.slug || label;

        return {
          key: `${item.slug || item.name || item.title || "category"}-${index}`,
          label,
          value,
        };
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="mb-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      {normalizedCategories.map((category) => {
        const active = activeCategory === category.value;

        return (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.value)}
            className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-medium transition ${
              active
                ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

export default LearnCategoryTabs;