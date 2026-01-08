import { Contact } from '../types';

// Simulating backend delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockBackendService {
  async triggerCheckin(userId: string): Promise<{ status: string, timestamp: string }> {
    console.log(`[BACKEND] /trigger-checkin for user: ${userId}`);
    await delay(500);
    return {
      status: 'CHECK_IN_INITIATED',
      timestamp: new Date().toISOString()
    };
  }

  async alertPrimary(userId: string, contact: Contact): Promise<{ status: string, sent_to: string }> {
    console.log(`[BACKEND] /alert-primary | SMS to ${contact.name} (${contact.phone}): "Unusual inactivity detected for ${userId}"`);
    await delay(800);
    return {
      status: 'PRIMARY_ALERT_SENT',
      sent_to: contact.phone
    };
  }

  async alertSecondary(userId: string, contact: Contact): Promise<{ status: string, action: string }> {
    console.log(`[BACKEND] /alert-secondary | CALL/SMS to ${contact.name} (${contact.phone}): "Escalation: No response from ${userId}"`);
    await delay(1000);
    return {
      status: 'SECONDARY_ALERT_SENT',
      action: 'AUTOMATED_CALL_INITIATED'
    };
  }

  async logEvent(state: string, details: string) {
    console.log(`[BACKEND LOG] State: ${state}, Details: ${details}`);
  }
}

export const backendService = new MockBackendService();