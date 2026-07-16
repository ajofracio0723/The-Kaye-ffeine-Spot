import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createProduct, getCategories, getProducts, updateProduct } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Plus, Edit, ImagePlus, X, Trash2, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  category_id?: string;
  image_url?: string; // This will store base64 data
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("none");
  const [availability, setAvailability] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  const { format, currencySymbol } = useSettings();

  const getCategoryName = (categoryId?: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Uncategorized";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setProducts(getProducts());
      setCategories(getCategories());
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error loading data",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to keep image reasonable size
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB for original file)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      setProcessingImage(true);
      try {
        // Compress and convert to base64
        const compressedBase64 = await compressImage(file, 0.7);
        
        // Check if compressed image is still reasonable size (limit to ~1MB base64)
        if (compressedBase64.length > 1400000) { // ~1MB in base64
          // Try with lower quality
          const moreCompressed = await compressImage(file, 0.5);
          if (moreCompressed.length > 1400000) {
            toast({
              title: "Image too large after compression",
              description: "Please select a smaller image or reduce the image dimensions.",
              variant: "destructive",
            });
            setProcessingImage(false);
            return;
          }
          setImagePreview(moreCompressed);
        } else {
          setImagePreview(compressedBase64);
        }
        
        setSelectedImage(file);
        setRemoveExistingImage(false);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error processing image",
          description: "Failed to process the selected image.",
          variant: "destructive",
        });
      } finally {
        setProcessingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      // Validation
      const name = formData.get("name") as string;
      const price = parseFloat(formData.get("price") as string);
      
      if (!name || !name.trim()) {
        toast({
          title: "Missing name",
          description: "Please enter a product name.",
          variant: "destructive",
        });
        return;
      }
      if (Number.isNaN(price) || price < 0) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid price.",
          variant: "destructive",
        });
        return;
      }

      let finalImageUrl = editingProduct?.image_url || null;

      // Handle image removal
      if (removeExistingImage) {
        finalImageUrl = null;
      }

      // Handle new image (use the compressed base64 from imagePreview)
      if (selectedImage && imagePreview) {
        finalImageUrl = imagePreview;
      }

      const productData = {
        name: name,
        description: (formData.get("description") as string) || null,
        price: price,
        category_id: (formData.get("category_id") as string) || null,
        is_available: (formData.get("is_available") as string) === "true",
        image_url: finalImageUrl,
      };

      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
      } else {
        createProduct(productData);
      }

      toast({
        title: editingProduct ? "Product updated" : "Product created",
        description: `${productData.name} has been ${editingProduct ? "updated" : "added"} successfully!`,
      });

      loadData();
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      setSelectedImage(null);
      setImagePreview(null);
      setRemoveExistingImage(false);

    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeCurrentImage = () => {
    if (editingProduct?.image_url) {
      setRemoveExistingImage(true);
      setImagePreview(null);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setCategoryId(product.category_id ? product.category_id : "none");
    setAvailability(!!product.is_available);
    setSelectedImage(null);
    setImagePreview(product.image_url || null);
    setRemoveExistingImage(false);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setCategoryId("none");
    setAvailability(true);
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your menu items</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border p-0.5 bg-muted/40">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="h-8 px-2.5"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              className="h-8 px-2.5"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsDialogOpen(false)} />
          <div className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-sm text-muted-foreground">
                  {editingProduct ? "Update product information" : "Create a new menu item"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="space-y-3">
                  {imagePreview && !removeExistingImage && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeCurrentImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                      className="w-full"
                      disabled={processingImage}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {processingImage ? "Processing..." : (imagePreview && !removeExistingImage ? "Change Image" : "Choose Image")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 5MB. Images will be compressed and stored as base64. Supported formats: JPG, PNG, WebP, GIF
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ({currencySymbol})</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingProduct?.price || ""}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="category_id" value={categoryId === "none" ? "" : categoryId} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Availability</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={availability ? "default" : "outline"}
                    onClick={() => setAvailability(true)}
                    className="flex-1"
                  >
                    Available
                  </Button>
                  <Button
                    type="button"
                    variant={!availability ? "destructive" : "outline"}
                    onClick={() => setAvailability(false)}
                    className="flex-1"
                  >
                    Out of Stock
                  </Button>
                </div>
                <input type="hidden" name="is_available" value={availability ? "true" : "false"} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={processingImage} className="flex-1">
                  {processingImage ? "Processing..." : editingProduct ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <ImagePlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your first menu item</p>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : viewMode === "list" ? (
        <div className="rounded-lg border overflow-hidden">
          <div className="hidden sm:grid grid-cols-[72px_1fr_120px_100px_110px_90px] gap-3 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground">
            <span>Image</span>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[72px_1fr_auto] sm:grid-cols-[72px_1fr_120px_100px_110px_90px] gap-3 items-center px-4 py-3 hover:bg-muted/30"
              >
                <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {product.description || "No description"}
                  </p>
                  <p className="sm:hidden text-sm font-semibold text-primary mt-1">
                    {format(product.price)}
                  </p>
                </div>
                <span className="hidden sm:block text-sm text-muted-foreground truncate">
                  {getCategoryName(product.category_id)}
                </span>
                <span className="hidden sm:block font-semibold text-primary">
                  {format(product.price)}
                </span>
                <div className="hidden sm:flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.is_available ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-sm text-muted-foreground">
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {product.image_url ? (
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ImagePlus className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ImagePlus className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {product.description || "No description available"}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-bold text-lg text-primary">{format(product.price)}</span>
                  {!product.is_available && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-muted-foreground">
                    {product.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => openEditDialog(product)}
                  className="ml-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};

export default Products;