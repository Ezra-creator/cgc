'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Loader, ImagePlus, ToggleLeft, ToggleRight, Star, Package } from 'lucide-react'
import {
  getAllProducts, createProduct, updateProduct,
  deleteProduct, uploadProductImage,
} from '@/lib/supabase'
import { Product } from '@/types'
import { CATEGORIES, SIZES, generateSlug, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const GENDERS = [
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'kids', label: 'Kids' },
  { value: 'unisex', label: 'Unisex' },
]

const empty = {
  name: '', description: '', price: '',
  category: 'mens', gender: 'mens',
  sizes: [] as string[], colors: [] as string[],
  images: [] as string[], in_stock: true, featured: false,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(empty)
  const [colorInput, setColorInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllProducts()
      setProducts(data || [])
    } catch { toast.error('Could not load products') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const openAdd = () => {
    setEditing(null)
    setForm(empty)
    setColorInput('')
    setPanelOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, description: p.description || '',
      price: String(p.price), category: p.category,
      gender: p.gender, sizes: [...p.sizes],
      colors: [...p.colors], images: [...p.images],
      in_stock: p.in_stock, featured: p.featured,
    })
    setColorInput('')
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditing(null)
    setForm(empty)
    setColorInput('')
  }

  const handleFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(Math.round((i / files.length) * 100))
      try {
        const url = await uploadProductImage(files[i])
        urls.push(url)
      } catch { toast.error(`Failed to upload ${files[i].name}`) }
    }
    setForm(f => ({ ...f, images: [...f.images, ...urls] }))
    setUploading(false)
    setUploadProgress(0)
    if (urls.length) toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    handleFiles(files)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Product name is required')
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return toast.error('Enter a valid price')

    setSaving(true)
    try {
      const data = {
        name: form.name.trim(),
        slug: generateSlug(form.name.trim()),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category as Product['category'],
        gender: form.gender as Product['gender'],
        sizes: form.sizes,
        colors: form.colors,
        images: form.images,
        in_stock: form.in_stock,
        featured: form.featured,
      }

      if (editing) {
        await updateProduct(editing.id, data)
        toast.success('Product updated!')
      } else {
        await createProduct(data)
        toast.success('Product added!')
      }
      closePanel()
      fetch()
    } catch { toast.error('Could not save product') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setDeleteConfirm(null)
      fetch()
    } catch { toast.error('Could not delete product') }
  }

  const toggleSize = (s: string) =>
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }))

  const addColor = () => {
    const c = colorInput.trim()
    if (c && !form.colors.includes(c)) setForm(f => ({ ...f, colors: [...f.colors, c] }))
    setColorInput('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-cgc-ink">Products</h2>
          <p className="text-sm text-cgc-slate mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary text-sm flex items-center gap-2">
          <Plus size={15} /> Add product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-cgc-hairline rounded-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-14 rounded" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <Package size={40} className="text-cgc-slate mx-auto mb-4" />
            <p className="font-semibold text-cgc-ink mb-2">No products yet</p>
            <p className="text-sm text-cgc-slate mb-6">Add your first product to get started.</p>
            <button onClick={openAdd} className="btn btn-primary text-sm">Add first product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cgc-hairline">
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-cgc-slate uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-cgc-hairline last:border-0 hover:bg-cgc-bone/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cgc-bone border border-cgc-hairline overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImagePlus size={14} className="text-cgc-slate" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-cgc-ink truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-cgc-slate">{p.sizes.slice(0, 4).join(' · ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-cgc-slate capitalize">
                        {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-cgc-red">{formatPrice(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-pill border ${
                        p.in_stock
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-cgc-red border-red-200'
                      }`}>
                        {p.in_stock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {p.featured && (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <Star size={12} className="fill-amber-400 text-amber-400" /> Featured
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          aria-label="Edit product"
                          className="w-8 h-8 flex items-center justify-center rounded-full text-cgc-slate hover:text-cgc-ink hover:bg-cgc-bone transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          aria-label="Delete product"
                          className="w-8 h-8 flex items-center justify-center rounded-full text-cgc-slate hover:text-cgc-red hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-cgc-ink/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-card p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-cgc-ink mb-2">Delete product?</h3>
            <p className="text-sm text-cgc-slate mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-outline flex-1 text-sm">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn bg-cgc-red text-white flex-1 text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-cgc-ink/40" onClick={closePanel} />
          {/* Panel */}
          <div className="w-full max-w-lg bg-white flex flex-col h-full shadow-2xl overflow-hidden animate-slide-left">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cgc-hairline flex-shrink-0">
              <h2 className="font-bold text-cgc-ink">
                {editing ? 'Edit product' : 'Add new product'}
              </h2>
              <button onClick={closePanel} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cgc-bone text-cgc-slate hover:text-cgc-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-2 uppercase tracking-wide">
                  Product images
                </label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-card p-6 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-cgc-red bg-red-50' : 'border-cgc-hairline hover:border-cgc-ink'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => e.target.files && handleFiles(Array.from(e.target.files))}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader size={20} className="text-cgc-red animate-spin" />
                      <p className="text-sm text-cgc-slate">Uploading... {uploadProgress}%</p>
                      <div className="w-full h-1.5 bg-cgc-hairline rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cgc-red transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={20} className="text-cgc-slate" />
                      <p className="text-sm text-cgc-slate">
                        <span className="text-cgc-ink font-semibold">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-cgc-slate">PNG, JPG, WEBP up to 10MB each</p>
                    </div>
                  )}
                </div>

                {/* Image previews */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-cgc-hairline" />
                        <button
                          onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cgc-red text-white rounded-full flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                  Product name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. CGC Eagle Hoodie"
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the product..."
                  className="textarea"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                  Price (CAD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cgc-slate font-mono text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="input pl-7"
                  />
                </div>
              </div>

              {/* Category + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="input"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cgc-ink mb-1.5 uppercase tracking-wide">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                    className="input"
                  >
                    {GENDERS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-2 uppercase tracking-wide">
                  Available sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-btn border text-xs font-semibold transition-all ${
                        form.sizes.includes(s)
                          ? 'bg-cgc-ink text-white border-cgc-ink'
                          : 'bg-white text-cgc-ink border-cgc-hairline hover:border-cgc-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-semibold text-cgc-ink mb-2 uppercase tracking-wide">
                  Colors
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={e => setColorInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor() } }}
                    placeholder="e.g. Black, Red, White..."
                    className="input flex-1"
                  />
                  <button type="button" onClick={addColor} className="btn btn-outline text-sm px-4 flex-shrink-0">
                    Add
                  </button>
                </div>
                {form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.colors.map(c => (
                      <span key={c} className="flex items-center gap-1.5 bg-cgc-bone border border-cgc-hairline rounded-pill px-3 py-1 text-xs text-cgc-ink">
                        {c}
                        <button
                          onClick={() => setForm(f => ({ ...f, colors: f.colors.filter(x => x !== c) }))}
                          className="text-cgc-slate hover:text-cgc-red transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-cgc-hairline">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-cgc-ink">In stock</p>
                    <p className="text-xs text-cgc-slate">Customers can add this to their bag</p>
                  </div>
                  {form.in_stock
                    ? <ToggleRight size={28} className="text-green-500" />
                    : <ToggleLeft size={28} className="text-cgc-slate" />
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-cgc-ink">Featured product</p>
                    <p className="text-xs text-cgc-slate">Show on homepage new arrivals section</p>
                  </div>
                  {form.featured
                    ? <ToggleRight size={28} className="text-amber-500" />
                    : <ToggleLeft size={28} className="text-cgc-slate" />
                  }
                </button>
              </div>
            </div>

            {/* Panel footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-cgc-hairline flex-shrink-0">
              <button onClick={closePanel} className="btn btn-outline flex-1 text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="btn btn-primary flex-1 text-sm justify-center"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader size={14} className="animate-spin" />
                    Saving...
                  </span>
                ) : editing ? 'Update product' : 'Add product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
