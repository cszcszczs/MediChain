import type { NavigatorScreenParams } from "@react-navigation/native";

export type AppTabParamList = {
  Patient: undefined;
  Professional: undefined;
  History: undefined;
  Permissions: undefined;
};

export type AppstackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<AppTabParamList> | undefined;
};
