import type { AuditEvent, DeviceRecord } from "./types";
import type { DomainEvent } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDevices(): Promise<DeviceRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/device`);

  return response.json();
}

export async function getAuditEvents(): Promise<AuditEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit`);

  return response.json();
}

export async function getEvents(): Promise<DomainEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}