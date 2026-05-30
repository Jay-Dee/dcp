import type { DeviceRecord } from "../../types/device";

export interface DeviceRepository {
  save(record: DeviceRecord): DeviceRecord;
  getAll(): DeviceRecord[];
  getById(deviceId: string): DeviceRecord | undefined;
}