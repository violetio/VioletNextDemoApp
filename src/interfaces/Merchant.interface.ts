import { DistributionType } from "@/enums/DistributionType";
import { MerchantCategory } from "@/enums/MerchantCategory";
import { MerchantConnectionStatus } from "@/enums/MerchantConnectionStatus";
import { Platform } from "@/enums/Platform";
import { ReferralSource } from "@/enums/ReferralSource";
import { UnitOfMeasure } from "@/enums/UnitOfMeasure";

export interface Merchant {
  id?: number;
  name: string;
  email: string;
  userId: number;
  platform: Platform;
  storeUrl: string;
  verified: boolean;
  status: "inactive" | "active" | "disabled" | "new";
  defaultCurrency?: string;
  defaultCountryCode?: string;
  defaultStateCode?: string;
  defaultLanguageCode?: string;
  commissionRate?: number;
  dateCreated?: string;
  dateLastModified?: string;
  externalId?: string;
  distributionType?: DistributionType;
  defaultWeightUnit?: UnitOfMeasure;
  defaultSizeUnit?: UnitOfMeasure;
  isDefault?: boolean;
  referralSource?: ReferralSource;
  logo?: string;
  category?: MerchantCategory;
  featured?: boolean;
  connectionStatus?: MerchantConnectionStatus;
  billingConfigured?: boolean;
  shippingConfigured?: boolean;
  taxesConfigured?: boolean;
}
