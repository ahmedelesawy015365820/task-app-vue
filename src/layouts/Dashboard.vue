<template>
  <div>

    <!-- Header admin -->
    <Header />
    <!-- /Header admin -->

    <!-- Header admin -->
    <Sidebar />
    <!-- /Sidebar admin -->

    <!-- Start::app-content -->
    <div>

      <router-view />

    </div>
    <!-- End::app-content -->

  </div>
</template>

<script setup>

import { defineComponent } from "vue";
import Header from "../components/layout/Header.vue";
import Sidebar from "../components/layout/Sidebar.vue";

defineComponent({
  Header, Sidebar,
});

</script>

