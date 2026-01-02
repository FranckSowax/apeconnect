const WHAPI_BASE_URL = "https://gate.whapi.cloud";

interface WhapiConfig {
  apiToken: string;
  channelId?: string;
}

interface SendMessageOptions {
  to: string;
  body: string;
  typing_time?: number;
}

interface SendMediaOptions {
  to: string;
  media: string; // URL or base64
  caption?: string;
  filename?: string;
}

interface WhapiResponse<T = unknown> {
  sent: boolean;
  message?: T;
  error?: string;
}

class WhapiClient {
  private apiToken: string;
  private channelId?: string;

  constructor(config: WhapiConfig) {
    this.apiToken = config.apiToken;
    this.channelId = config.channelId;
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown
  ): Promise<T> {
    const url = `${WHAPI_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      "Authorization": `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Whapi API error: ${response.status}`);
    }

    return response.json();
  }

  // Send a text message
  async sendMessage(options: SendMessageOptions): Promise<WhapiResponse> {
    return this.request("/messages/text", "POST", {
      to: options.to,
      body: options.body,
      typing_time: options.typing_time || 0,
    });
  }

  // Send an image
  async sendImage(options: SendMediaOptions): Promise<WhapiResponse> {
    return this.request("/messages/image", "POST", {
      to: options.to,
      media: options.media,
      caption: options.caption,
    });
  }

  // Send a document
  async sendDocument(options: SendMediaOptions): Promise<WhapiResponse> {
    return this.request("/messages/document", "POST", {
      to: options.to,
      media: options.media,
      filename: options.filename,
      caption: options.caption,
    });
  }

  // Get message by ID
  async getMessage(messageId: string): Promise<unknown> {
    return this.request(`/messages/${messageId}`);
  }

  // Get chat messages
  async getChatMessages(chatId: string, limit = 100): Promise<unknown> {
    return this.request(`/messages/list/${chatId}?count=${limit}`);
  }

  // Check if phone number is registered on WhatsApp
  async checkPhone(phone: string): Promise<{ exists: boolean; jid?: string }> {
    const result = await this.request<{ contacts: Array<{ exists: boolean; jid: string }> }>(
      "/contacts/check",
      "POST",
      { contacts: [phone] }
    );
    return {
      exists: result.contacts?.[0]?.exists || false,
      jid: result.contacts?.[0]?.jid,
    };
  }

  // Get channel/account info
  async getAccountInfo(): Promise<unknown> {
    return this.request("/settings");
  }
}

// Singleton instance
let whapiClient: WhapiClient | null = null;

export function getWhapiClient(): WhapiClient {
  if (!whapiClient) {
    const apiToken = process.env.WHAPI_API_TOKEN;
    if (!apiToken) {
      throw new Error("WHAPI_API_TOKEN environment variable is not set");
    }
    whapiClient = new WhapiClient({
      apiToken,
      channelId: process.env.NEXT_PUBLIC_WHAPI_CHANNEL_ID,
    });
  }
  return whapiClient;
}

export { WhapiClient };
export type { WhapiConfig, SendMessageOptions, SendMediaOptions, WhapiResponse };
