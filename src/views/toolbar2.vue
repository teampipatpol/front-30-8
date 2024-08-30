<template>
    <v-app>
      <v-app-bar app color="#2c3e8e" dark>
      <v-toolbar-title>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrSIaLJ1MzP3V3F1P5eyac-F_VpjUxDcYNew&s"  height="50" />
      </v-toolbar-title>
  
      <v-spacer></v-spacer>
      <v-text-field
      class="search"
        v-model="searchQuery"
        label="ค้นหาสินค้าอะไรดี ?"
        solo-inverted
        hide-details
        color="white"
      ></v-text-field>
  
      <v-select
      class="select"
        v-model="selectedCategory"
        :items="categories"
        label="หมวดหมู่สินค้า"
        solo-inverted
        hide-details
        color="white"
      ></v-select>
  
      <v-btn class="btnsearch" @click="search" color="#ff6600">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
  
      <v-spacer></v-spacer>
  
      <v-btn icon>
        <v-icon>mdi-cart</v-icon>
        <v-badge content="0" color="orange" overlap></v-badge>
      </v-btn>
      <span>ตะกร้าสินค้า</span>
  
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <span>บัญชีของฉัน</span>
  
      <v-btn text>ไทย</v-btn> | <v-btn text>อังกฤษ</v-btn>
    </v-app-bar>
  
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "",
        selectedCategory: null,
        categories: ["หมวดหมู่ 1", "หมวดหมู่ 2", "หมวดหมู่ 3"],
      };
    },
    methods: {
      search() {
        // ฟังก์ชันค้นหาสินค้า
        console.log(
          "ค้นหา:",
          this.searchQuery,
          "หมวดหมู่:",
          this.selectedCategory
        );
      },
    },
  };
  </script>
  
  <style>
  /* .btnsearch{
    background-color: #1b44da;
    
  } */
  .search{
    width: 450px;
    color:#eeeeee !important
  }
  .select{
    background-color: #7f7f7f;
    width: 50px;
  }
  .v-application {
    background: url("https://source.unsplash.com/random/1600x900") no-repeat
      center center fixed;
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
  
  .test {
    height: 80px !important;
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