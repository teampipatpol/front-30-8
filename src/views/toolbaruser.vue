<template>
    <v-app>
      <v-app-bar
        app
        color="transparent"
        elevate-on-scroll
        class="gradient-bar test"
        dark
      >
        <v-spacer></v-spacer>
  
        <v-btn :to="{ name: 'Me' }" text>
          <v-icon left>mdi-account</v-icon>
          Me
        </v-btn>
        <v-btn :to="{ name: 'call' }" text>
          <v-icon left>mdi-calculator</v-icon>
          คำนวณเกรด
        </v-btn>
        <v-btn :to="{ name: 'sell' }" text>
          <v-icon left>mdi-cart</v-icon>
          ขายสินค้า
        </v-btn>
        <v-btn :to="{ name: 'new' }" text>
          <v-icon left>mdi-flask</v-icon>
          ทดสอบ
        </v-btn>
  
        <v-btn v-if="isAdmin" :to="{ name: 'addproduct' }" text>
          <v-icon left>mdi-package-variant-closed</v-icon>
          หน้าจัดการสินค้า
        </v-btn>
        <v-btn v-if="isAdmin" :to="{ name: 'sales' }" text>
          <v-icon left>mdi-chart-bar</v-icon>
          ข้อมูลการขาย
        </v-btn>
        <v-btn v-if="isAdmin" :to="{ name: 'approve' }" text>
          <v-icon left>mdi-check-circle</v-icon>
          อนุมัติบัญชี
        </v-btn>
        <v-btn v-if="isAdmin" :to="{ name: 'salesdetail' }" text>
          <v-icon left>mdi-chart-bar</v-icon>
          ข้อมูลการขาย2
        </v-btn>
  
        <v-spacer></v-spacer>
  
        <span v-if="userName" class="username">{{ userName }}</span>
  
        <v-btn color="error" @click="logout" class="logout-btn">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-app-bar>
  
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "App",
    data() {
      return {
        userName: localStorage.getItem("userName") || "Guest",
        isAdmin: localStorage.getItem("userRole") === "Admin", // Check if the user is an admin
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get("http://localhost:3000/api/v1/approved-users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          // Assuming the API response includes user role or other details
          console.log(response.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole"); // Clear the user role on logout
        this.$router.push({ name: "login" });
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style>
  .v-application {
    background: url("https://source.unsplash.com/random/1600x900") no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .gradient-bar {
    background: linear-gradient(to right, #011672, #1b44da);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .test{
    height: 80px !important
  }
  .v-btn {
    transition: background-color 0.3s, transform 0.3s;
    margin: 0 8px;
    font-weight: bold;
  }
  
  .v-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .v-btn:focus {
    outline: none;
  }
  
  .username {
    font-size: 18px;
    font-weight: bold;
    color: #eeeeee;
    margin-right: 16px;
    
  }
  
  .logout-btn {
    background-color: #f44336 !important;
    color: #ffffff;
  }
  
  .logout-btn:hover {
    background-color: #d32f2f !important;
  }
  
  .v-main {
    flex: 1;
    padding: 16px;
    backdrop-filter: blur(5px);
  }
  
  .v-card {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .v-icon {
    margin-right: 8px;
  }
  </style>
  