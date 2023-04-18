import { Sku } from "./Sku.interface";
import { Platform } from "@/enums/Platform";
import { Meta } from "./Meta.interface";
import { ProductVariant } from "./ProductVariant.interface";
import { ProductType } from "@/enums/ProductType";
import { OfferStatus } from "@/enums/OfferStatus";
import { PublishingStatus } from "@/enums/PublishingStatus";
import { Variant } from "./Variant.interface";

export interface Offer {
  id: number;
  productId: string;
  externalId?: string;
  externalUrl?: string;
  name: string;
  description?: string;
  source: Platform;
  seller?: string;
  vendor?: string;
  merchantId: number;
  available: boolean;
  visible: boolean;
  totalSales?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  sourceCategoryName?: string;
  meta?: Meta[];
  variants?: Variant[];
  skus?: Sku[];
  albums?: Album[];
  threeDEnabled?: boolean;
  threeDResource?: string;
  type: ProductType;
  status?: OfferStatus;
  publishingStatus?: PublishingStatus;
  dateCreated?: string;
  dateLastModified?: string;
  tagString?: string;
  commissionRate?: number;
  weightUnit?: string;
}

export interface Album {
  id: number;
  parent_id: number;
  type: AlbumType;
  name?: string;
  media: Media[];
  primaryMedia: Media;
}

export enum AlbumType {
  OFFER = "OFFER",
  SKU = "SKU",
}

export interface Media {
  id: number;
  album_id: number;
  external_id?: string;
  cloudId?: string;
  url: string;
  source_url: string;
  type: MediaType;
  display_order: number;
  primary?: boolean;
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
