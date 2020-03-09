<template>
  <div class="ping-speed">
    <h5>Ping Speed</h5>
    <p>
      Streams the
      <code>/tool ping-speed</code> api response. Returns a throughput
      estimation in <code>bps</code>, presented here in <code>kbps</code> and
      <code>mbps</code> for brevity. Documentation available
      <a
        target="blank"
        href="https://mikrotik.com/testdocs/ros/2.9/tools/speed.php"
        >here</a
      >.
    </p>
    <div class="ping-speed-test">
      <form @submit.prevent="pingSpeed" class="mb-3">
        <b-input-group size="sm" prepend="Address" class="mb-3">
          <b-form-input
            name="address"
            v-model="address"
            type="text"
          ></b-form-input>
          <b-input-group-prepend>
            <div class="input-group-text">Limit:</div>
          </b-input-group-prepend>
          <b-form-input
            name="n"
            v-model="n"
            type="number"
            min="1"
            max="100"
            step="1"
            aria-placeholder="Limit"
            placeholder="limit"
            class="input-limit"
          ></b-form-input>
          <b-input-group-append>
            <b-button type="submit" variant="outline-dark"
              >/tool {{ command }}</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <b-row class="align-items-center">
          <b-col>
            <b-form-checkbox
              v-model="direct"
              :state="direct ? true : null"
              name="check-button"
              switch
            >
              Connection:
              <b>{{ direct ? "Device" : "Database" }}</b>
            </b-form-checkbox>
          </b-col>
          <b-col cols="auto">
            <b-button size="sm" variant="warning" type="button" @click="reset"
              >Reset</b-button
            >
          </b-col>
        </b-row>
      </form>

      <b-alert class="mb-3 mb-0 d-flex justify-content-between" :show="loading">
        <div class="d-flex align-items-center">
          <b-spinner variant="primary" label="Spinning" class="mr-3" />
          <p class="m-0">Loading...</p>
        </div>
      </b-alert>

      <div
        class="ping-speed-test-results"
        v-if="lastAddress && filteredResponse.length"
      >
        <b-table
          table-variant="dark"
          small
          striped
          class="ping-test-results mt-3 rounded-lg overflow-hidden"
          :fields="tableFields"
          :items="filteredResponse"
        >
          <template v-slot:cell(kbps)="data"
            >{{ (data.item.current / 1000).toFixed(0) }}kbps</template
          >
          <template v-slot:cell(mbps)="data"
            >{{ (data.item.current / 1000 / 1000).toFixed(2) }}mbps</template
          >
        </b-table>
      </div>

      <error-card :error="error"></error-card>

      <b-alert :show="noResults" variant="warning">
        No matching records were found for
        <kbd>/tool {{ command }}</kbd> at address <kbd>{{ lastAddress }}</kbd
        >.
      </b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouterOSService } from "../../../services/routerOS/routerOS.service";
import {
  BandwidthPacket,
  BandwidthTest,
  PingTestPacket
} from "../../../../common/routerOS";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import ErrorCard from "../../error/ErrorCard.vue";

@Component({
  components: {
    ErrorCard
  }
})
export default class PingSpeed extends Vue {
  @Prop() private routerOSService!: RouterOSService;

  private stream!: Observable<unknown>;
  public n = 30;

  public response: any[] = [];
  public error: AxiosResponse = {} as AxiosResponse;

  public direct = false;
  public address = "8.8.8.8";
  public lastAddress = "";
  public loading = false;

  public command = "ping-speed";

  public tableFields = [
    {
      key: ".section",
      label: "#"
    },
    {
      key: "kbps",
      label: "Throughput (kbps)"
    },
    {
      key: "mbps",
      label: "(mbps)"
    }
  ];

  public async pingSpeed() {
    this.reset();
    this.loading = true;
    try {
      this.stream = await this.routerOSService.stream.tool(
        this.command,
        this.address,
        this.n,
        this.direct
      );

      this.stream.subscribe(
        (chunk: any) => {
          this.response.push(chunk);
          if (this.response.length) {
            this.loading = false;
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
      this.lastAddress = this.address;
    } catch (error) {
      this.error = error;
    }
  }

  public reset() {
    this.loading = false;
    this.response = [];
    this.error = {} as AxiosResponse;
    this.lastAddress = "";
  }

  public get noResults() {
    return (
      !this.loading &&
      this.filteredResponse.length === 0 &&
      this.lastAddress.length > 0
    );
  }

  public get filteredResponse() {
    try {
      return this.response
        .map((chunk: any) => {
          return {
            ...chunk,
            section: chunk.section || chunk[".section"]
          };
        })
        .filter((packet: BandwidthPacket) => {
          return packet.section || packet[".section"];
        })
        .slice(0, this.n);
    } catch {
      return [];
    }
  }
}
</script>
