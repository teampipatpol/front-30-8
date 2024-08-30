<template>
  <v-app>
    <v-container class="text-center">
      <h1 class="page-title">ตัดเกรด</h1>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="elevation-2 pa-4">
            <v-card-title>
              <h2 class="card-title">กรอกคะแนน</h2>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="คะแนน"
                v-model="score"
                type="number"
                @input="clearResult"
                class="input-field"
              ></v-text-field>
              <v-btn @click="calculateGrade" color="primary" class="mt-4">คำนวณเกรด</v-btn>
              <v-alert
                v-if="message"
                :type="alertType"
                dismissible
                class="mt-4"
              >
                {{ message }}
              </v-alert>
            </v-card-text>
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
      score: '',
      message: '',
      alertType: ''
    };
  },
  methods: {
    calculateGrade() {
      const score = parseInt(this.score, 10);

      if (isNaN(score) || score < 0 || score > 100) {
        this.message = 'กรุณากรอกตัวเลขที่อยู่ในช่วง 0 - 100';
        this.alertType = 'error';
      } else {
        let grade = '';
        if (score >= 80) {
          grade = 'A';
        } else if (score >= 70) {
          grade = 'B';
        } else if (score >= 60) {
          grade = 'C';
        } else if (score >= 50) {
          grade = 'D';
        } else {
          grade = 'F';
        }
        this.message = `คะแนนที่ได้: ${score}, เกรดที่ได้รับ: ${grade}`;
        this.alertType = 'success';
      }
    },
    clearResult() {
      this.message = '';
      this.alertType = '';
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.input-field {
  margin-top: 20px;
}

.v-card {
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.v-alert {
  border-radius: 5px;
}
</style>
