import { DeviceRecord } from "../types/device.js";

const devices = new Map<string, DeviceRecord>();

export function saveDeviceRecord(record: DeviceRecord): DeviceRecord {
  devices.set(record.deviceId, record);
  return record;
}

export function getAllDeviceRecords(): DeviceRecord[] {
  return Array.from(devices.values());
}

export function getDeviceRecord(deviceId: string): DeviceRecord | undefined {
  return devices.get(deviceId);
}