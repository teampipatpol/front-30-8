<template>
    <v-app>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" style="padding: 20px; background-color: rgba(255, 255, 255, 0.9);">
              <v-card-title class="text-center">
                <h2>Sign Up</h2>
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
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="confirmPasswordRules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" block @click="register">Sign Up</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn color="secondary" block @click="goToLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "SignUpPage",
    data() {
      return {
        valid: false,
        name: '',
        password: '',
        confirmPassword: '',
        error: '',
        nameRules: [
          v => !!v || 'Name is required'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters'
        ],
        confirmPasswordRules: [
          v => !!v || 'Confirm Password is required',
          v => v === this.password || 'Passwords must match'
        ]
      };
    },
    methods: {
      async register() {
        if (this.$refs.form.validate()) {
          try {
            const response = await axios.post('http://localhost:3000/api/v1/register', {
              name: this.name,
              password: this.password
            });
  
            if (response.status === 201) {
              this.error = "";
              alert("Registration successful! Please wait for admin approval.");
              this.$router.push('/login');
            }
          } catch (err) {
            if (err.response && err.response.data) {
              this.error = err.response.data.message;
            } else {
              this.error = "An error occurred during registration.";
            }
          }
        }
      },
      goToLogin() {
        this.$router.push('/login');  // Adjust the route as necessary
      }
    }
  };
  </script>
  
  <style scoped>
  .v-application {
    background: url('https://source.unsplash.com/random/1600x900') no-repeat center center fixed;
    background-size: cover;
  }
  
  .v-card {
    border-radius: 15px;
  }
  </style>
  