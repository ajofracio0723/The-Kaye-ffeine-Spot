import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/hooks/useSettings";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    is_available: boolean;
    category_id?: string;
  };
  onAddToCart: (product: any) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { format } = useSettings();

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4 h-full flex flex-col">
        {product.image_url && (
          <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-muted">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm">{product.name}</h3>
              {!product.is_available && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{format(product.price)}</span>
          </div>

          <div className="flex items-center justify-end mt-2">
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={!product.is_available}
              className="text-xs px-3"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
