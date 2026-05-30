import { z } from "zod";

export const deviceCheckInSchema = z.object({
  deviceId: z.string().min(1),
  platform: z.string().min(1),
  diskEncrypted: z.boolean(),
  antivirusRunning: z.boolean(),
  lastPatchedDays: z.number().int().min(0)
});

export type DeviceCheckInInput = z.infer<typeof deviceCheckInSchema>;