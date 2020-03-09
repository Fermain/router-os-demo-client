<template>
  <footer
    class="ui-footer bg-fermain text-white position-relative position-sticky"
  >
    <div class="container-fluid">
      <div class="w-100 d-flex justify-content-center py-5">
        <b-navbar-brand href="#" class="text-white">
          <pangol-component class="w-100"></pangol-component>
        </b-navbar-brand>
      </div>
    </div>
  </footer>
</template>

<script>
import PangolComponent from "../../assets/pangol.component.svg";

export default {
  components: {
    PangolComponent
  }
};
</script>
