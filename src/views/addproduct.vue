<template>
    <div class="product-management">
      <h1>จัดการสินค้า</h1>
      <button class="add-product-btn" @click="showAddProduct">เพิ่มสินค้า</button>
  
      <div class="dropdown-filter">
        <label for="filter">กรองสินค้า:</label>
        <select id="filter" v-model="filter" @change="filterProducts">
          <option value="all">ทั้งหมด</option>
          <option value="available">สินค้าพร้อมขาย</option>
          <option value="outOfStock">สินค้าหมด</option>
        </select>
      </div>
  
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product._id" class="product-item">
          <img :src="product.image ? `http://localhost:3000/${product.image}` : 'https://via.placeholder.com/150'" alt="Product Image" class="product-image">
          <div class="product-details">
            <h3>{{ product.name }}</h3>
            <p>ราคา: {{ product.price }} บาท</p>
            <p>จำนวนสินค้า: {{ product.stock }}</p>
            <p>รายละเอียดสินค้า: {{ product.details }}</p>
            <button class="edit-btn" @click="editProduct(product)">แก้ไข</button>
            <button class="delete-btn" @click="deleteProduct(product._id)">ลบ</button>
          </div>
        </div>
      </div>
  
      <!-- Add Product Modal -->
      <div v-if="showAdd" class="modal">
        <h2>เพิ่มสินค้า</h2>
        <input v-model="newProduct.name" placeholder="ชื่อสินค้า">
        <input v-model="newProduct.price" type="number" placeholder="ราคาสินค้า">
        <input v-model="newProduct.stock" type="number" placeholder="จำนวนสินค้า">
        <input v-model="newProduct.details" placeholder="รายละเอียดสินค้า">
        <input type="file" ref="imageInput" @change="handleImageUpload" placeholder="รูปสินค้า">
        <button class="add-btn" @click="addProduct">เพิ่ม</button>
        <button class="cancel-btn" @click="closeAddProduct">ยกเลิก</button>
      </div>
  
      <!-- Edit Product Modal -->
      <div v-if="showEdit" class="modal">
        <h2>แก้ไขสินค้า</h2>
        <input v-model="editProductData.name" placeholder="ชื่อสินค้า">
        <input v-model="editProductData.price" type="number" placeholder="ราคาสินค้า">
        <input v-model="editProductData.stock" type="number" placeholder="จำนวนสินค้า">
        <textarea v-model="editProductData.details" placeholder="รายละเอียดสินค้า"></textarea>
        <input type="file" @change="handleImageUploadEdit" placeholder="รูปสินค้า">
        <button class="update-btn" @click="updateProduct">อัพเดท</button>
        <button class="cancel-btn" @click="closeEditProduct">ยกเลิก</button>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        products: [],
        showAdd: false,
        showEdit: false,
        newProduct: { name: '', price: '', stock: 1, details: '', image: '' },
        editProductData: { _id: null, name: '', price: '', stock: 1, details: '', image: '' },
        filter: 'all', // Default filter
      };
    },
    computed: {
      filteredProducts() {
        switch (this.filter) {
          case 'available':
            return this.products.filter(product => product.stock > 0);
          case 'outOfStock':
            return this.products.filter(product => product.stock <= 0);
          default:
            return this.products; // 'all'
        }
      },
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await fetch('http://localhost:3000/api/v1/products');
          const result = await response.json();
          if (response.ok && result.status === 200 && result.message === 'success') {
            this.products = result.data;
          } else {
            console.error('Unexpected API response:', result);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      showAddProduct() {
        this.showAdd = true;
      },
      closeAddProduct() {
        this.showAdd = false;
        this.resetNewProduct();
      },
      resetNewProduct() {
        this.newProduct = { name: '', price: '', stock: 1, details: '', image: '' };
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.newProduct.image = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      async addProduct() {
        const formData = new FormData();
        formData.append('name', this.newProduct.name);
        formData.append('price', this.newProduct.price);
        formData.append('stock', this.newProduct.stock);
        formData.append('details', this.newProduct.details);
        formData.append('image', this.$refs.imageInput.files[0]); // Add the image file
  
        try {
          const response = await fetch('http://localhost:3000/api/v1/products', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (response.ok && result.status === 200) {
            this.products.push(result.data);
            this.closeAddProduct();
            Swal.fire( 'เพิ่มสินค้าสำเร็จ', 'success');
          } else {
            Swal.fire('Error', 'Error adding product: ' + result.message, 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error adding product: ' + error.message, 'error');
        }
      },
      editProduct(product) {
        this.editProductData = { ...product };
        this.showEdit = true;
      },
      closeEditProduct() {
        this.showEdit = false;
        this.resetEditProductData();
      },
      resetEditProductData() {
        this.editProductData = { _id: null, name: '', price: '', stock: 1, details: '', image: '' };
      },
      handleImageUploadEdit(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.editProductData.image = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      async updateProduct() {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/products/${this.editProductData._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editProductData),
          });
          const result = await response.json();
          if (response.ok && result.status === 200) {
            const index = this.products.findIndex(p => p._id === this.editProductData._id);
            if (index !== -1) {
              this.products.splice(index, 1, result.data);
              this.closeEditProduct();
              Swal.fire('อัพเดทสินค้าสำเร็จ', 'success');
            }
          } else {
            Swal.fire('Error', 'Error updating product: ' + result.message, 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error updating product: ' + error.message, 'error');
        }
      },
      async deleteProduct(id) {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (response.ok && result.status === 200) {
            this.products = this.products.filter(p => p._id !== id);
            Swal.fire( 'ลบสินค้าสำเร็จ', 'success');
          } else {
            Swal.fire('Error', 'Error deleting product: ' + result.message, 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error deleting product: ' + error.message, 'error');
        }
      },
      filterProducts() {
        this.filter = this.$refs.filterDropdown.value;
      },
    },
  };
  </script>
  
  
  <style>
.product-management {
  margin: 20px;
  font-family: 'Sarabun', sans-serif; 
  color: #333;
}

h1 {
  text-align: center;
  color: #2c3e50; 
  margin-bottom: 30px; 
}

.add-product-btn {
  display: block;
  margin: 0 auto 30px auto;
  padding: 12px px;
  background-color: #1abc9c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50px; 
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.add-product-btn:hover {
  background-color: #16a085; 
}

.dropdown-filter {
  margin: 20px 0 30px 0;
  text-align: center;
}

.dropdown-filter select {
  padding: 10px;
  border-radius: 50px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
  gap: 20px;
  margin-top: 20px;
}

.product-item {
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #f9f9f9; 
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s; 
}

.product-item:hover {
  transform: translateY(-5px); 
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 15px;
  border-radius: 10px;
}

.product-details {
  text-align: center;
}

.product-details h3 {
  margin: 0;
  font-size: 1.4em;
  color: #34495e; 
}

.product-details p {
  margin: 5px 0;
  color: #7f8c8d;
}

button {
  margin-top: 10px;
  width: 120px;
  height: 45px;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 25px; 
  font-size: 14px;
  transition: background-color 0.3s; 
}

.edit-btn {
  background-color: #3498db;
}

.edit-btn:hover {
  background-color: #2980b9; 
}

.delete-btn {
  background-color: #e74c3c;
}

.delete-btn:hover {
  background-color: #c0392b; 
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  z-index: 1000;
  width: 400px;
}

.modal h2 {
  margin-bottom: 20px;
  color: #2c3e50; 
}

.modal input,
.modal textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px; 
  font-size: 16px; 
}

.add-btn {
  background-color: #27ae60;
}

.add-btn:hover {
  background-color: #229954; 
}

.cancel-btn {
  background-color: #95a5a6;
}

.cancel-btn:hover {
  background-color: #7f8c8d; 
}

.update-btn {
  background-color: #3498db;
}

.update-btn:hover {
  background-color: #2980b9; 
}
  </style>
  