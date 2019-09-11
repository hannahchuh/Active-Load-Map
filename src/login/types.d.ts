export type PlatformLoadState =
  | "platformUnloaded"
  | "platformLoading"
  | "platformLoadSuccess"
  | "platformLoadFailure";

export type Auth2LoadState =
  | "auth2Unloaded"
  | "auth2Loading"
  | "auth2Initing"
  | "auth2LoadSuccess"
  | "auth2LoadFailure";

export interface GoogleLoginState {
  loadingPlatform: PlatformLoadState;
  loadingAuth2: Auth2LoadState;
}

export interface LoadPlatformStart {
  type: "loadPlatformStart";
}

export interface LoadPlatformSuccess {
  type: "loadPlatformSuccess";
}

export interface LoadPlatformFailure {
  type: "loadPlatformFailure";
}

export interface LoadAuth2Start {
  type: "loadAuth2Start";
}

export interface LoadAuth2Init {
  type: "loadAuth2Init";
}

export interface LoadAuth2Success {
  type: "loadAuth2Success";
}

export interface LoadAuth2Failure {
  type: "loadAuth2Failure";
}

export type GoogleLoginAction =
  | LoadPlatformStart
  | LoadPlatformSuccess
  | LoadPlatformFailure
  | LoadAuth2Start
  | LoadAuth2Init
  | LoadAuth2Success
  | LoadAuth2Failure;

interface GoogleUser {
  email: string;
  name: string;
}
