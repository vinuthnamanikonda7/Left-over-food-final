/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'DONOR' | 'RECEIVER' | 'DELIVERY';

export type ListingStatus = 'Available' | 'Claimed' | 'Picked Up' | 'Delivered';

export interface User {
  name: string;
  role: Role;
  phone: string;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: string;
  expiryTime: string;
  pickupAddress: string;
  donorName: string;
  status: ListingStatus;
  receiverName?: string;
  receiverLocation?: string;
  createdAt: number;
}
