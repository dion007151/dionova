"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, getImageUrl, parseProductImages } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineCube,
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineLink,
} from "react-icons/hi2";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  featured: boolean;
  active: boolean;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  comparePrice: "",
  stock: "0",
  featured: false,
  categoryId: "",
};

type ImageMode = "upload" | "url";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageUrls([]);
    setUrlInput("");
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setImageUrls(parseProductImages(product.images));
    setForm({
      name: product.name,
      description: "",
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      stock: product.stock.toString(),
      featured: product.featured,
      categoryId: product.category.id,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrls((prev) => [...prev, ...data.urls]);
      toast.success(`${data.urls.length} image(s) uploaded!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addUrlImage = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setImageUrls((prev) => [...prev, url]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill in name, price, and category");
      return;
    }

    setSaving(true);
    try {
      const finalImages = imageUrls.length > 0 ? imageUrls : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"];

      const body = {
        name: form.name,
        description: form.description || form.name,
        price: form.price,
        comparePrice: form.comparePrice || null,
        images: JSON.stringify(finalImages),
        stock: form.stock,
        featured: form.featured,
        categoryId: form.categoryId,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error("Failed to save");

      toast.success(editingId ? "Product updated!" : "Product created!");
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product deleted!");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setCreatingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create category");
      const newCat = await res.json();
      toast.success(`Category "${name}" created!`);
      setNewCategoryName("");
      // Add the new category to the list immediately and auto-select it
      setCategories((prev) => [...prev, { id: newCat.id, name: newCat.name, slug: newCat.slug }]);
      setForm((prev) => ({ ...prev, categoryId: newCat.id }));
    } catch (error) {
      console.error("Category create error:", error);
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const updateForm = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate" style={{ fontFamily: "var(--font-outfit)" }}>Products</h2>
          <p className="text-sm text-dark-400">{products.length} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex-shrink-0 text-sm">
          <HiOutlinePlus className="w-5 h-5" /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-dark-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 mx-auto mb-4 flex items-center justify-center">
              <HiOutlineCube className="w-7 h-7 text-dark-500" />
            </div>
            <p className="text-dark-400 mb-4">No products yet</p>
            <button onClick={openCreate} className="btn-primary">Create Your First Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Product</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Category</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Stock</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const parsedImgs = parseProductImages(product.images);
                  const img = parsedImgs[0] || "";
                  return (
                    <tr key={product.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                            <img src={getImageUrl(img)} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{product.name}</p>
                            <p className="text-xs text-dark-500 font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><span className="text-sm text-dark-300">{product.category.name}</span></td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-white">{formatCurrency(product.price)}</span>
                        {product.comparePrice && <span className="text-xs text-dark-500 line-through ml-2">{formatCurrency(product.comparePrice)}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-yellow-400" : "text-red-400"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {product.featured && <span className="badge bg-primary-500/20 text-primary-400 border-primary-500/30 text-[10px]">Featured</span>}
                          <span className={`badge text-[10px] ${product.active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                            {product.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-primary-400 transition-all">
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-all">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-2 sm:inset-x-4 top-[3%] sm:top-[5%] mx-auto max-w-lg glass-card p-4 sm:p-6 z-50 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  {editingId ? "Edit Product" : "Create Product"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-dark-400">
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="input-field" placeholder="Product Name" />
                </div>

                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Product description..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">Price (₱) *</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="input-field" placeholder="1499.00" />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">Compare Price (₱)</label>
                    <input type="number" step="0.01" value={form.comparePrice} onChange={(e) => updateForm("comparePrice", e.target.value)} className="input-field" placeholder="1999.00" />
                  </div>
                </div>

                {/* Image Section */}
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Product Images</label>

                  {/* Image Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${imageMode === "upload" ? "gradient-bg text-white" : "glass-light text-dark-300"}`}
                    >
                      <HiOutlineArrowUpTray className="w-4 h-4" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${imageMode === "url" ? "gradient-bg text-white" : "glass-light text-dark-300"}`}
                    >
                      <HiOutlineLink className="w-4 h-4" /> Paste URL
                    </button>
                  </div>

                  {/* Upload Mode */}
                  {imageMode === "upload" && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/30 transition-colors"
                    >
                      <HiOutlinePhoto className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                      <p className="text-sm text-dark-400">
                        {uploading ? "Uploading..." : "Click to upload images"}
                      </p>
                      <p className="text-xs text-dark-600 mt-1">JPG, PNG, WebP — Max 5MB each</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* URL Mode */}
                  {imageMode === "url" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrlImage())}
                        className="input-field flex-1"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button type="button" onClick={addUrlImage} className="btn-primary px-4">Add</button>
                    </div>
                  )}

                  {/* Image Previews */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-dark-800 group">
                          <img src={getImageUrl(url)} alt={`Image ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiOutlineXMark className="w-3.5 h-3.5" />
                          </button>
                          {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-primary-500 text-white px-1.5 py-0.5 rounded">Main</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">Stock *</label>
                    <input type="number" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} className="input-field" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-400 mb-1.5">Category *</label>
                    <select value={form.categoryId} onChange={(e) => updateForm("categoryId", e.target.value)} className="input-field">
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {/* Inline category creation */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateCategory())}
                        className="input-field flex-1 !py-2 !text-xs"
                        placeholder="New category name..."
                      />
                      <button
                        type="button"
                        disabled={creatingCategory || !newCategoryName.trim()}
                        onClick={handleCreateCategory}
                        className="btn-primary !px-3 !py-2 !text-xs disabled:opacity-50"
                      >
                        {creatingCategory ? "..." : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="w-4 h-4 rounded accent-primary-500" />
                  <span className="text-sm text-dark-300">Featured Product</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
