<template>
  <div class="ping-speed">
    <h5>Speed Test</h5>
    <p>
      Streams the
      <code>/tool speed-test</code> api response. Returns a roundtrip estimation
      in <code>ms</code>. Documentation available
      <a
        target="blank"
        href="https://wiki.mikrotik.com/wiki/Manual:Tools/Speed_Test"
        >here</a
      >.
    </p>
    <div class="speed-test-test">
      <form @submit.prevent="streamTest">
        <b-input-group size="sm" prepend="Address" class="mb-3">
          <b-form-input v-model="address" type="text"></b-form-input>
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

      <b-alert class="mt-3 mb-0 d-flex justify-content-between" :show="loading">
        <div class="d-flex align-items-center">
          <b-spinner variant="primary" label="Spinning" class="mr-3" />
          <p class="m-0">Loading...</p>
        </div>
      </b-alert>
      <div
        class="speed-test-test-results"
        v-if="filteredResponse && filteredResponse.length"
      >
        <b-table
          table-variant="dark"
          small
          striped
          borderless
          class="ping-test-results mt-3 rounded-lg overflow-hidden"
          :fields="tableFields"
          :items="filteredResponse"
        >
          <template v-slot:cell(lossPercent)="data">{{
            (data.item.loss ? data.item.loss : "").split(" ")[0]
          }}</template>
        </b-table>
      </div>

      <error-card class="mb-3" :error="error"></error-card>

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
import { PingTestPacket, BandwidthTest } from "../../../../common/routerOS";
import { RouterOSService } from "../../../services/routerOS/routerOS.service";
import { AxiosResponse } from "axios";
import ErrorCard from "../../error/ErrorCard.vue";
import { Observable } from "rxjs";

@Component({
  components: {
    ErrorCard
  }
})
export default class SpeedTest extends Vue {
  @Prop() private routerOSService!: RouterOSService;
  private stream!: Observable<unknown>;

  public response: any[] = [];
  public error: AxiosResponse = {} as AxiosResponse;

  public direct = false;
  public address = "8.8.8.8";
  public lastAddress = "";
  public loading = false;

  public command = "speed-test";

  public tableFields = [
    {
      key: ".section",
      label: "#"
    },
    {
      key: "status"
    },
    {
      key: "jitterMinAvgMax",
      label: "jitter: Avg/Min/Max"
    },
    {
      key: "pingMinAvgMax",
      label: "Ping: Avg/Min/Max"
    },
    {
      key: "timeRemaining",
      label: "Time Remaining"
    },
    {
      key: "lossPercent",
      label: "Loss"
    }
  ];

  public async streamTest() {
    this.reset();
    this.loading = true;
    try {
      this.stream = await this.routerOSService.stream.tool(
        this.command,
        this.address,
        undefined,
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

  public get noResults() {
    return (
      !this.loading && this.response.length === 0 && this.lastAddress.length
    );
  }

  public reset() {
    this.loading = false;
    this.response = [];
    this.error = {} as AxiosResponse;
    this.lastAddress = "";
  }

  public get filteredResponse() {
    try {
      return this.response
        .map((chunk: any) => {
          return {
            section: chunk.section || chunk[".section"],
            jitterMinAvgMax:
              chunk.jitterMinAvgMax || chunk["jitter-min-avg-max"],
            pingMinAvgMax: chunk.pingMinAvgMax || chunk["ping-min-avg-max"],
            timeRemaining: chunk.timeRemaining || chunk["time-remaining"],
            loss: chunk.loss
          } as PingTestPacket;
        })
        .filter((packet: PingTestPacket) => {
          return packet.section;
        });
    } catch {
      return [];
    }
  }
}
</script>
