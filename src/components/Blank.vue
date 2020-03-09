<template>
  <div class="blank"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Blank extends Vue {
  @Prop() private msg!: string;
}
</script>
