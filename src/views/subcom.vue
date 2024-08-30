<template>
  <div>
    <h1>component zone</h1>
    <h1>{{ name }}</h1>
    <v-btn color="success" @click="callMain()">callmain</v-btn>
  </div>
</template>

<script>
import {EventBus} from '@/evenbus'
export default {
    props:[
        'name'
    ],
    methods:{
        callMain(){
           // this.$emit('callAlert')
           EventBus.$emit('callalertparam','ไก่')
        }
    },

}
</script>

<style>

</style>