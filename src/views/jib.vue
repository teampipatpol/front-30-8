<template>
    <v-app>
        <v-container class="con1">

        <v-btn text>หน้าแรก</v-btn>
        <v-btn text>สินค้า</v-btn>
        <v-btn text>คอมประกอบ/จัดสเปค</v-btn>
        <v-btn text>โปรโมชั่น</v-btn>
        <v-btn text>ตารางราคา</v-btn>
        <v-btn text>เงื่อนไขการนำส่ง</v-btn>
        <v-btn text>แนะนำการบริการ</v-btn>
        <v-btn text>ติดต่อเรา</v-btn>
        </v-container>

      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card outlined>
              <v-row>
                <v-col cols="12" md="4">
                  <v-img :src="image" alt="Product Image"></v-img>
                </v-col>
  
                <v-col cols="12" md="8">
                  <v-card-title class="text-h6">
                    {{ title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ subtitle }}
                  </v-card-subtitle>
  
                  <v-divider></v-divider>
  
                  <v-row>
                    <v-col>
                      <div class="text-h4 text--primary">
                        {{ price }} บาท
                      </div>
                      <div class="text-caption">
                        รับประกัน {{ warranty }}
                      </div>
                    </v-col>
                  </v-row>
  
                  <v-divider></v-divider>
  
                  <v-card-actions>
                    <v-btn text color="primary">สินค้าหมดชั่วคราว</v-btn>
                    <v-btn outlined color="secondary">ผ่อนชำระ 0%</v-btn>
                  </v-card-actions>
  
                  <v-card-actions>
                    <v-btn icon color="red">
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                    <span>WISHLIST</span>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: "MONITOR (จอมอนิเตอร์) LG ULTRAWIDE 29WK600-W - 29\" IPS FHD 75Hz FREESYNC",
        subtitle: "(#1449055037)",
        price: "6,200",
        warranty: "3 - Y",
        image: "https://your-image-source.jpg", 
      };
    },
  };
  </script>
  
  <style scoped>
  .text-h4 {
    color: red;
  }
  .v-app-bar{
    background-color: rgb(126, 126, 0);
  }
  .con1{
    background-color: rgb(255, 255, 255);
    height: 20px;
    padding-bottom: 50px;
  }
  </style>
  