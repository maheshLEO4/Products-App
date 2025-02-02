import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  
  setProducts: (products) => set({ products }),
  
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      // Check if the request was successful
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Failed to create product." };
      }

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, message: "Network error occurred." };
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");

      // Check if the request was successful
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Failed to fetch products." };
      }

      const data = await res.json();
      if (data.data && data.data.length) {
        set({ products: data.data });
      } else {
        set({ products: [] });
      }

      return { success: true };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, message: "Network error occurred." };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (!data.success) return { success: false, message: data.message };

      // Update the UI immediately, without needing a refresh
      set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Network error occurred." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      // Update the UI immediately, without needing a refresh
      set((state) => ({
        products: state.products.map((product) => (product._id === pid ? data.data : product)),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: "Network error occurred." };
    }
  },
}));
