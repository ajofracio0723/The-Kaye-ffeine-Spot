import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const { format, taxRate } = useSettings();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * (taxRate / 100);
  const grandTotal = total + tax;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Current Order
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <div className="flex-1 space-y-2 mb-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No items in cart
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{format(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span>{format(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{format(grandTotal)}</span>
              </div>
            </div>

            <Button onClick={onCheckout} className="w-full mt-4" size="lg">
              Checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
