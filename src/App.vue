<template>
  <div id="app" class="app bg-dark d-flex flex-column">
    <ui-header></ui-header>
    <main class="container-fluid pb-3 bg-dark">
      <router-view></router-view>
    </main>
    <ui-footer></ui-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UiHeader from "@/components/ui/Header.vue";
import UiFooter from "@/components/ui/Footer.vue";

@Component({
  components: {
    UiHeader,
    UiFooter
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
$COL_FERMAIN: #121618;

.app {
  min-height: 100vh;
}

main {
  z-index: 2;
  position: relative;
  flex: 1;
}

.text {
  &-fermain {
    color: $COL_FERMAIN !important;
  }
}

.bg {
  &-fermain {
    background-color: $COL_FERMAIN !important;
  }
}

.ui {
  &-header {
    .navbar-brand {
      max-width: 2rem;
    }
  }

  &-footer {
    bottom: 0;
    z-index: 1;

    .navbar-brand {
      max-width: 4rem;
    }
  }
}

.card {
  &-body {
    &:empty {
      display: none;
    }
  }
}

.input {
  &-limit {
    flex: 0 0 5rem !important;
  }
}
</style>
