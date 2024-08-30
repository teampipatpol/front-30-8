<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row style="text-align: center;" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12" style="padding: 20px; background-color: rgba(255, 255, 255, 0.9);">
            <v-card-title class="text-center">
              <h2>Login</h2>
            </v-card-title>
            <v-card-text>
              <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="name"
                  label="Name"
                  prepend-icon="mdi-account"
                  :rules="nameRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="login">Login</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn :to="{ name: 'registers' }" color="secondary" block>Sign Up</v-btn>
            </v-card-actions>
            <v-card-actions v-if="user">
              <v-chip>Welcome, {{ user.name }}!</v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "LoginPage",
  data() {
    return {
      valid: false,
      name: "",
      password: "",
      error: "",
      user: null,
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
    };
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const response = await fetch("http://localhost:3000/api/v1/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: this.name, password: this.password }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          if (result.status === 200) {
            this.error = "";

            localStorage.setItem("token", result.data.token);
            localStorage.setItem('userName', result.data.user.name); 
            localStorage.setItem('userRole', result.data.user.status);

            this.user = result.data.user || { name: this.name };

            Swal.fire({
              title: "เข้าสู่ระบบ สำเร็จ!",
              text: "ยินดีต้อนรับ " + this.user.name,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              this.$router.push({ name: "sell" });
            });
          } else {
            this.error = result.message || "Login failed";
          }
        } catch (error) {
          this.error = "Error logging in: " + error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.v-application {
  background: url("https://source.unsplash.com/random/1600x900") no-repeat center center fixed;
  background-size: cover;
}

.v-card {
  border-radius: 15px;
}
</style>
