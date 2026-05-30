import type { AuditEvent, DeviceRecord } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDevices(): Promise<DeviceRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/device`);

  return response.json();
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit`);

  return response.json();
}