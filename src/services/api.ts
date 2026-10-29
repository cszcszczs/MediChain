import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "medichain.accessToken";
const USER_PROFILE_KEY = "medichain.userProfile";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

let webAccessToken: string | null = null;
let webUserProfile: StoredUserProfile | null = null;

export interface StoredUserProfile {
  id: string;
  email: string;
  name: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  allowEmptyResponse?: boolean;
}

export async function saveAccessToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    webAccessToken = token;
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return webAccessToken;
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken(): Promise<void> {
  if (Platform.OS === "web") {
    webAccessToken = null;
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function saveUserProfile(
  profile: StoredUserProfile,
): Promise<void> {
  if (Platform.OS === "web") {
    webUserProfile = profile;
    return;
  }

  await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(profile));
}

export async function getUserProfile(): Promise<StoredUserProfile | null> {
  const value =
    Platform.OS === "web"
      ? webUserProfile
      : await SecureStore.getItemAsync(USER_PROFILE_KEY);

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  let profile: unknown;
  try {
    profile = JSON.parse(value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError("El perfil guardado localmente no es válido.");
    }

    throw error;
  }

  if (
    typeof profile !== "object" ||
    profile === null ||
    !("id" in profile) ||
    typeof profile.id !== "string" ||
    !("email" in profile) ||
    typeof profile.email !== "string" ||
    !("name" in profile) ||
    typeof profile.name !== "string"
  ) {
    throw new ApiError("El perfil guardado localmente no es válido.");
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
  };
}

export async function clearUserProfile(): Promise<void> {
  if (Platform.OS === "web") {
    webUserProfile = null;
    return;
  }

  await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
}

function parseJson(text: string, status: number): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(
        "El backend devolvió una respuesta JSON no válida.",
        status,
      );
    }

    throw error;
  }
}

function getServerErrorMessage(payload: unknown, status: number): string {
  if (typeof payload === "object" && payload !== null) {
    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }

    if ("error" in payload && typeof payload.error === "string") {
      return payload.error;
    }
  }

  return `La solicitud falló (${status}).`;
}

export async function apiRequest<T>(
  path: string,
  parseResponse: (payload: unknown) => T,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.local.",
    );
  }

  const {
    authenticated = true,
    allowEmptyResponse = false,
    ...requestInit
  } = options;
  const headers = new Headers(requestInit.headers);
  headers.set("Accept", "application/json");

  if (typeof requestInit.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = await getAccessToken();
    if (!token) {
      throw new ApiError("Inicia sesión para continuar.");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, "")}`, {
      ...requestInit,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        `No se pudo conectar con ${API_BASE_URL}. Verifica que el backend esté activo y accesible desde el dispositivo.`,
      );
    }

    throw error;
  }

  const responseText = await response.text();
  const payload = responseText ? parseJson(responseText, response.status) : null;

  if (!response.ok) {
    throw new ApiError(
      getServerErrorMessage(payload, response.status),
      response.status,
    );
  }

  if (payload === null) {
    if (allowEmptyResponse) {
      return parseResponse(null);
    }

    throw new ApiError("El backend respondió sin contenido.", response.status);
  }

  return parseResponse(payload);
}
