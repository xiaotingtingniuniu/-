<template>
  <div class="home">
     <Header/>
     <AccessoriesList/>
     <Footer/>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "../components/Header"
import AccessoriesList from "../views/AccessoriesList"
import Footer from "../components/Footer"
export default {
  name: "accessoriesList",
  components: {
      Header,
      AccessoriesList,
      Footer
  },
  data() {
    return {
      
    };
  },
  mounted() {
   
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.home{
  position: absolute;
  width:100%;
  top:0;
  height:100%;
}
</style>

