import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/backend/models/supabase";

// export const telnyx = Telnyx(process.env.TELNYX_BEARER);
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // todo: change to SUPABASE_SERVICE_KEY
);

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  customHeaders?: Record<string, string>;
}

export class TelnyxClient {
  private baseUrl: string;
  private bearerToken: string;

  constructor(baseUrl: string, bearerToken: string) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
  }

  private async request<T>({
    endpoint,
    method = "GET",
    body,
    customHeaders,
  }: RequestOptions): Promise<T> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.bearerToken}`,
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${
        response.status
      } - ${await response.text()}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async get<T>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return await this.request<T>({ endpoint, method: "GET", customHeaders });
  }

  async post<T>(
    endpoint: string,
    body: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return await this.request<T>({
      endpoint,
      method: "POST",
      body,
      customHeaders,
    });
  }

  async put<T>(
    endpoint: string,
    body: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return await this.request<T>({
      endpoint,
      method: "PUT",
      body,
      customHeaders,
    });
  }

  async delete<T>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return await this.request<T>({ endpoint, method: "DELETE", customHeaders });
  }
}

export const telnyx = new TelnyxClient(
  "https://api.telnyx.com/v2/",
  process.env.TELNYX_BEARER!
);
