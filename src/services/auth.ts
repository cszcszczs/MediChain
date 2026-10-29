import { apiRequest, saveAccessToken } from "./api";

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  tokenType: "Bearer";
  user: {
    id: string;
    email: string;
    name: string;
  };
}

function parseLoginResponse(payload: unknown): LoginResponseDTO {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("accessToken" in payload) ||
    typeof payload.accessToken !== "string" ||
    !("tokenType" in payload) ||
    payload.tokenType !== "Bearer" ||
    !("user" in payload) ||
    typeof payload.user !== "object" ||
    payload.user === null ||
    !("id" in payload.user) ||
    typeof payload.user.id !== "string" ||
    !("email" in payload.user) ||
    typeof payload.user.email !== "string" ||
    !("name" in payload.user) ||
    typeof payload.user.name !== "string"
  ) {
    throw new Error("El backend devolvió una respuesta de inicio de sesión inválida.");
  }

  return {
    accessToken: payload.accessToken,
    tokenType: "Bearer",
    user: {
      id: payload.user.id,
      email: payload.user.email,
      name: payload.user.name,
    },
  };
}

export async function login(
  credentials: LoginRequestDTO,
): Promise<LoginResponseDTO> {
  const response = await apiRequest("auth/login", parseLoginResponse, {
    method: "POST",
    body: JSON.stringify(credentials),
    authenticated: false,
  });

  await saveAccessToken(response.accessToken);
  return response;
}
