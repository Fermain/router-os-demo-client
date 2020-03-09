<template>
  <b-card
    header="Supported streaming commands"
    header-class="bg-fermain text-white"
  >
    <b-card-text>
      <p>
        These methods get and return a json data stream of results based on a
        given query with a continous response.
      </p>
      <p>
        With device mode activated, results will be collected from the device
        and streamed to the client.
      </p>
      <p>
        With database mode activated, results will be returned from a remote
        MongoDB instance.
      </p>
    </b-card-text>
    <ping-speed :routerOSService="routerOSService"></ping-speed>
    <speed-test :routerOSService="routerOSService"></speed-test>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PingSpeed from "./ping-speed/PingSpeed.vue";
import SpeedTest from "./speed-test/SpeedTest.vue";

import { RouterOSService } from "../../services/routerOS/routerOS.service";
import { API_HOSTNAME } from "../../routerOSClient.config";

@Component({
  components: {
    PingSpeed,
    SpeedTest
  }
})
export default class Stream extends Vue {
  public routerOSService = new RouterOSService(API_HOSTNAME);
}
</script>
