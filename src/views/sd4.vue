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
            <v-btn @click="openDialog(item)" color="info">
              ดูรายละเอียด
            </v-btn>
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
  
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span>รายละเอียดสินค้า</span>
          </v-card-title>
          <v-card-text>
            <ul v-if="selectedBill && selectedBill.products">
              <li v-for="product in selectedBill.products" :key="product.name" class="product-item">
                <img :src="`http://localhost:3000/${product.image}` || 'https://via.placeholder.com/150'" alt="Product Image" class="product-image">
                <div class="product-info">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-quantity">จำนวน: {{ product.quantity }}</span>
                  <span class="product-price">ราคาต่อชิ้น: {{ product.price }} บาท</span>
                </div>
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialog = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        salesData: [],
        dialog: false,
        selectedBill: null, // เก็บข้อมูลคำสั่งซื้อที่เลือก
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
      openDialog(item) {
        this.selectedBill = item; // เก็บข้อมูลคำสั่งซื้อที่เลือก
        this.dialog = true; // เปิด dialog
      },
  
      async handleReturn(billId) {
        console.log(`Handling return for billId: ${billId}`);
        if (!billId) {
          console.error('Error: billId is undefined or null');
          return;
        }
        try {
          const encodedBillId = encodeURIComponent(billId);
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
  </style>
  