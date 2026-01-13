import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Star, SlidersHorizontal, Loader2, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApiProducts } from "@/hooks/useApiProducts";
import { encodeProductId } from "@/lib/productHash";

// Lista de modelos de iPhone
const IPHONE_MODELS = [
  "IPHONE 6", "IPHONE 6 PLUS", "IPHONE 6S", "IPHONE 6S PLUS",
  "IPHONE 7", "IPHONE 7 PLUS", "IPHONE 8", "IPHONE 8 PLUS",
  "IPHONE X", "IPHONE XR", "IPHONE XS", "IPHONE XS MAX",
  "IPHONE 11", "IPHONE 11 PRO", "IPHONE 11 PRO MAX",
  "IPHONE 12", "IPHONE 12 MINI", "IPHONE 12 PRO", "IPHONE 12 PRO MAX",
  "IPHONE 13", "IPHONE 13 MINI", "IPHONE 13 PRO", "IPHONE 13 PRO MAX",
  "IPHONE 14", "IPHONE 14 PLUS", "IPHONE 14 PRO", "IPHONE 14 PRO MAX",
  "IPHONE 15", "IPHONE 15 PLUS", "IPHONE 15 PRO", "IPHONE 15 PRO MAX",
  "IPHONE 16", "IPHONE 16 PLUS", "IPHONE 16 PRO", "IPHONE 16 PRO MAX",
  "IPHONE SE 2020", "IPHONE SE 2022", "OUTROS"
];

// Lista de condições
const CONDITIONS = [
  "Novo",
  "Usado - Excelente",
  "Usado - Bom",
  "Recondicionado",
  "Com defeito"
];

// Lista de capacidades
const CAPACITIES = [
  "512MB", "1GB", "2GB", "4GB", "8GB", "16GB", "32GB",
  "64GB", "128GB", "256GB", "512GB", "1TB"
];

// Lista de cores com códigos hex
const COLORS: { name: string; code: string }[] = [
  { name: "Amarelo", code: "#FFD700" },
  { name: "Azul", code: "#007AFF" },
  { name: "Branco", code: "#FFFFFF" },
  { name: "Bronze", code: "#CD7F32" },
  { name: "Cinza", code: "#808080" },
  { name: "Dourado", code: "#FFD700" },
  { name: "Laranja", code: "#FF9500" },
  { name: "Prata", code: "#C0C0C0" },
  { name: "Preto", code: "#1C1C1E" },
  { name: "Rosa", code: "#FF2D55" },
  { name: "Roxo", code: "#AF52DE" },
  { name: "Verde", code: "#34C759" },
  { name: "Vermelho", code: "#FF3B30" },
  { name: "Outros", code: "#A0A0A0" }
];

// Faixas de preço
const PRICE_RANGES = [
  { label: "Até R$ 1.500", min: 0, max: 1500 },
  { label: "R$ 1.500 - R$ 3.000", min: 1500, max: 3000 },
  { label: "R$ 3.000 - R$ 5.000", min: 3000, max: 5000 },
  { label: "Acima de R$ 5.000", min: 5000, max: Infinity }
];

interface FilterState {
  models: string[];
  conditions: string[];
  capacities: string[];
  colors: string[];
  priceRanges: number[];
}

interface FilterContentProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterContent = ({ filters, setFilters }: FilterContentProps) => {
  const [modelSearch, setModelSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    model: false,
    condition: true,
    price: true,
    capacity: true,
    color: true
  });

  const filteredModels = IPHONE_MODELS.filter(m =>
    m.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (type: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      const current = prev[type] as (string | number)[];
      const exists = current.includes(value);
      return {
        ...prev,
        [type]: exists
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  return (
    <div className="space-y-4">
      {/* Modelo */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('model')}
          className="flex items-center justify-between w-full text-left font-medium text-sm mb-2"
        >
          Modelo
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.model ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.model && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Buscar Modelo"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredModels.map((model) => (
                <label key={model} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-secondary/50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.models.includes(model)}
                    onChange={() => toggleFilter('models', model)}
                    className="rounded border-border"
                  />
                  <span className="text-foreground">{model}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Condição */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('condition')}
          className="flex items-center justify-between w-full text-left font-medium text-sm mb-2"
        >
          Condição
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.condition ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.condition && (
          <div className="space-y-1">
            {CONDITIONS.map((cond) => (
              <label key={cond} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-secondary/50 px-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(cond)}
                  onChange={() => toggleFilter('conditions', cond)}
                  className="rounded border-border"
                />
                <span className="text-foreground">{cond}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-sm mb-2"
        >
          Preço
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.price && (
          <div className="space-y-1">
            {PRICE_RANGES.map((range, idx) => (
              <label key={range.label} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-secondary/50 px-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(idx)}
                  onChange={() => toggleFilter('priceRanges', idx)}
                  className="rounded border-border"
                />
                <span className="text-foreground">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Capacidade */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('capacity')}
          className="flex items-center justify-between w-full text-left font-medium text-sm mb-2"
        >
          Capacidade
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.capacity ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.capacity && (
          <div className="space-y-1">
            {CAPACITIES.map((cap) => (
              <label key={cap} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-secondary/50 px-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.capacities.includes(cap)}
                  onChange={() => toggleFilter('capacities', cap)}
                  className="rounded border-border"
                />
                <span className="text-foreground">{cap}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Cor */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left font-medium text-sm mb-2"
        >
          Cor
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`} />
        </button>
        {expandedSections.color && (
          <div className="space-y-1">
            {COLORS.map((color) => (
              <label key={color.name} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-secondary/50 px-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color.name)}
                  onChange={() => toggleFilter('colors', color.name)}
                  className="rounded border-border"
                />
                <span
                  className="w-4 h-4 rounded border border-border flex-shrink-0"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-foreground">{color.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Busca = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    models: [],
    conditions: [],
    capacities: [],
    colors: [],
    priceRanges: []
  });
  
  const { products, isLoading, error } = useApiProducts();

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      models: [],
      conditions: [],
      capacities: [],
      colors: [],
      priceRanges: []
    });
  };

  // Filtrar produtos baseado na busca, categoria e filtros
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      // Filtro por categoria (usando slug)
      if (categoria) {
        const categoryMatch = 
          product.categorySlug?.toLowerCase() === categoria.toLowerCase() ||
          product.category?.toLowerCase() === categoria.toLowerCase();
        if (!categoryMatch) return false;
      }
      
      // Filtro por termo de busca
      if (query) {
        const searchLower = query.toLowerCase();
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const descMatch = product.description?.toLowerCase().includes(searchLower);
        const categoryNameMatch = product.category?.toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch && !categoryNameMatch) return false;
      }

      // Filtro por modelo
      if (filters.models.length > 0) {
        const productNameUpper = product.name?.toUpperCase() || '';
        const modelMatch = filters.models.some(model => 
          productNameUpper.includes(model) || 
          productNameUpper.includes(model.replace('IPHONE ', ''))
        );
        if (!modelMatch) return false;
      }

      // Filtro por condição
      if (filters.conditions.length > 0) {
        const conditionMatch = filters.conditions.some(cond => {
          const productCondition = (product.condition || '').toLowerCase();
          const filterCondition = cond.toLowerCase();
          return productCondition.includes(filterCondition) || 
                 filterCondition.includes(productCondition);
        });
        if (!conditionMatch) return false;
      }

      // Filtro por capacidade
      if (filters.capacities.length > 0) {
        const productName = (product.name || '').toUpperCase();
        const productCapacity = (product.capacity || '').toUpperCase();
        const capacityMatch = filters.capacities.some(cap => 
          productName.includes(cap.toUpperCase()) || 
          productCapacity.includes(cap.toUpperCase())
        );
        if (!capacityMatch) return false;
      }

      // Filtro por cor
      if (filters.colors.length > 0) {
        const productColor = (product.color || '').toLowerCase();
        const productName = (product.name || '').toLowerCase();
        const colorMatch = filters.colors.some(color => 
          productColor.includes(color.toLowerCase()) || 
          productName.includes(color.toLowerCase())
        );
        if (!colorMatch) return false;
      }

      // Filtro por faixa de preço
      if (filters.priceRanges.length > 0) {
        const price = product.price || 0;
        const priceMatch = filters.priceRanges.some(idx => {
          const range = PRICE_RANGES[idx];
          return price >= range.min && price < range.max;
        });
        if (!priceMatch) return false;
      }
      
      return true;
    });
  }, [products, query, categoria, filters]);

  const searchLabel = categoria || query || "Todos os produtos";

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb - Hidden on mobile */}
      <div className="bg-secondary py-2 md:py-3 hidden sm:block">
        <div className="container">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">{categoria ? categoria : `Busca: "${query}"`}</span>
          </nav>
        </div>
      </div>

      <main className="container py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtros</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-foreground hover:underline">
                    Limpar
                  </button>
                )}
              </div>
              <FilterContent filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold truncate">{searchLabel}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {isLoading ? "Carregando..." : `${filteredProducts.length} produtos`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 overflow-y-auto max-h-[70vh]">
                      <FilterContent filters={filters} setFilters={setFilters} />
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex gap-2">
                      {hasActiveFilters && (
                        <Button variant="outline" className="flex-1" onClick={clearFilters}>
                          Limpar
                        </Button>
                      )}
                      <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                        Aplicar
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <select className="px-2 md:px-4 py-2 border border-border rounded-lg bg-background text-xs md:text-sm">
                  <option>Relevância</option>
                  <option>Menor preço</option>
                  <option>Maior preço</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <p className="text-destructive">Erro ao carregar produtos</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nenhum produto encontrado para "{searchLabel}"</p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produto/${product.slug || encodeProductId(product.id)}`}
                    className="bg-card rounded-lg p-3 md:p-4 border border-border hover:shadow-lg transition-shadow group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square rounded-lg mb-2 md:mb-4 overflow-hidden bg-secondary">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      {product.discountPercent > 0 && (
                        <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-primary text-primary-foreground text-[10px] md:text-xs font-medium rounded">
                          -{product.discountPercent}%
                        </span>
                      )}
                      <span className="text-[10px] md:text-xs text-muted-foreground truncate">
                        {product.condition}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-xs md:text-sm font-medium text-foreground line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] mb-1 md:mb-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mb-1 md:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < (product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="space-y-0.5">
                      {product.originalPrice > product.price && (
                        <p className="text-muted-foreground line-through text-[10px] md:text-sm">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                      <p className="text-base md:text-xl font-bold text-foreground">
                        {formatPrice(product.price)}
                      </p>
                      {product.installments > 1 && (
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {product.installments}x de {formatPrice(product.price / product.installments)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Busca;
