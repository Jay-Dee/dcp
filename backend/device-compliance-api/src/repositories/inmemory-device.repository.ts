import type { DeviceRepository } from "./interfaces/device-repository";
import type { DeviceRecord } from "../types/device";

export class InMemoryDeviceRepository implements DeviceRepository {
  private readonly devices = new Map<string, DeviceRecord>();

  save(record: DeviceRecord): DeviceRecord {
    this.devices.set(record.deviceId, record);
    return record;
  }

  getAll(): DeviceRecord[] {
    return Array.from(this.devices.values());
  }

  getById(deviceId: string): DeviceRecord | undefined {
    return this.devices.get(deviceId);
  }
}