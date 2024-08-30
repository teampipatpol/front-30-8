<template>
    <v-container>
      <v-card>
        <v-card-title>
          <h2>ข้อมูลการขาย</h2>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="salesData"
          item-key="_id"
          class="elevation-1"
        >
          <template v-slot:[`item.billId`]="{ item }">
            <span>{{ item.billId }}</span>
          </template>
          <template v-slot:[`item.totalAmount`]="{ item }">
            <span>{{ item.totalAmount }} บาท</span>
          </template>
          <template v-slot:[`item.products`]="{ item }">
            <v-btn @click="toggleDetails(item.billId)" color="info">
              {{ expandedItems[item.billId] ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด' }}
            </v-btn>
            <v-expand-transition>
              <div v-if="expandedItems[item.billId]" class="product-list">
                <ul v-for="product in item.products" :key="product.name" class="product-item">
                  <img :src="`http://localhost:3000/${product.image}` || 'https://via.placeholder.com/150'" alt="Product Image" class="product-image">
                  <div class="product-info">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-quantity">จำนวน: {{ product.quantity }}</span>
                    <span class="product-price">ราคาต่อชิ้น: {{ product.price }} บาท</span>
                  </div>
                </ul>
              </div>
            </v-expand-transition>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="handleReturn(item.billId)" color="orange" class="mr-2">
              คืนสินค้า
            </v-btn>
            <v-btn @click="handlePrint(item.billId)" color="primary">
              ปริ้นใบเสร็จ
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    
    data() {
      return {
        salesData: [],
        expandedItems: {}, // เก็บสถานะการขยายของแต่ละรายการ
        headers: [
          { text: 'เลขที่คำสั่งซื้อ', value: 'billId' },
          { text: 'รวมทั้งหมด', value: 'totalAmount' },
          { text: 'รายละเอียดสินค้า', value: 'products' },
          { text: 'ดำเนินการ', value: 'actions' }
        ]
      };
    },
    async created() {
      await this.fetchSales();
    },
  methods: {
    toggleDetails(billId) {
      this.$set(this.expandedItems, billId, !this.expandedItems[billId]);
    },
    
    async handleReturn(billId) {
      console.log(`Handling return for billId: ${billId}`); // ตรวจสอบค่า billId
      
      if (!billId) {
        console.error('Error: billId is undefined or null');
        return;
      }
      
      try {
        const encodedBillId = encodeURIComponent(billId); // เข้ารหัส billId
        const response = await axios.post(`http://localhost:3000/api/v1/orders/${encodedBillId}/return`);
        console.log('Return successful:', response.data);
      } catch (error) {
        console.error('Error processing return:', error.response ? error.response.data : error.message);
      }
    },
    
    async handlePrint(billId) {
      console.log(`Print button clicked for billId: ${billId}`);
      // Implement print functionality here
    },
    
    async fetchSales() {
      try {
        const response = await fetch('http://localhost:3000/api/v1/orders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.status === 200 && result.message === 'รายการขายในแต่ละวัน') {
          this.salesData = result.data.flatMap(day => 
            day.bills.map(bill => ({
              billId: bill.billId,
              totalAmount: bill.totalAmount,
              products: bill.products
            }))
          );
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
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-weight: bold;
    color: #333;
  }
  
  .product-quantity,
  .product-price {
    color: #666;
    font-size: 0.9em;
    margin-top: 3px;
  }
  
  .v-data-table th {
    background-color: #1976d2;
    color: #ffffff;
  }
  
  .v-data-table td {
    text-align: center;
  }
  
  .v-card {
    margin-top: 16px;
  }
  
  .product-list {
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  </style>
  