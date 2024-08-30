<template>
    <v-container>
      <v-card>
        <v-data-table
  :headers="headers"
  :items="items"
  class="elevation-1"
>
  <template v-slot:[`item.actions`]="{ item }">
    <v-btn color="primary" @click="editItem(item)">แก้ไข</v-btn>
    <v-btn color="error" @click="deleteItem(item)">ลบ</v-btn>
  </template>
</v-data-table>

        
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'NewPage',
    data() {
      return {
        headers: [
          { text: 'ชื่อ', value: 'name' },
          { text: 'อายุ', value: 'age' },
          { text: 'อีเมล', value: 'email' },
          { text: 'การจัดการ', value: 'actions', sortable: false }, 

        ],
        items: [
          { name: 'team1', age: 30, email: 'team1' },
          { name: 'team1', age: 25, email: 'team1' },
          { name: 'team1', age: 35, email: 'team1' },
        ],
      };
    },
    editItem(item) {
    alert(`แก้ไขข้อมูลของ ${item.name}`);
  },
  deleteItem(item) {
    alert(`ลบข้อมูลของ ${item.name}`);
  },

  };
  </script>
    <style scoped>
  </style>
  