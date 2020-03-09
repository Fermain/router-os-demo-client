<template>
  <b-card
    header="Supported system commands"
    header-class="bg-fermain text-white"
  >
    <b-card-text>
      <p>
        These actions represent RouterOS commands that have a synchronous return
        type.
      </p>
      <p>
        With device mode activated, results will be returned directly from the
        client.
      </p>
      <p>
        With database mode activated, results will be returned from a remote
        MongoDB instance.
      </p>
      <p>
        Select a command from the dropdown and click the button to initiate a
        request.
      </p>
    </b-card-text>
    <b-form-checkbox
      v-model="direct"
      :state="direct ? true : null"
      name="check-button"
      class="mb-3"
      switch
    >
      Connection:
      <b>{{ direct ? "Device" : "Database" }}</b>
    </b-form-checkbox>
    <b-dropdown
      ref="dropdown"
      size="sm"
      class="mb-3"
      split
      split-variant="outline-primary"
      variant="primary"
      :text="buttonText"
      menu-class="w-100"
      @click="command ? get(command) : hackClick()"
      :block="true"
    >
      <b-dropdown-item
        href="#"
        v-for="command in commands"
        :key="command"
        @click="selectCommand(command)"
        >{{ command }}</b-dropdown-item
      >
    </b-dropdown>

    <b-alert class="mb-3 mb-0 d-flex justify-content-between" :show="loading">
      <div class="d-flex align-items-center">
        <b-spinner variant="primary" label="Spinning" class="mr-3" />
        <p class="m-0">Loading...</p>
      </div>
    </b-alert>

    <error-card class="mb-3" :error="error"></error-card>

    <div
      class="terminal-inline card text-white bg-dark mb-3"
      v-if="response && response.status"
    >
      <div class="card-header">
        Response: {{ response.status }} {{ response.statusText }}
      </div>
      <div class="card-body">
        <pre class="terminal-output text-light mb-0">{{ terminalOutput }}</pre>
      </div>
      <div class="card-footer">
        <b-button variant="warning" size="sm" @click="reset()">Clear</b-button>
      </div>
    </div>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouterOSService } from "../../services/routerOS/routerOS.service";
import { API_HOSTNAME } from "../../routerOSClient.config";
import { AxiosResponse } from "axios";
import ErrorCard from "../error/ErrorCard.vue";

@Component({
  components: {
    ErrorCard
  }
})
export default class System extends Vue {
  private routerOSService = new RouterOSService(API_HOSTNAME);

  public response = {} as AxiosResponse;
  public error = {} as AxiosResponse;
  public direct = false;

  private domain = "system";

  public commands = [
    "identity",
    "resource",
    "hardware",
    "package",
    "clock",
    "note"
  ];

  public loading = false;

  private command = "";

  public reset() {
    this.command = "";
    this.response = {} as AxiosResponse;
    this.error = {} as AxiosResponse;
  }

  public selectCommand(command: string) {
    this.command = command;
  }

  public get buttonText() {
    return this.command
      ? `get /${this.domain}/${this.command}`
      : "Select command";
  }

  public get terminalOutput(): string {
    try {
      return JSON.stringify(this.response.data, null, 2);
    } catch {
      return "";
    }
  }

  private async getSystemCommand(command: string, direct = false) {
    this.loading = true;
    try {
      const response = await this.routerOSService.system.command(
        command,
        direct
      );
      this.response = response;
      return response;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  public async get(command: string, direct = this.direct) {
    return this.getSystemCommand(command, direct);
  }

  public hackClick() {
    const el = (this.$refs["dropdown"] as any)["$el"];
    const button = el.querySelector(
      "button.dropdown-toggle"
    ) as HTMLButtonElement;
    button.click();
  }
}
</script>
