import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createCustomer, getCustomers, updateCustomer } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Plus, Edit, Users, Phone, Mail, MapPin, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { format } = useSettings();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    try {
      setCustomers(getCustomers());
    } catch (error) {
      console.error("Error loading customers:", error);
      toast({
        title: "Error loading customers",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const customerData = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
    };

    try {
      if (editingCustomer) {
        updateCustomer(editingCustomer.id, customerData);
      } else {
        createCustomer(customerData);
      }

      toast({
        title: editingCustomer ? "Customer updated" : "Customer created",
        description: `${customerData.name} has been ${editingCustomer ? "updated" : "added"}.`,
      });

      loadCustomers();
      setIsDialogOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error saving customer",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 500) return { name: "VIP", variant: "default" as const };
    if (totalSpent >= 200) return { name: "Gold", variant: "secondary" as const };
    if (totalSpent >= 50) return { name: "Silver", variant: "outline" as const };
    return { name: "Bronze", variant: "outline" as const };
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information and loyalty</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? "Update customer information" : "Create a new customer profile"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCustomer?.name || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingCustomer?.email || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingCustomer?.phone || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={editingCustomer?.address || ""}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCustomer ? "Update" : "Create"} Customer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No customers found</p>
            </CardContent>
          </Card>
        ) : (
          customers.map((customer) => {
            const tier = getCustomerTier(customer.total_spent);
            return (
              <Card key={customer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>
                        Member since {new Date(customer.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={tier.variant} className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {tier.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-2">{customer.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold">{customer.total_orders}</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{format(customer.total_spent, 0)}</div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{customer.loyalty_points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openEditDialog(customer)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Customers;