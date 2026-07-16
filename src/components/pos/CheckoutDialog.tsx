import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { createOrder } from "@/lib/storage";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export const CheckoutDialog = ({ isOpen, onClose, items, onOrderComplete }: CheckoutDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { format, taxRate } = useSettings();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Customer name required",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = `ORD-${Date.now()}`;

      createOrder(
        {
          order_number: orderNumber,
          customer_name: customerName,
          customer_id: null,
          served_by: null,
          subtotal,
          tax,
          total,
          payment_method: paymentMethod,
          status: "completed",
        },
        items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }))
      );

      toast({
        title: "Order completed!",
        description: `Order ${orderNumber} has been processed successfully.`,
      });

      onOrderComplete();
      onClose();
      setCustomerName("");
      setPaymentMethod("cash");
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Order failed",
        description: "There was an error processing the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>{format(tax)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{format(total)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};