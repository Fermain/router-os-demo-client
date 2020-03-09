<template>
  <b-card
    class="error-card"
    borderless
    bg-variant="default"
    border-variant="danger"
    :header="header"
    header-bg-variant="danger"
    header-text-variant="white"
    v-if="(error && header) || error.statusCode"
  >
    <b-alert variant="warning" show class="mb-0">
      <ul v-if="errors.length > 0" class="mb-0">
        <li v-for="(err, index) in errors" :key="index">
          {{ err.msg }}
          <ul v-if="err.param">
            <li>Location: {{ err.location }}</li>
            <li>Parameter: {{ err.param }}</li>
            <li>Value: {{ err.value }}</li>
          </ul>
        </li>
      </ul>
      <p class="mb-0" v-else>There was a problem with your request.</p>
    </b-alert>
    <template v-slot:footer>
      <a :href="footer" target="_blank">
        <small class="text-muted">{{ footer }}</small>
      </a>
    </template>
  </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ErrorCard extends Vue {
  @Prop() public error!: any;

  public get header(): string {
    try {
      if ("status" in this.error && "statusText" in this.error) {
        return `${this.error.status}: ${this.error.statusText}`;
      } else {
        if ("statusCode" in this.error) {
          return `Error: ${this.error.statusCode}`;
        }

        const error = this.error as Error;
        return error.message;
      }
    } catch {
      return "Error";
    }
  }

  public get footer(): string {
    try {
      return this.error.config.url as string;
    } catch {
      return "";
    }
  }

  public get errors(): any[] {
    try {
      if ("data" in this.error && "errors" in this.error.data) {
        return [...this.error.data.errors];
      } else {
        if ("jsonBody" in this.error && "errors" in this.error.jsonBody) {
          if ("nestedErrors" in this.error.jsonBody.errors[0]) {
            return [...this.error.jsonBody.errors[0].nestedErrors];
          }
          return [...this.error.jsonBody.errors];
        }
        return [];
      }
    } catch {
      return [];
    }
  }
}
</script>
