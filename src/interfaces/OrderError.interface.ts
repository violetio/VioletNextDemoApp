import { OrderErrorType } from "@/enums/OrderErrorType";
import { Platform } from "@/enums/Platform";

export interface OrderError {
  id: number;
  orderId: number;
  bagId: number;
  entityId: string;
  type: OrderErrorType;
  message: string;
  selfResolving: boolean;
  retryAttempts: number;
  dateCreated: string;
  platform: Platform;
}
