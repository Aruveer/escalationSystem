import { Contact, EscalationState } from '../types';
import { backendService as mockBackend } from './mockBackend';

// Standard response shape for our API
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const IS_AZURE_ENV = window.location.hostname.includes('azurestaticapps.net');

/**
 * This service routes requests to either the local mock backend (for demo/testing)
 * or the live Azure Functions backend (for production).
 */
class ApiService {
  
  private async postToAzure(endpoint: string, body: any): Promise<ApiResponse> {
    try {
      // Azure Static Web Apps proxies /api calls to the linked Azure Function app automatically
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) throw new Error(`Azure API Error: ${response.statusText}`);
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to call Azure Function '${endpoint}':`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  async triggerCheckin(userId: string) {
    if (IS_AZURE_ENV) {
      return this.postToAzure('triggerCheckIn', { userId });
    } else {
      console.log('☁️ [Azure Mode: OFF] Using local mock.');
      return mockBackend.triggerCheckin(userId);
    }
  }

  async alertPrimary(userId: string, contact: Contact) {
    if (IS_AZURE_ENV) {
      return this.postToAzure('alertPrimary', { userId, contact });
    } else {
      console.log('☁️ [Azure Mode: OFF] Using local mock.');
      return mockBackend.alertPrimary(userId, contact);
    }
  }

  async alertSecondary(userId: string, contact: Contact) {
    if (IS_AZURE_ENV) {
      return this.postToAzure('alertSecondary', { userId, contact });
    } else {
      console.log('☁️ [Azure Mode: OFF] Using local mock.');
      return mockBackend.alertSecondary(userId, contact);
    }
  }

  async logEvent(state: EscalationState, message: string) {
    // We log to console in both environments, but in Azure we also send to backend for DB storage
    console.log(`[APP LOG] ${state}: ${message}`);
    
    if (IS_AZURE_ENV) {
      // Fire and forget log
      this.postToAzure('logEvent', { state, message }).catch(e => console.warn("Log failed", e));
    }
  }
}

export const api = new ApiService();