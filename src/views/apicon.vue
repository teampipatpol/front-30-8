<template>
    <div>
      <h1>API</h1>
      <v-row>
        <v-col col="12">
          <v-btn color="success" @click="newItem">New Item</v-btn>
        </v-col>
        <v-col cols="3" v-for="(item, index) in apidata" :key="index">
          <v-card width="300">
            <v-img
              width="300"
              src="https://www.matichon.co.th/wp-content/uploads/2021/09/cocker-spaniel-2785074_1920.jpg"
            >
              <v-card-title primary-title>
                {{ item.name }}
              </v-card-title>
              <v-card-actions>
                <v-btn color="success" @click="editItem(item)">Edit</v-btn>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialogedit" max-width="500px">
        <v-card>
          <v-card-title>{{ savemode }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col col="6">
                <v-text-field
                  name="name"
                  label="Name"
                  id="name"
                  v-model="postdata.name"
                ></v-text-field>
              </v-col>
              <v-col col="6">
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  v-model="postdata.password"
                  type="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="closeItem">Cancel</v-btn>
            <v-btn text color="primary" @click="saveSelect">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        id: "",
        apidata: [],
        dialogedit: false,
        postdata: {
          name: "",
          password: "",
        },
        postdefault: {
          name: "",
          password: "",
        },
      };
    },
    created() {
      this.setToken();
      if (localStorage.getItem("Token")) {
        this.getData();
      }
    },
    computed: {
      savemode() {
        return this.id ? "Edit Item" : "New Item";
      },
    },
    methods: {
      newItem() {
        this.id = "";
        this.postdata = { ...this.postdefault };
        this.dialogedit = true;
      },
      editItem(item) {
        this.id = item._id;
        this.postdata = { ...item };
        this.dialogedit = true;
      },
      closeItem() {
        this.id = "";
        this.postdata = { ...this.postdefault };
        this.dialogedit = false;
      },
      async saveSelect() {
        try {
          if (this.id) {
            await this.savePutData();
          } else {
            await this.savePostData();
          }
        } catch (error) {
          console.error(error);
          alert("An error occurred while saving the item.");
        }
      },
      setToken() {
        localStorage.setItem("Token", "your-token-here"); 
      },
      getData() {
        axios
          .get("http://localhost:3000/api/v1", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          })
          .then((response) => {
            this.apidata = response.data.data;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      async savePostData() {
        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/v1/register",
            this.postdata,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
              },
            }
          );
          console.log(data);
          alert("Item created successfully");
          this.getData();
          this.closeItem();
        } catch (error) {
          console.error(error);
          alert("Failed to create item");
        }
      },
      async savePutData() {
        try {
          const { data } = await axios.put(
            `http://localhost:3000/api/v1/users/${this.id}`,
            this.postdata,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
              },
            }
          );
          console.log(data);
          alert("Item updated successfully");
          this.getData();
          this.closeItem();
        } catch (error) {
          console.error(error);
          alert("Failed to update item");
        }
      },
    },
  };
  </script>
    
  <style>
  /* Add any custom styles here */
  </style>
  