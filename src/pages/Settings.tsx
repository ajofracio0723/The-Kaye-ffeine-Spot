import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { CURRENCIES, formatMoney } from "@/lib/currency";
import { Settings as SettingsIcon, User, Shield, Bell, Store } from "lucide-react";

const Settings = () => {
  const { profile } = useAuth();
  const { settings, updateSettings, currencySymbol } = useSettings();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    dailyReports: false,
  });
  const [storeName, setStoreName] = useState(settings.store_name);
  const [address, setAddress] = useState(settings.address);
  const [taxRate, setTaxRate] = useState(String(settings.tax_rate));
  const [currency, setCurrency] = useState(settings.currency);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleStoreSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTax = parseFloat(taxRate);
    if (Number.isNaN(parsedTax) || parsedTax < 0) {
      toast({
        title: "Invalid tax rate",
        description: "Please enter a valid tax rate.",
        variant: "destructive",
      });
      return;
    }

    updateSettings({
      store_name: storeName.trim() || "The Kaye-ffeine Spot",
      address: address.trim(),
      tax_rate: parsedTax,
      currency,
    });

    toast({
      title: "Store settings saved",
      description: `Currency set to ${currency}. Prices will update across the app.`,
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Settings updated",
      description: `${key} notifications ${value ? "enabled" : "disabled"}.`,
    });
  };

  if (profile?.role !== "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
              <p className="text-muted-foreground">
                You need admin privileges to access system settings. Contact your manager for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    defaultValue={profile?.full_name || ""}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={profile?.phone || ""}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.role || ""} disabled className="capitalize" />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Settings
            </CardTitle>
            <CardDescription>
              Configure your coffee shop settings, including currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStoreSettingsSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="8.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.symbol} {option.code} — {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Preview: {formatMoney(150, currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter store address"
                />
              </div>
              <Button type="submit">Update Store Settings</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                checked={notifications.lowStock}
                onCheckedChange={(value) => handleNotificationChange("lowStock", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new orders are placed
                </p>
              </div>
              <Switch
                checked={notifications.newOrders}
                onCheckedChange={(value) => handleNotificationChange("newOrders", value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Daily Sales Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily sales summary via email
                </p>
              </div>
              <Switch
                checked={notifications.dailyReports}
                onCheckedChange={(value) => handleNotificationChange("dailyReports", value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              System details and version information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">System Version:</span>
                <span className="ml-2 text-muted-foreground">v2.1.0</span>
              </div>
              <div>
                <span className="font-medium">Currency:</span>
                <span className="ml-2 text-muted-foreground">
                  {settings.currency} ({currencySymbol})
                </span>
              </div>
              <div>
                <span className="font-medium">Storage:</span>
                <span className="ml-2 text-muted-foreground">Local Storage</span>
              </div>
              <div>
                <span className="font-medium">Data:</span>
                <span className="ml-2 text-muted-foreground">Saved in this browser</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
