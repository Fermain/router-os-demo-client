<template>
  <div class="home">
    <div class="row">
      <div class="col-12 col-lg-6 mt-3">
        <stream></stream>
      </div>
      <div class="col-12 col-lg-6 mt-3">
        <system></system>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import System from "@/components/system/Index.vue";
import Stream from "@/components/stream/Index.vue";

@Component({
  components: {
    System,
    Stream
  }
})
export default class Home extends Vue {}
</script>
