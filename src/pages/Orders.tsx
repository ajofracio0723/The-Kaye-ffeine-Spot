import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getOrderById, getOrderItems, getOrders, updateOrderStatus as saveOrderStatus } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Eye, Clock, CheckCircle, XCircle, User, Calendar, DollarSign, Hash } from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string; // We'll get this from products table
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
  customer_id?: string;
  served_by?: string;
  notes?: string;
  payment_method?: string;
  items?: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toast } = useToast();
  const { format } = useSettings();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      setOrders(getOrders().map((order) => ({
        ...order,
        customer_name: order.customer_name || "Guest",
      })));
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error loading orders",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = (orderId: string) => {
    setLoadingDetails(true);
    try {
      const orderData = getOrderById(orderId);
      if (!orderData) throw new Error("Order not found");

      const itemsWithNames = getOrderItems(orderId);

      setSelectedOrder({
        ...orderData,
        customer_name: orderData.customer_name || "Guest",
        items: itemsWithNames,
      });
    } catch (error) {
      console.error("Error loading order details:", error);
      toast({
        title: "Error loading order details",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      saveOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error updating order",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
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
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.order_number}</CardTitle>
                    <CardDescription>
                      {order.customer_name} • {new Date(order.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                    <span className="font-bold">{format(order.total)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                      >
                        Complete Order
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => loadOrderDetails(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                          View complete information for order {order.order_number}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {loadingDetails ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : selectedOrder ? (
                        <div className="space-y-6">
                          {/* Order Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Order Number</span>
                              </div>
                              <p className="font-medium">{selectedOrder.order_number}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Customer</span>
                              </div>
                              <p className="font-medium">{selectedOrder.customer_name}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Date & Time</span>
                              </div>
                              <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusVariant(selectedOrder.status)} className="flex items-center gap-1 w-fit">
                                  {getStatusIcon(selectedOrder.status)}
                                  {selectedOrder.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {selectedOrder.served_by && (
                            <div className="space-y-2">
                              <span className="text-sm text-muted-foreground">Served by</span>
                              <p className="font-medium">{selectedOrder.served_by}</p>
                            </div>
                          )}

                          {selectedOrder.payment_method && (
                            <div className="space-y-2">
                              <span className="text-sm text-muted-foreground">Payment Method</span>
                              <p className="font-medium">{selectedOrder.payment_method}</p>
                            </div>
                          )}

                          {selectedOrder.notes && (
                            <div className="space-y-2">
                              <span className="text-sm text-muted-foreground">Notes</span>
                              <p className="font-medium">{selectedOrder.notes}</p>
                            </div>
                          )}

                          <Separator />

                          {/* Order Items */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">Order Items</h3>
                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                              <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex-1">
                                      <p className="font-medium">{item.product_name || `Product ID: ${item.product_id}`}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.quantity} x {format(item.unit_price)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{format(item.total_price)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No items found for this order</p>
                            )}
                          </div>

                          <Separator />

                          {/* Total */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">Total Amount</span>
                            </div>
                            <span className="text-xl font-bold">{format(selectedOrder.total)}</span>
                          </div>

                          {/* Action Buttons */}
                          {selectedOrder.status === 'pending' && (
                            <div className="flex gap-2 pt-4">
                              <Button 
                                onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                                className="flex-1"
                              >
                                Complete Order
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                                className="flex-1"
                              >
                                Cancel Order
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Order details not found</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;