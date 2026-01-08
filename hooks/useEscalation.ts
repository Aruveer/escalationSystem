import { useState, useEffect, useRef, useCallback } from 'react';
import { EscalationState, Contact, EscalationConfig, AlertLog } from '../types';
import { soundUtil } from '../utils/sound';
import { vibrateSoft, vibrateAlert } from '../utils/vibration';
import { api } from '../services/api';

const DEFAULT_CONFIG: EscalationConfig = {
  checkInDuration: 30,
  primaryAlertDuration: 30,
};

const MOCK_USER = "Alex Doe";

const PRIMARY_CONTACT: Contact = { id: "p1", name: "Mom", phone: "555-0101", role: "PRIMARY" };
const SECONDARY_CONTACT: Contact = { id: "e1", name: "Emergency Services", phone: "911", role: "EMERGENCY" };

export const useEscalation = () => {
  const [state, setState] = useState<EscalationState>(EscalationState.IDLE);
  const [timeLeft, setTimeLeft] = useState(0);
  const [logs, setLogs] = useState<AlertLog[]>([]);
  
  // Refs to handle intervals without closure staleness
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const addLog = (message: string) => {
    const log: AlertLog = {
      timestamp: new Date(),
      state: stateRef.current,
      message,
    };
    setLogs(prev => [log, ...prev]);
    api.logEvent(stateRef.current, message);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Transition: IDLE -> CHECK_IN
  const startCheckIn = useCallback(async () => {
    // Notify API (Azure or Mock)
    await api.triggerCheckin(MOCK_USER);
    
    setState(EscalationState.CHECK_IN);
    setTimeLeft(DEFAULT_CONFIG.checkInDuration);
    addLog("Check-in initiated. Waiting for user response.");
    
    soundUtil.playSoftChime();
    vibrateSoft();
  }, []);

  // Transition: * -> RESOLVED
  const reportSafe = useCallback(() => {
    clearTimer();
    setState(EscalationState.RESOLVED);
    addLog("User reported safe. Escalation cancelled.");
    
    // Auto reset to IDLE after a moment
    setTimeout(() => {
        setState(EscalationState.IDLE);
    }, 3000);
  }, []);

  // Transition: * -> ALERT_SECONDARY (Immediate help)
  const reportDanger = useCallback(async () => {
    clearTimer();
    setState(EscalationState.ALERT_SECONDARY);
    addLog("User requested immediate help.");
    await api.alertSecondary(MOCK_USER, SECONDARY_CONTACT);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (state === EscalationState.IDLE || state === EscalationState.RESOLVED) {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout reached
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleTimeout = async () => {
    const currentState = stateRef.current;
    
    if (currentState === EscalationState.CHECK_IN) {
      // Escalation Step 1: Check-in timed out -> Alert Primary
      setState(EscalationState.ALERT_PRIMARY);
      setTimeLeft(DEFAULT_CONFIG.primaryAlertDuration);
      
      addLog(`No response. Alerting Primary Contact: ${PRIMARY_CONTACT.name}`);
      await api.alertPrimary(MOCK_USER, PRIMARY_CONTACT);
      vibrateAlert();
      soundUtil.playAlertTone(); // Slightly more urgent but still polite

    } else if (currentState === EscalationState.ALERT_PRIMARY) {
      // Escalation Step 2: Primary alert timed out -> Alert Secondary
      setState(EscalationState.ALERT_SECONDARY);
      setTimeLeft(0); // No more timer, we are in final state
      clearTimer();

      addLog(`Still no response. Escalating to Secondary: ${SECONDARY_CONTACT.name}`);
      await api.alertSecondary(MOCK_USER, SECONDARY_CONTACT);
      vibrateAlert();
    }
  };

  return {
    state,
    timeLeft,
    logs,
    startCheckIn,
    reportSafe,
    reportDanger,
    config: DEFAULT_CONFIG
  };
};