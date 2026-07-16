import type {
  AppData,
  Category,
  Customer,
  LocalUser,
  Order,
  OrderItem,
  Product,
  Profile,
  StoreSettings,
} from "./types";

const STORAGE_KEY = "kaye-ffeine-data";
const SESSION_KEY = "kaye-ffeine-session";

const now = () => new Date().toISOString();

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const seedCategories = (): Category[] => {
  const timestamp = now();
  return [
    { id: "cat-coffee", name: "Coffee", icon: "☕", created_at: timestamp, updated_at: timestamp },
    { id: "cat-iced-coffee", name: "Iced Coffee", icon: "🧊", created_at: timestamp, updated_at: timestamp },
    { id: "cat-drinks", name: "Drinks", icon: "🥤", created_at: timestamp, updated_at: timestamp },
    { id: "cat-tea", name: "Tea", icon: "🍵", created_at: timestamp, updated_at: timestamp },
    { id: "cat-pasta", name: "Pasta", icon: "🍝", created_at: timestamp, updated_at: timestamp },
    { id: "cat-cakes", name: "Cakes", icon: "🍰", created_at: timestamp, updated_at: timestamp },
    { id: "cat-pastries", name: "Pastries", icon: "🥐", created_at: timestamp, updated_at: timestamp },
    { id: "cat-snacks", name: "Snacks", icon: "🍪", created_at: timestamp, updated_at: timestamp },
  ];
};

const SEED_IMAGES: Record<string, string> = {
  "prod-americano": "/products/americano.jpg",
  "prod-latte": "/products/latte.jpg",
  "prod-cappuccino": "/products/cappuccino.jpg",
  "prod-matcha": "/products/matcha-latte.jpg",
  "prod-iced-coffee": "/products/iced-coffee.jpg",
  "prod-iced-caramel": "/products/iced-caramel.jpg",
  "prod-iced-americano": "/products/iced-americano.jpg",
  "prod-iced-matcha": "/products/iced-matcha.jpg",
  "prod-iced-choco": "/products/iced-choco.jpg",
  "prod-lemonade": "/products/lemonade.jpg",
  "prod-smoothie": "/products/smoothie.jpg",
  "prod-mango-juice": "/products/mango-juice.jpg",
  "prod-iced-tea": "/products/iced-tea.jpg",
  "prod-cheesecake": "/products/cheesecake.jpg",
  "prod-blueberry-cake": "/products/blueberry-cake.jpg",
  "prod-chocolate-cake": "/products/chocolate-cake.jpg",
  "prod-croissant": "/products/croissant.jpg",
  "prod-cinnamon-roll": "/products/cinnamon-roll.jpg",
  "prod-muffin": "/products/muffin.jpg",
  "prod-doughnut": "/products/doughnut.jpg",
  "prod-cookie": "/products/cookie.jpg",
  "prod-brownie": "/products/brownie.jpg",
  "prod-chips": "/products/chips.jpg",
  "prod-fries": "/products/fries.jpg",
  "prod-sandwich": "/products/sandwich.jpg",
  "prod-pretzel": "/products/pretzel.jpg",
  "prod-carbonara": "/products/carbonara.jpg",
  "prod-spaghetti": "/products/spaghetti.jpg",
  "prod-alfredo": "/products/alfredo.jpg",
  "prod-lasagna": "/products/lasagna.jpg",
};

const seedProducts = (): Product[] => {
  const timestamp = now();
  return [
    {
      id: "prod-americano",
      name: "Americano",
      description: "Rich espresso with hot water",
      price: 120,
      category_id: "cat-coffee",
      image_url: SEED_IMAGES["prod-americano"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-latte",
      name: "Cafe Latte",
      description: "Espresso with steamed milk",
      price: 150,
      category_id: "cat-coffee",
      image_url: SEED_IMAGES["prod-latte"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-cappuccino",
      name: "Cappuccino",
      description: "Espresso with foamed milk",
      price: 145,
      category_id: "cat-coffee",
      image_url: SEED_IMAGES["prod-cappuccino"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-coffee",
      name: "Iced Coffee",
      description: "Chilled brewed coffee over ice",
      price: 130,
      category_id: "cat-iced-coffee",
      image_url: SEED_IMAGES["prod-iced-coffee"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-caramel",
      name: "Iced Caramel Latte",
      description: "Espresso, milk, ice, and caramel drizzle",
      price: 165,
      category_id: "cat-iced-coffee",
      image_url: SEED_IMAGES["prod-iced-caramel"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-americano",
      name: "Iced Americano",
      description: "Espresso and water poured over ice",
      price: 125,
      category_id: "cat-iced-coffee",
      image_url: SEED_IMAGES["prod-iced-americano"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-matcha",
      name: "Iced Matcha Latte",
      description: "Chilled matcha with milk over ice",
      price: 170,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-iced-matcha"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-matcha",
      name: "Matcha Latte",
      description: "Ceremonial matcha with milk",
      price: 160,
      category_id: "cat-tea",
      image_url: SEED_IMAGES["prod-matcha"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-choco",
      name: "Iced Chocolate",
      description: "Rich chocolate milk over ice with cream",
      price: 140,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-iced-choco"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-lemonade",
      name: "Fresh Lemonade",
      description: "House-made lemonade with ice",
      price: 110,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-lemonade"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-smoothie",
      name: "Strawberry Smoothie",
      description: "Blended strawberries with yogurt",
      price: 155,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-smoothie"],
      is_available: true,
      stock_quantity: 80,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-mango-juice",
      name: "Mango Juice",
      description: "Fresh mango juice served over ice",
      price: 120,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-mango-juice"],
      is_available: true,
      stock_quantity: 80,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-iced-tea",
      name: "Iced Tea",
      description: "Chilled house tea with lemon",
      price: 95,
      category_id: "cat-drinks",
      image_url: SEED_IMAGES["prod-iced-tea"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-carbonara",
      name: "Carbonara",
      description: "Creamy pasta with pancetta, egg, and parmesan",
      price: 220,
      category_id: "cat-pasta",
      image_url: SEED_IMAGES["prod-carbonara"],
      is_available: true,
      stock_quantity: 50,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-spaghetti",
      name: "Spaghetti",
      description: "Classic spaghetti with rich tomato marinara",
      price: 180,
      category_id: "cat-pasta",
      image_url: SEED_IMAGES["prod-spaghetti"],
      is_available: true,
      stock_quantity: 50,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-alfredo",
      name: "Fettuccine Alfredo",
      description: "Fettuccine in creamy alfredo sauce",
      price: 210,
      category_id: "cat-pasta",
      image_url: SEED_IMAGES["prod-alfredo"],
      is_available: true,
      stock_quantity: 50,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-lasagna",
      name: "Lasagna",
      description: "Layered pasta baked with meat sauce and cheese",
      price: 250,
      category_id: "cat-pasta",
      image_url: SEED_IMAGES["prod-lasagna"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-cheesecake",
      name: "Cheesecake",
      description: "Creamy New York–style cheesecake",
      price: 145,
      category_id: "cat-cakes",
      image_url: SEED_IMAGES["prod-cheesecake"],
      is_available: true,
      stock_quantity: 30,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-blueberry-cake",
      name: "Blueberry Cake",
      description: "Soft cake topped with blueberry glaze",
      price: 135,
      category_id: "cat-cakes",
      image_url: SEED_IMAGES["prod-blueberry-cake"],
      is_available: true,
      stock_quantity: 30,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-chocolate-cake",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with frosting",
      price: 140,
      category_id: "cat-cakes",
      image_url: SEED_IMAGES["prod-chocolate-cake"],
      is_available: true,
      stock_quantity: 30,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-croissant",
      name: "Butter Croissant",
      description: "Flaky French pastry",
      price: 95,
      category_id: "cat-pastries",
      image_url: SEED_IMAGES["prod-croissant"],
      is_available: true,
      stock_quantity: 50,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-cinnamon-roll",
      name: "Cinnamon Roll",
      description: "Soft roll with cinnamon sugar and icing",
      price: 110,
      category_id: "cat-pastries",
      image_url: SEED_IMAGES["prod-cinnamon-roll"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-muffin",
      name: "Blueberry Muffin",
      description: "Bakery muffin packed with blueberries",
      price: 85,
      category_id: "cat-pastries",
      image_url: SEED_IMAGES["prod-muffin"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-doughnut",
      name: "Glazed Doughnut",
      description: "Classic doughnut with sweet glaze",
      price: 75,
      category_id: "cat-pastries",
      image_url: SEED_IMAGES["prod-doughnut"],
      is_available: true,
      stock_quantity: 50,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-cookie",
      name: "Chocolate Chip Cookie",
      description: "Freshly baked cookie",
      price: 60,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-cookie"],
      is_available: true,
      stock_quantity: 80,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-brownie",
      name: "Chocolate Brownie",
      description: "Fudgy chocolate brownie square",
      price: 90,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-brownie"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-chips",
      name: "Potato Chips",
      description: "Crispy salted potato chips",
      price: 55,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-chips"],
      is_available: true,
      stock_quantity: 100,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-fries",
      name: "French Fries",
      description: "Golden crispy fries",
      price: 95,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-fries"],
      is_available: true,
      stock_quantity: 60,
      low_stock_threshold: 10,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-sandwich",
      name: "Ham & Cheese Sandwich",
      description: "Toasted sandwich with ham and cheese",
      price: 130,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-sandwich"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: "prod-pretzel",
      name: "Soft Pretzel",
      description: "Warm salted soft pretzel",
      price: 80,
      category_id: "cat-snacks",
      image_url: SEED_IMAGES["prod-pretzel"],
      is_available: true,
      stock_quantity: 40,
      low_stock_threshold: 5,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ];
};

const seedAdmin = (): { user: LocalUser; profile: Profile } => {
  const timestamp = now();
  const userId = "user-admin-default";
  return {
    user: {
      id: userId,
      email: "admin@kaye.com",
      password: "admin123",
      created_at: timestamp,
    },
    profile: {
      id: "profile-admin-default",
      user_id: userId,
      full_name: "Admin",
      role: "admin",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
};

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "The Kaye-ffeine Spot",
  address: "123 Coffee Street, Brew City",
  tax_rate: 8,
  currency: "PHP",
};

const createSeedData = (): AppData => {
  const { user, profile } = seedAdmin();
  return {
    categories: seedCategories(),
    products: seedProducts(),
    customers: [],
    orders: [],
    order_items: [],
    profiles: [profile],
    users: [user],
    settings: { ...DEFAULT_SETTINGS },
  };
};

function applySeedPatch(data: AppData): AppData {
  let changed = false;
  const timestamp = now();

  if (!data.settings) {
    data.settings = { ...DEFAULT_SETTINGS };
    changed = true;
  } else {
    data.settings = { ...DEFAULT_SETTINGS, ...data.settings };
  }

  for (const category of seedCategories()) {
    if (!data.categories.some((c) => c.id === category.id)) {
      data.categories.push(category);
      changed = true;
    }
  }

  for (const product of seedProducts()) {
    const existing = data.products.find((p) => p.id === product.id);
    if (!existing) {
      data.products.push(product);
      changed = true;
      continue;
    }
    if (existing.name !== product.name) {
      existing.name = product.name;
      existing.updated_at = timestamp;
      changed = true;
    }
    if (existing.category_id !== product.category_id) {
      existing.category_id = product.category_id;
      existing.updated_at = timestamp;
      changed = true;
    }
    const seedImage = SEED_IMAGES[product.id];
    if (seedImage && !existing.image_url) {
      existing.image_url = seedImage;
      existing.updated_at = timestamp;
      changed = true;
    }
  }

  if (changed) writeData(data);
  return data;
}

function readData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedData();
      writeData(seed);
      return seed;
    }
    return applySeedPatch(JSON.parse(raw) as AppData);
  } catch {
    const seed = createSeedData();
    writeData(seed);
    return seed;
  }
}

function writeData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function mutate(updater: (data: AppData) => void): AppData {
  const data = readData();
  updater(data);
  writeData(data);
  return data;
}

// ── Categories ──────────────────────────────────────────────

export function getCategories(): Category[] {
  return [...readData().categories].sort((a, b) => a.name.localeCompare(b.name));
}

// ── Products ────────────────────────────────────────────────

export function getProducts(): Product[] {
  return [...readData().products].sort((a, b) => a.name.localeCompare(b.name));
}

export function createProduct(
  input: Omit<Product, "id" | "created_at" | "updated_at" | "stock_quantity" | "low_stock_threshold"> & {
    stock_quantity?: number;
    low_stock_threshold?: number;
  }
): Product {
  const timestamp = now();
  const product: Product = {
    id: createId(),
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    category_id: input.category_id ?? null,
    image_url: input.image_url ?? null,
    is_available: input.is_available ?? true,
    stock_quantity: input.stock_quantity ?? 100,
    low_stock_threshold: input.low_stock_threshold ?? 10,
    created_at: timestamp,
    updated_at: timestamp,
  };
  mutate((data) => {
    data.products.push(product);
  });
  return product;
}

export function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "created_at">>
): Product {
  let updated: Product | null = null;
  mutate((data) => {
    const index = data.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    data.products[index] = {
      ...data.products[index],
      ...updates,
      updated_at: now(),
    };
    updated = data.products[index];
  });
  return updated!;
}

// ── Customers ───────────────────────────────────────────────

export function getCustomers(): Customer[] {
  return [...readData().customers].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCustomerCount(): number {
  return readData().customers.length;
}

export function createCustomer(
  input: Pick<Customer, "name"> & Partial<Pick<Customer, "email" | "phone" | "address">>
): Customer {
  const timestamp = now();
  const customer: Customer = {
    id: createId(),
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    address: input.address ?? null,
    loyalty_points: 0,
    total_orders: 0,
    total_spent: 0,
    created_at: timestamp,
    updated_at: timestamp,
  };
  mutate((data) => {
    data.customers.push(customer);
  });
  return customer;
}

export function updateCustomer(
  id: string,
  updates: Partial<Pick<Customer, "name" | "email" | "phone" | "address">>
): Customer {
  let updated: Customer | null = null;
  mutate((data) => {
    const index = data.customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Customer not found");
    data.customers[index] = {
      ...data.customers[index],
      ...updates,
      updated_at: now(),
    };
    updated = data.customers[index];
  });
  return updated!;
}

// ── Orders ──────────────────────────────────────────────────

export function getOrders(): Order[] {
  return [...readData().orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getOrderById(id: string): Order | null {
  return readData().orders.find((o) => o.id === id) ?? null;
}

export function getOrderItems(orderId: string): (OrderItem & { product_name?: string })[] {
  const data = readData();
  return data.order_items
    .filter((item) => item.order_id === orderId)
    .map((item) => {
      const product = data.products.find((p) => p.id === item.product_id);
      return {
        ...item,
        product_name: product?.name ?? `Product ID: ${item.product_id}`,
      };
    });
}

export function createOrder(
  orderInput: Omit<Order, "id" | "created_at" | "updated_at">,
  items: Omit<OrderItem, "id" | "created_at" | "order_id">[]
): Order {
  const timestamp = now();
  const order: Order = {
    id: createId(),
    ...orderInput,
    created_at: timestamp,
    updated_at: timestamp,
  };

  mutate((data) => {
    data.orders.push(order);
    for (const item of items) {
      data.order_items.push({
        id: createId(),
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: timestamp,
      });
    }

    // Update matching customer stats when order is completed
    if (order.status === "completed" && order.customer_name) {
      const customer = data.customers.find(
        (c) => c.name.toLowerCase() === order.customer_name!.toLowerCase()
      );
      if (customer) {
        customer.total_orders += 1;
        customer.total_spent += order.total;
        customer.loyalty_points += Math.floor(order.total / 10);
        customer.updated_at = timestamp;
      }
    }
  });

  return order;
}

export function updateOrderStatus(id: string, status: string): Order {
  let updated: Order | null = null;
  mutate((data) => {
    const index = data.orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Order not found");
    data.orders[index] = {
      ...data.orders[index],
      status,
      updated_at: now(),
    };
    updated = data.orders[index];
  });
  return updated!;
}

export function getCompletedOrdersSince(startDate: Date): Order[] {
  return readData().orders.filter(
    (o) => o.status === "completed" && new Date(o.created_at) >= startDate
  );
}

// ── Auth / Users ────────────────────────────────────────────

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getUserById(userId: string): LocalUser | null {
  return readData().users.find((u) => u.id === userId) ?? null;
}

export function getProfileByUserId(userId: string): Profile | null {
  return readData().profiles.find((p) => p.user_id === userId) ?? null;
}

export function getUserByEmail(email: string): LocalUser | null {
  return (
    readData().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export function signInLocal(email: string, password: string): { user: LocalUser; profile: Profile } {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  const profile = getProfileByUserId(user.id);
  if (!profile || !profile.is_active) {
    throw new Error("Account is inactive");
  }
  setSessionUserId(user.id);
  return { user, profile };
}

export function signUpLocal(
  email: string,
  password: string,
  fullName: string,
  role: "admin" | "staff" = "staff"
): { user: LocalUser; profile: Profile } {
  if (getUserByEmail(email)) {
    throw new Error("An account with this email already exists");
  }

  const timestamp = now();
  const user: LocalUser = {
    id: createId(),
    email: email.toLowerCase(),
    password,
    created_at: timestamp,
  };
  const profile: Profile = {
    id: createId(),
    user_id: user.id,
    full_name: fullName,
    role,
    is_active: true,
    created_at: timestamp,
    updated_at: timestamp,
  };

  mutate((data) => {
    data.users.push(user);
    data.profiles.push(profile);
  });

  setSessionUserId(user.id);
  return { user, profile };
}

export function signOutLocal() {
  setSessionUserId(null);
}

export function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "full_name" | "phone" | "avatar_url">>
): Profile {
  let updated: Profile | null = null;
  mutate((data) => {
    const index = data.profiles.findIndex((p) => p.user_id === userId);
    if (index === -1) throw new Error("Profile not found");
    data.profiles[index] = {
      ...data.profiles[index],
      ...updates,
      updated_at: now(),
    };
    updated = data.profiles[index];
  });
  return updated!;
}

// ── Settings ────────────────────────────────────────────────

export function getSettings(): StoreSettings {
  return { ...DEFAULT_SETTINGS, ...readData().settings };
}

export function updateSettings(updates: Partial<StoreSettings>): StoreSettings {
  let updated: StoreSettings | null = null;
  mutate((data) => {
    data.settings = {
      ...DEFAULT_SETTINGS,
      ...data.settings,
      ...updates,
    };
    updated = data.settings;
  });
  return updated!;
}
