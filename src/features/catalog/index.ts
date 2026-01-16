// Catalog Feature - Public API
export { useCatalogStore } from "./model/store";
export {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts,
} from "./api/get-products";
export {
  useProducts,
  useFeaturedProducts,
  useNewArrivals,
  useBestSellers,
} from "./hooks/use-products";
