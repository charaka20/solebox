import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, User, Order } from "../types";
import { PRODUCTS } from "../data";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

interface AppContextType {
  currentUser: User | null;
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  login: (email: string, name?: string) => User;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (address: string, phone: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["status"], courierTracking?: string) => Promise<void>;
  addNewProduct: (product: Omit<Product, "isCustomImport">) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMockOrders: Order[] = [
  {
    id: "SB-2026-9921",
    userId: "mock-user-1",
    userEmail: "kasun.perera@gmail.com",
    userName: "Kasun Perera",
    items: [
      {
        product: PRODUCTS[2],
        size: 42,
        quantity: 1,
      }
    ],
    total: 18900,
    date: "2026-05-12",
    status: "Delivered",
    courierTracking: "DMX-90215882",
    deliveryAddress: "No. 45, Flower Road, Colombo 07",
    phone: "+94 77 123 4567"
  },
  {
    id: "SB-2026-9928",
    userId: "mock-user-2",
    userEmail: "dilini.j@outlook.com",
    userName: "Dilini Jayawardena",
    items: [
      {
        product: PRODUCTS[1],
        size: 40,
        quantity: 1,
      }
    ],
    total: 24500,
    date: "2026-05-18",
    status: "Shipped",
    courierTracking: "DMX-90825114",
    deliveryAddress: "No. 12/A, Hanthana Road, Kandy",
    phone: "+94 71 888 2211"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sb_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("sb_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("sb_orders");
    if (saved) {
      return JSON.parse(saved);
    }
    return initialMockOrders;
  });

  // Dynamic custom products fetched from Firebase or added locally
  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("sb_custom_products");
    return saved ? JSON.parse(saved) : [];
  });

  // Track deleted products (both static and custom)
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("sb_deleted_product_ids");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Firebase Auth listener to automatically synchronize logins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isUserAdmin = 
          firebaseUser.email?.toLowerCase() === "charakaviduranga2@gmail.com" || 
          firebaseUser.email?.toLowerCase() === "soleboxlk@gmail.com" || 
          !!firebaseUser.email?.toLowerCase().includes("admin");
          
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Client",
          email: firebaseUser.email?.toLowerCase() || "",
          isAdmin: isUserAdmin,
        };

        setCurrentUser(newUser);

        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          await setDoc(userRef, {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
          }, { merge: true });
        } catch (e) {
          console.warn("Could not replicate metadata to users firestore doc:", e);
        }
      } else {
        const cachedUserStr = localStorage.getItem("sb_user");
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          if (!cachedUser.id.startsWith("u_")) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Synchronize order collections in real time
  useEffect(() => {
    if (!currentUser) {
      const saved = localStorage.getItem("sb_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        setOrders(initialMockOrders);
      }
      return;
    }

    let q;
    if (currentUser.isAdmin) {
      q = collection(db, "orders");
    } else {
      q = query(collection(db, "orders"), where("userId", "==", currentUser.id));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          liveOrders.push(docSnap.data() as Order);
        });

        liveOrders.sort((a, b) => b.id.localeCompare(a.id));
        setOrders(liveOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "orders");
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Synchronize dynamic sneaker imports in real-time
  useEffect(() => {
    const q = collection(db, "products");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          liveProducts.push(docSnap.data() as Product);
        });
        setCustomProducts(liveProducts);
      },
      (error) => {
        console.warn("Could not load products in real-time from Firestore (falling back to cached local):", error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync state variables with caching storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("sb_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("sb_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("sb_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("sb_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("sb_custom_products", JSON.stringify(customProducts));
  }, [customProducts]);

  useEffect(() => {
    localStorage.setItem("sb_deleted_product_ids", JSON.stringify(deletedProductIds));
  }, [deletedProductIds]);

  // Google Sign-In helper
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const isUserAdmin = 
        firebaseUser.email?.toLowerCase() === "charakaviduranga2@gmail.com" || 
        firebaseUser.email?.toLowerCase() === "soleboxlk@gmail.com" || 
        !!firebaseUser.email?.toLowerCase().includes("admin");
        
      const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Client",
        email: firebaseUser.email?.toLowerCase() || "",
        isAdmin: isUserAdmin,
      };

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        await setDoc(userRef, {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
        }, { merge: true });
      } catch (innerErr) {
        console.warn("User register setDoc blocked or offline:", innerErr);
      }

      setCurrentUser(newUser);
    } catch (err) {
      console.error("Popup Authentication failed:", err);
      throw err;
    }
  };

  const login = (email: string, name?: string) => {
    const isUserAdmin = 
      email.toLowerCase() === "charakaviduranga2@gmail.com" || 
      email.toLowerCase() === "soleboxlk@gmail.com" || 
      email.toLowerCase().includes("admin");
    const formattedName = name || (isUserAdmin ? "SoleBox Admin" : email.split("@")[0]);
    
    // Clear any residual active Google Firebase Auth session to prevent user/rule ID mismatches
    auth.signOut().catch((e) => console.log("Residual Auth session cleared safely:", e));

    const newUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name: formattedName,
      email: email.toLowerCase(),
      isAdmin: isUserAdmin,
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Firebase Auth signout failure:", e);
    }
    setCurrentUser(null);
  };

  const addToCart = (product: Product, size: number, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, size, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: number) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (address: string, phone: string) => {
    if (cart.length === 0) {
      throw new Error("Cannot checkout empty cart");
    }

    const orderTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const orderId = "SB-2026-" + Math.floor(1000 + Math.random() * 9000);
    
    // Ensure that if there's an active firebase session, we use the registered firebase userId/email 
    // to strictly prevent any rule authorization mismatch during database creation.
    const orderUserId = auth.currentUser ? auth.currentUser.uid : (currentUser?.id || "anonymous");
    const orderUserEmail = auth.currentUser ? (auth.currentUser.email || currentUser?.email || "guest@solebox.lk") : (currentUser?.email || "guest@solebox.lk");

    const newOrder: Order = {
      id: orderId,
      userId: orderUserId,
      userEmail: orderUserEmail,
      userName: currentUser?.name || "Premium Client",
      items: [...cart],
      total: orderTotal,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      deliveryAddress: address,
      phone: phone,
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "orders", orderId), newOrder);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
      }
    } else {
      setOrders((prev) => [newOrder, ...prev]);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"], courierTracking?: string) => {
    if (auth.currentUser) {
      try {
        const orderRef = doc(db, "orders", orderId);
        const updates: any = { status };
        if (courierTracking !== undefined) {
          updates.courierTracking = courierTracking;
        }
        await updateDoc(orderRef, updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                ...(courierTracking !== undefined ? { courierTracking } : {}),
              }
            : order
        )
      );
    }
  };

  // Add a new dynamic product to database or local catalog state
  const addNewProduct = async (productData: Omit<Product, "isCustomImport">) => {
    const newProduct: Product = {
      ...productData,
      isCustomImport: true,
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "products", newProduct.id), newProduct);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
      }
    } else {
      setCustomProducts((prev) => [...prev, newProduct]);
    }
  };

  // Delete a product (both static and custom)
  const deleteProduct = async (productId: string) => {
    setDeletedProductIds((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "products", productId));
      } catch (err) {
        console.warn("Could not delete from Firestore:", err);
      }
    } else {
      setCustomProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const isAdmin = currentUser?.isAdmin || false;

  // Combine static initial products with dynamic admin custom creations and filter soft deleted ones
  const products = [...PRODUCTS, ...customProducts].filter(
    (product) => !deletedProductIds.includes(product.id)
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        cart,
        orders,
        products,
        login,
        logout,
        signInWithGoogle,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addNewProduct,
        deleteProduct,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
