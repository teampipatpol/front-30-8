<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>บัญชีที่รออนุมัติ</h2>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="unapprovedUsers"
        item-key="_id"
        class="elevation-1"
      >
        <template v-slot:[`item.name`]="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="success" @click="approveUser(item._id)" class="mr-2">
            อนุมัติบัญชี
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      users: [],
      headers: [
        { text: 'ชื่อผู้ใช้', value: 'name' },
        { text: 'ดำเนินการ', value: 'actions' }
      ]
    };
  },
  computed: {
    unapprovedUsers() {
      return this.users.filter(user => user.status !== 'approved' && user.status !== 'Admin');
    },
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:3000/api/v1')
        .then(response => {
          this.users = response.data.data;
        })
        .catch(error => {
          console.error(error);
          Swal.fire('Error', 'Failed to fetch users', 'error');
        });
    },
    approveUser(userId) {
      axios.put(`http://localhost:3000/api/v1/approve/${userId}`)
        .then(() => {
          this.fetchUsers(); 
          Swal.fire('อนุมัติเสร็จสิ้น', 'success');
        })
        .catch(error => {
          console.error(error);
          Swal.fire('Error', 'อนุมัติไม่สำเร็จ', 'error');
        });
    },
  },
};
</script>

<style scoped>
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
