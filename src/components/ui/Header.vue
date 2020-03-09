<template>
  <b-navbar
    sticky
    toggleable="lg"
    type="dark"
    variant="white"
    class="ui-header shadow-sm"
  >
    <b-navbar-brand href="/" class="text-fermain">
      <pangol-component class="w-100"></pangol-component>
    </b-navbar-brand>
  </b-navbar>
</template>

<script>
import PangolComponent from "../../assets/pangol.component.svg";

export default {
  components: {
    PangolComponent
  }
};
</script>
