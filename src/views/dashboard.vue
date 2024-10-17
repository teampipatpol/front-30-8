<template>
    <v-container>
      <v-card>
        <v-card-title>
          <h2>ข้อมูลการขาย</h2>
        </v-card-title>
     

        <!-- สรุปยอดขาย -->
        <v-row>
          <!-- <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <h3>ยอดขายรายวัน</h3>
              </v-card-title>
              <v-card-text>
                <h2>{{ dailyTotalOrders }} ออเดอร์</h2>
                <h2>{{ dailyTotalSales }} บาท</h2>
              </v-card-text>
            </v-card>
          </v-col> -->
          <v-col class="chart-container" cols="12" md="3">
          <v-card outlined>
            <v-card-title>
              <h3>ยอดขายรายวัน</h3>
            </v-card-title>
            <v-card-text>
              <h2>{{ totalOrders2 }} ออเดอร์</h2>
              <h2>{{ totalSales2 }} บาท</h2>
            </v-card-text>
          </v-card>
        </v-col>
          <v-col class="chart-container" cols="12" md="3">
            <v-card outlined>
              <v-card-title>
                <h3>ยอดขายรวม</h3>
              </v-card-title>
              <v-card-text>
                <h2>{{ totalOrders }} ออเดอร์</h2>
                <h2>{{ totalSales }} บาท</h2>
              </v-card-text>
            </v-card>
          </v-col>
          <v-card-title>
</v-card-title>
<div class="chart-container">
  <canvas id="salesChart"></canvas>
</div>
        </v-row>
        <v-card class="mt-4">
        <v-card-title>
          <h2>สินค้าขายดี</h2>
        </v-card-title>
        <v-data-table
          :headers="bestSellingHeaders"
          :items="bestSellingProducts"
          item-key="name"
          class="elevation-1"
        >
          <template v-slot:[`item.name`]="{ item }">
            <span>{{ item.name }}</span>
          </template>
          <template v-slot:[`item.totalSold`]="{ item }">
            <span>{{ item.totalSold }} ชิ้น</span>
          </template>
          <template v-slot:[`item.totalRevenue`]="{ item }">
            <span>{{ item.totalRevenue }} บาท</span>
          </template>
        </v-data-table>
      </v-card>
        <!-- ตารางข้อมูลการขาย -->
        <v-data-table
          :headers="headers"
          :items="filteredSalesData"
          item-key="billId"
          class="elevation-1"
        >
          <template v-slot:[`item.billId`]="{ item }">
            <span>{{ item.billId }}</span>
          </template>
          <template v-slot:[`item.totalAmount`]="{ item }">
            <span>{{ item.totalAmount }} บาท</span>
          </template>
          <template v-slot:[`item.products`]="{ item }">
            <ul
              v-for="product in item.products"
              :key="product.name"
              class="product-item"
            >
              <img
                :src="`http://localhost:3000/${product.image}` || 'https://via.placeholder.com/150'"
                alt="Product Image"
                class="product-image"
              />
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-quantity">จำนวน: {{ product.quantity }}</span>
                <span class="product-price">ราคาต่อชิ้น: {{ product.price }} บาท</span>
              </div>
            </ul>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="handlePrint(item.billId)" color="primary">
              ปริ้นใบเสร็จ
            </v-btn>
          </template>
        </v-data-table>
  
        <!-- กราฟยอดขายรายวัน -->
       
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  
  export default {
    data() {
      return {
        salesData: [],
        headers: [
          { text: "เลขที่คำสั่งซื้อ", value: "billId" },
          { text: "รวมทั้งหมด", value: "totalAmount" },
          { text: "รายละเอียดสินค้า", value: "products" },
          { text: "ดำเนินการ", value: "actions" },
        ],
        bestSellingHeaders: [
        { text: "ชื่อสินค้า", value: "name" },
        { text: "จำนวนที่ขายได้", value: "totalSold" },
        { text: "ยอดขายรวม", value: "totalRevenue" },
      ],
      };
    },
    async created() {
      await this.fetchSales();
      this.renderSalesChart();
    },
    computed: {
      filteredSalesData() {
        return this.salesData.filter(
          (order) =>
            !order.products.some((product) => product.status === "returned")
        );
      },

      totalSales2() {
      return this.filteredSalesData.reduce((sum, order) => sum + order.totalAmount, 0);
    },
    totalOrders2() {
      return this.filteredSalesData.length;
    },

      dailySales() {
    const salesByDate = this.salesData.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString(); // ใช้ .toLocaleDateString() เพื่อให้ได้วันที่ในรูปแบบที่ตรงกับการแสดงผล
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});
    return Object.entries(salesByDate).map(([date, total]) => ({
      date,
      total,
    }));
  },
  
  dailyTotalSales() {
  const today = new Date().setHours(0, 0, 0, 0); // แปลงวันที่ปัจจุบันให้เวลาเป็น 0:00
  console.log("Today's date:", new Date(today)); // เช็คว่าค่า today ถูกต้อง

  return this.salesData
    .filter((order) => {
      const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0); // แปลงวันที่ในข้อมูลออเดอร์เป็น 0:00
      console.log("Order date:", new Date(orderDate)); // เช็ควันที่ของ order
      return orderDate === today; // ตรวจสอบวันที่ตรงกัน
    })
    .reduce((sum, order) => sum + order.totalAmount, 0); // คำนวณยอดรวม
},

dailyTotalOrders() {
  const today = new Date().setHours(0, 0, 0, 0); // กำหนดเวลาเป็น 0:00
  console.log("Today's date:", new Date(today)); // ตรวจสอบค่า today

  return this.salesData.filter((order) => {
    const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0); // แปลงวันที่ของ order เป็น 0:00
    console.log("Order date:", new Date(orderDate)); // ตรวจสอบวันที่ของ order
    return orderDate === today; // ตรวจสอบวันที่ตรงกัน
  }).length;
},
  totalSales() {
    return this.salesData.reduce((sum, order) => sum + order.totalAmount, 0);
  },
  totalOrders() {
    return this.salesData.length;
  },
},
    methods: {
      async fetchSales() {
        try {
          const response = await axios.get("http://localhost:3000/api/v1/orders");
          if (
            response.status === 200 &&
            response.data.message === "รายการขายตามหมายเลขบิล"
          ) {
            this.salesData = response.data.data.map((order) => ({
              billId: order._id,
              totalAmount: order.totalAmount,
              products: order.products,
              createdAt: order.createdAt,
            }));
          }
        } catch (error) {
          console.error("Error fetching sales:", error);
        }
      },
      renderSalesChart() {
        const ctx = document.getElementById("salesChart").getContext("2d");
        const salesDates = this.dailySales.map((sale) => sale.date);
        const salesAmounts = this.dailySales.map((sale) => sale.total);
  
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: salesDates,
            datasets: [
              {
                label: "ยอดขายรวม (บาท)",
                data: salesAmounts,
                backgroundColor: "#1976d2",
                borderColor: "#0d47a1",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    //   handlePrint(billId) {
    //     window.print();
    //   },
    },
  };
  </script>
  
  <style scoped>
.v-card {
  margin-top: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* เงาคาร์ด */
  border-radius: 12px; /* ขอบมน */
  overflow: hidden; /* ป้องกันไม่ให้เนื้อหาล้น */
}

.v-card:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5); /* เงาเข้มขึ้น */
}

.v-card-title h3,
.v-card-title h2 {
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 1px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 1.8rem; /* ปรับขนาดให้ใหญ่ขึ้น */
}

.v-card-title {
  background: linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC); /* ไล่สีสดใสใหม่ */
  padding: 16px;
  border-radius: 8px 8px 0 0; /* ขอบโค้งมน */
}

.v-card-text h2 {
  font-size: 2.2rem; /* ขนาดใหญ่ขึ้น */
  font-weight: bold;
  color: #444;
  text-align: center;
}

.v-data-table th {
  background-color: #42a5f5;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: 16px 8px;
  border-bottom: 4px solid #1976d2; /* เพิ่มขอบล่าง */
}

.v-data-table td {
  text-align: center;
  padding: 16px 8px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e0e0e0; /* เส้นแบ่งระหว่างแต่ละบรรทัด */
}

/* สินค้า */
.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 2px dashed #ffffff;
  padding-bottom: 12px;
}

.product-item:hover {
  transform: translateX(10px); /* ขยับเล็กน้อยเมื่อ hover */
}

.product-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 50%;
  border: 3px solid #a6a6a6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: bold;
  color: #f50057;
  font-size: 1.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.product-quantity,
.product-price {
  color: #555;
  font-size: 1rem;
  margin-top: 5px;
}

.product-price {
  color: #000000; /* เปลี่ยนสีราคาสินค้า */
}

.v-row {
  margin-bottom: 20px;
}

/* ปุ่ม */
.v-btn {
  background-color: #ff4081;
  color: white;
  font-weight: bold;
}

.v-btn:hover {
  background-color: #f50057;
}
.chart-container {
  position: relative;
  width: 100%; /* ตั้งให้เป็น 100% ของพื้นที่ที่คาร์ดกำหนด */
  max-width: 400px; /* กำหนดความกว้างสูงสุดให้แสดงกราฟที่ขนาดเหมาะสม */
  margin: 0 auto; /* ตั้งกราฟให้อยู่ตรงกลาง */
}

#salesChart {
  width: 100%;
  height: auto; /* ให้ความสูงปรับตามสัดส่วนของความกว้าง */
}

  </style>
  