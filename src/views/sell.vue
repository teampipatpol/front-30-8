<template>
  <div class="sell-page">
    <header>
      <h1 >ขายสินค้า</h1>
      <div class="cart-icon" @click="toggleCart">
        <span class="cart-count">{{ totalItemsInCart }}</span>
        <i class="fas fa-shopping-cart"></i>
      </div>
    </header>

    <div class="products-grid">
      <div
        v-for="product in availableProducts"
        :key="product._id"
        class="product-item"
      >
        <img
          :src="product.image ? `http://localhost:3000/${product.image}` : 'https://via.placeholder.com/150'"
          alt="Product Image"
          class="product-image"
        />
        <div class="product-details">
          <span>ชื่อ: {{ product.name }}</span><br />
          <span>ราคา: {{ product.price }} บาท</span><br />
          <span>รายละเอียดสินค้า: {{ product.details }}</span><br />
          <p>จำนวนสินค้า: {{ product.stock }}</p>
          <input
            v-model.number="product.quantity"
            min="1"
            :max="product.stock"
            placeholder="เลือกจำนวน"
            class="quantity-input"
          />
          <button
            class="add-cart-btn"
            @click="addToCart(product)"
            :disabled="product.stock <= 0"
          >
            เพิ่มสินค้า
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCart" class="cart">
      <h2>Shopping Cart</h2>
      <ul>
        <li v-for="item in cart" :key="item._id" class="cart-item">
          <img
            :src="item.image ? `http://localhost:3000/${item.image}` : 'https://via.placeholder.com/50'"
            alt="Product Image"
            class="cart-item-image"
          />
          <div class="cart-item-details">
            {{ item.name }} - {{ item.price }} บาท x {{ item.quantity }}
            <button
                  class="remove-item-btn"
                  @click="removeFromCart(item._id)"
                >
                  <i class="fas fa-times"></i>
                  <!-- Cross icon using Font Awesome -->
                </button>
          </div>
        </li>
      </ul>
      <div class="cart-summary">
        <div>Total: {{ total }} บาท</div>
        <div class="cart-buttons">
          <button class="sell-btn" @click="sellProducts">ซื้อ</button>
          <button class="close-cart-btn" @click="toggleCart">ปิด</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      products: [],
      cart: [],
      showCart: false,
    };
  },
  computed: {
    availableProducts() {
      return this.products.filter(product => product.stock > 0);
    },
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    totalItemsInCart() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === 200 && result.message === "success") {
          this.products = result.data;
        } else {
          console.error("Unexpected API response:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    addToCart(product) {
      if (product.quantity && product.quantity > 0 && product.quantity <= product.stock) {
        const cartItem = this.cart.find(item => item._id === product._id);
        if (cartItem) {
          cartItem.quantity += product.quantity;
        } else {
          this.cart.push({ ...product, quantity: product.quantity });
        }
        product.quantity = 1;
      } else {
        alert("Invalid quantity");
      }
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    async sellProducts() {
  try {
    const cartItems = this.cart.map(item => ({ _id: item._id, quantity: item.quantity }));
    const response = await fetch("http://localhost:3000/api/v1/products/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cartItems }),
    });

    if (response.ok) {
      const result = await response.json();
      Swal.fire({
        text: result.message || "",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      this.cart = [];
      this.showCart = false;
      this.fetchProducts();
    } else {
      const result = await response.json();
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถซื้อสินค้าได้: " + result.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดขณะทำการขาย:', error); // บันทึกข้อผิดพลาดลง Console
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: "เกิดข้อผิดพลาดขณะซื้อสินค้า.",
      icon: "error",
      confirmButtonText: "ตกลง",
    });
  }
}


,    removeFromCart(id) {
      const index = this.cart.findIndex(item => item._id === id);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },
  },
};
</script>
  
  
  <style>
.sell-page {
  margin: 20px;
  font-family: "Roboto", sans-serif;
  color: #333;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 2px solid #eee;
}

h1 {
  color: #007bff;
  font-size: 28px;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 24px;
}

.cart-icon i {
  font-size: 36px;
  color: #333;
}

.cart-icon .cart-count {
  position: absolute;
  top: -22px;
  right: -20px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.product-item {
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 5px;
}

.product-details {
  text-align: center;
  font-size: 14px;
}

.quantity-input {
  width: 110px;
  padding: 5px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

button {
  width: 120px;
  height: 40px;
  margin: 0;
  padding: 10px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-cart-btn {
  background: linear-gradient(to left, #ff9800, #ffc107);
}

.add-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.close-cart-btn {
  background: #6c757d;
}

.sell-btn {
  background: #28a745;
}

.sell-btn:hover,
.close-cart-btn:hover {
  opacity: 0.8;
}

.cart {
  position: fixed;
  top: 10%;
  right: 10%;
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  z-index: 1000;
  width: 500px;
  height: auto;
  max-height: 70%;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: -150px;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.cart-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 5px;
}

.cart-item-details {
  flex-grow: 1;
}

.cart-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cart-summary {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.cart-item-details {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-item-btn {
  background-color: transparent;
  border: none;
  color: #ff4d4d;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.remove-item-btn:hover {
  color: #ff1a1a;
}

</style>
  