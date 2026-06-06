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
  notifications: any[];
  login: (email: string, name?: string) => User;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (address: string, phone: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["status"], courierTracking?: string) => Promise<void>;
  addNewProduct: (product: Omit<Product, "isCustomImport">, sizeStock?: Record<string, number>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  subscribeToStockAlert: (productId: string, productName: string, userEmail: string, size?: number) => Promise<void>;
  toggleProductStock: (productId: string) => Promise<void>;
  productStockMap: Record<string, Record<string, number>>;
  updateProductStock: (productId: string, sizeStock: Record<string, number>) => Promise<void>;
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

  // Keep track of out of stock products (both static and custom)
  // Let's mark the Yeezy Boost V2 (or another shoe) as out of stock by default to demonstrate the 'Notify Me' feature right out of the box!
  const [outOfStockProductIds, setOutOfStockProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("sb_out_of_stock_product_ids");
    return saved ? JSON.parse(saved) : ["snkr-nb-550"]; // New Balance 550 ALD Out of Stock by default
  });

  // Track stock notification requests for administrators
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("sb_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // Track stock level maps (product ID -> size string -> quantity)
  const [productStockMap, setProductStockMap] = useState<Record<string, Record<string, number>>>(() => {
    const saved = localStorage.getItem("sb_product_stock_map");
    if (saved) {
      return JSON.parse(saved);
    }
    const defaults: Record<string, Record<string, number>> = {};
    // Jordan 1 Travis Scott
    defaults["snkr-aj1-ts"] = { "40": 8, "41": 5, "42": 12, "43": 7, "44": 15, "45": 4 };
    // New Balance 550 ALD - Out of stock by default to show "Notify Me" trigger
    defaults["snkr-nb-550"] = { "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0 };
    // Dunk Low Panda Noir
    defaults["snkr-dunk-low"] = { "40": 10, "41": 15, "42": 24, "43": 18, "44": 8, "45": 3 };
    // Yeezy Boost 350 Onyx
    defaults["snkr-yz-350"] = { "41": 6, "42": 9, "43": 14, "44": 11, "45": 5 };
    return defaults;
  });

  // Persist productStockMap changes
  useEffect(() => {
    localStorage.setItem("sb_product_stock_map", JSON.stringify(productStockMap));
  }, [productStockMap]);

  // 1. Firebase Auth listener to automatically synchronize logins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isUserAdmin = 
          firebaseUser.email?.toLowerCase() === "charakaviduranga2@gmail.com" || 
          firebaseUser.email?.toLowerCase() === "hkrumesh@gmail.com" || 
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
        const stockUpdates: Record<string, Record<string, number>> = {};
        snapshot.forEach((docSnap) => {
          const prod = docSnap.data() as Product;
          liveProducts.push(prod);
          if (prod.sizeStock) {
            stockUpdates[prod.id] = prod.sizeStock;
          }
        });
        setCustomProducts(liveProducts);
        
        if (Object.keys(stockUpdates).length > 0) {
          setProductStockMap((prev) => ({
            ...prev,
            ...stockUpdates
          }));
        }
      },
      (error) => {
        console.warn("Could not load products in real-time from Firestore (falling back to cached local):", error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4. Synchronize stock alerts / notifications in real-time for admins
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      return;
    }

    const q = collection(db, "notifications");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveNotifs: any[] = [];
        snapshot.forEach((docSnap) => {
          liveNotifs.push(docSnap.data());
        });
        liveNotifs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setNotifications(liveNotifs);
      },
      (error) => {
        console.warn("Could not load notifications collection from Firestore:", error.message);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

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
        firebaseUser.email?.toLowerCase() === "hkrumesh@gmail.com" || 
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
      email.toLowerCase() === "hkrumesh@gmail.com" || 
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
    // Determine configured stock level
    const sizeStock = productStockMap[product.id] || {};
    const hasStockConfig = Object.keys(sizeStock).length > 0;
    
    // Default to fallback limit of 5 if no specific stock configuration defined
    const limit = hasStockConfig ? (sizeStock[String(size)] ?? 5) : 5;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = copy[existingIndex].quantity + quantity;
        if (newQty > limit) {
          copy[existingIndex].quantity = limit;
          return copy;
        }
        copy[existingIndex].quantity = newQty;
        return copy;
      }
      
      const cappedQty = Math.min(quantity, limit);
      if (cappedQty <= 0) {
        // If out of stock, do not add to cart
        return prev;
      }
      return [...prev, { product, size, quantity: cappedQty }];
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

    // Determine configured stock level
    const sizeStock = productStockMap[productId] || {};
    const hasStockConfig = Object.keys(sizeStock).length > 0;
    const limit = hasStockConfig ? (sizeStock[String(size)] ?? 5) : 5;
    
    const cappedQty = Math.min(quantity, limit);

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity: cappedQty } : item
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

    // Deduct stock levels for purchased quantities
    setProductStockMap((prev) => {
      const next = { ...prev };
      cart.forEach((item) => {
        const prodId = item.product.id;
        const selectedSizeStr = String(item.size);
        if (!next[prodId]) {
          next[prodId] = {};
        }
        const currentQty = next[prodId][selectedSizeStr] ?? 5; // default fallback if none configured
        next[prodId][selectedSizeStr] = Math.max(0, currentQty - item.quantity);
        
        // Also update the custom product in state/Database asynchronously
        const isCustom = customProducts.find((p) => p.id === prodId);
        if (isCustom) {
          const updatedSizeStock = { ...next[prodId] };
          setCustomProducts((cp) => {
            const nextCp = cp.map((p) => p.id === prodId ? { ...p, sizeStock: updatedSizeStock } : p);
            localStorage.setItem("sb_custom_products", JSON.stringify(nextCp));
            return nextCp;
          });
          if (auth.currentUser) {
            updateDoc(doc(db, "products", prodId), {
              sizeStock: updatedSizeStock
            }).catch((err) => console.warn("Silent order stock sync fail:", err));
          }
        }
      });
      return next;
    });

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
  const addNewProduct = async (productData: Omit<Product, "isCustomImport">, sizeStock?: Record<string, number>) => {
    const newProduct: Product = {
      ...productData,
      isCustomImport: true,
      ...(sizeStock ? { sizeStock } : {})
    };

    if (sizeStock) {
      setProductStockMap((prev) => ({
        ...prev,
        [newProduct.id]: sizeStock
      }));
    }

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "products", newProduct.id), newProduct);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
      }
    } else {
      setCustomProducts((prev) => {
        const updated = [...prev, newProduct];
        localStorage.setItem("sb_custom_products", JSON.stringify(updated));
        return updated;
      });
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
      setCustomProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        localStorage.setItem("sb_custom_products", JSON.stringify(next));
        return next;
      });
    }
  };

  // Submit back-in-stock notification alert subscriptions
  const subscribeToStockAlert = async (productId: string, productName: string, userEmail: string, size?: number) => {
    const notificationId = "NTF-" + Math.floor(10000 + Math.random() * 90000);
    const newAlert = {
      id: notificationId,
      productId,
      productName,
      userEmail: userEmail.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      ...(size ? { size } : {})
    };

    try {
      await setDoc(doc(db, "notifications", notificationId), newAlert);
      
      setNotifications((prev) => {
        const next = [newAlert, ...prev.filter((n) => n.id !== notificationId)];
        localStorage.setItem("sb_notifications", JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.warn("Could not write notification request to Firestore (saving locally):", err);
      setNotifications((prev) => {
        const next = [newAlert, ...prev.filter((n) => n.id !== notificationId)];
        localStorage.setItem("sb_notifications", JSON.stringify(next));
        return next;
      });
    }
  };

  // Toggle stock level status for a product (works for both base drops & custom drops!)
  const toggleProductStock = async (productId: string) => {
    const isNowOut = !outOfStockProductIds.includes(productId);
    
    setOutOfStockProductIds((prev) => {
      const next = prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId];
      localStorage.setItem("sb_out_of_stock_product_ids", JSON.stringify(next));
      return next;
    });

    const isCustom = customProducts.some((p) => p.id === productId);
    if (isCustom && auth.currentUser) {
      try {
        await updateDoc(doc(db, "products", productId), {
          outOfStock: isNowOut
        });
      } catch (err) {
        console.warn("Could not synchronize out of stock level trigger to Firestore doc:", err);
      }
    }
  };

  // Update size-specific stock and recalculate status
  const updateProductStock = async (productId: string, sizeStock: Record<string, number>) => {
    setProductStockMap((prev) => ({
      ...prev,
      [productId]: sizeStock
    }));

    const isCustom = customProducts.some((p) => p.id === productId);
    if (isCustom) {
      setCustomProducts((prev) => {
        const next = prev.map((p) => p.id === productId ? { ...p, sizeStock } : p);
        localStorage.setItem("sb_custom_products", JSON.stringify(next));
        return next;
      });

      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, "products", productId), {
            sizeStock
          });
        } catch (err) {
          console.warn("Could not sync updated sizeStock to Firestore doc:", err);
        }
      }
    }
  };

  const isAdmin = currentUser?.isAdmin || false;

  // Combine static initial products with dynamic admin custom creations and filter soft deleted ones
  const products = [...PRODUCTS, ...customProducts]
    .filter((product) => !deletedProductIds.includes(product.id))
    .map((product) => {
      const sizeStock = productStockMap[product.id] || {};
      const sizeValues = Object.keys(sizeStock).length > 0 ? Object.values(sizeStock) : [];
      const hasStockConfig = Object.keys(sizeStock).length > 0;
      const cumulativeStock = sizeValues.reduce((sum, qty) => sum + qty, 0);
      
      const isAutoOutOfStock = hasStockConfig && cumulativeStock === 0;
      const finalOutOfStock = outOfStockProductIds.includes(product.id) || !!product.outOfStock || isAutoOutOfStock;
      
      return {
        ...product,
        sizeStock,
        outOfStock: finalOutOfStock
      };
    });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        cart,
        orders,
        products,
        notifications,
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
        subscribeToStockAlert,
        toggleProductStock,
        productStockMap,
        updateProductStock,
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
