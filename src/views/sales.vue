<template>
  <div class="sales-page">
    <header>
      <h1>ข้อมูลการขาย</h1>
    </header>

    <div class="sales-grid">
      <div v-for="sale in sales" :key="sale._id" class="sale-item">
        <div v-for="bill in sale.bills" :key="bill.billId" class="bill-details">
          <h3>เลขที่คำสั่งซื้อ: {{ bill.billId }}</h3>
          <p class="total-amount">รวมทั้งหมด: {{ bill.totalAmount }} บาท</p>
          <ul>
            <li v-for="product in bill.products" :key="product.name" class="product-item">
              <img :src=" `http://localhost:3000/${product.image}` || 'https://via.placeholder.com/150'" alt="Product Image" class="product-image">
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-quantity">จำนวน: {{ product.quantity }}</span>
                <span class="product-price">ราคาต่อชิ้น: {{ product.price }} บาท</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="order-total">
          <strong>ราคารวมทั้งหมด: {{ sale.dailyTotal }} บาท</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sales: [],
    };
  },
  created() {
    this.fetchSales();
  },
  methods: {
    async fetchSales() {
      try {
        const response = await fetch('http://localhost:3000/api/v1/orders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === 200 && result.message === 'รายการขายในแต่ละวัน') {
          this.sales = result.data;
        } else {
          console.error('Unexpected API response:', result);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },
  },
};
</script>

<style scoped>
.sales-page {
  font-family: 'Roboto', sans-serif;
  padding: 15px;
  background-color: #f3f4f6;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: #3c4858;
  font-size: 1.8em;
  margin: 0;
  font-weight: 600;
}

.sales-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sale-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sale-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.bill-details {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.bill-details h3 {
  color: #ff5722;
  font-size: 1.15em;
  margin: 0 0 5px;
}

.total-amount {
  font-weight: bold;
  color: #2196f3;
  font-size: 1.1em;
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 6px;
  border: 2px solid #eee;
  transition: border-color 0.3s ease;
}

.product-image:hover {
  border-color: #ff5722;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: bold;
  color: #333;
  font-size: 1em;
}

.product-quantity,
.product-price {
  color: #666;
  font-size: 0.9em;
  margin-top: 3px;
}

.order-total {
  text-align: right;
  margin-top: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

.order-total strong {
  font-size: 1.2em;
  color: #333;
}

@media (max-width: 768px) {
  .sales-grid {
    flex-direction: column;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-image {
    margin-bottom: 8px;
  }
}
</style>
