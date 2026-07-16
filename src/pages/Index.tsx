import { useState, useEffect } from "react";
import { ProductCard } from "@/components/pos/ProductCard";
import { CategoryTabs } from "@/components/pos/CategoryTabs";
import { Cart } from "@/components/pos/Cart";
import { CheckoutDialog } from "@/components/pos/CheckoutDialog";
import { getCategories, getProducts } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available: boolean;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory
    ? products.filter(product => product.category_id === activeCategory)
    : products;

  const addToCart = (product: Product) => {
    if (!product.is_available) {
      toast({
        title: "Unavailable",
        description: `${product.name} is not available`,
        variant: "destructive",
      });
      return;
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }];
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-3">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={() => setIsCheckoutOpen(true)}
            />
          </div>
        </div>
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
};

export default Index;