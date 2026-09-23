import * as pomodoroApi from "../pomodoroApi";
import * as webPushClient from "../webPushClient";
import * as matrixSseClient from "../matrixSseClient";

export type AppContainer = {
  pomodoroApi: typeof pomodoroApi;
  webPushClient: typeof webPushClient;
  matrixSseClient: typeof matrixSseClient;
};

export const container: AppContainer = {
  pomodoroApi,
  webPushClient,
  matrixSseClient,
};
