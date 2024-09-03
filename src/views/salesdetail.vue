<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>ข้อมูลการขาย</h2>
      </v-card-title>
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
              :src="
                `http://localhost:3000/${product.image}` ||
                'https://via.placeholder.com/150'
              "
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
import axios from "axios";
import Swal from "sweetalert2";

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
    };
  },
  async created() {
    await this.fetchSales();
  },
  computed: {
    filteredSalesData() {
      return this.salesData.filter(order => 
        !order.products.some(product => product.status === 'returned')
      );
    },
  },
  methods: {
    async handleReturn(billId) {
      console.log(`Handling return for billId: ${billId}`);

      try {
        const order = this.salesData.find((item) => item.billId === billId);
        if (!order) {
          console.error("Error: Order not found");
          return;
        }

        const productBillId = order.products.length > 0 ? order.products[0].billId : null;
        if (!productBillId) {
          console.error("Error: No valid product.billId found");
          return;
        }

        const returnedItems = order.products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        }));

        console.log("Returned items:", returnedItems);

        const response = await axios.post(
          `http://localhost:3000/api/v1/products/orders/${productBillId}/return`,
          { returnedItems }
        );

        console.log("Return successful:", response.data);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'คืนสินค้าเรียบร้อยแล้ว !',
        });

        await this.fetchSales();
      } catch (error) {
        console.error(
          "Error processing return:",
          error.response ? error.response.data : error.message
        );

        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถคืนสินค้าได้',
          text: 'เกิดข้อผิดพลาด',
        });
      }
    },
    handlePrint(billId) {
      console.log(`Print button clicked for billId: ${billId}`);
      window.print();
    },
    async fetchSales() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/orders");
        console.log("API response:", response.data);

        if (response.status === 200 && response.data.message === "รายการขายตามหมายเลขบิล") {
          this.salesData = response.data.data.map((order) => ({
            billId: order._id, 
            totalAmount: order.totalAmount,
            products: order.products,
          }));
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
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
