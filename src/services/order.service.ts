import type { GeneralResponse } from "../core/models/general.model";
import type { Order } from "../core/models/order.model";
import { api } from "../lib/axios";

const DUMMY_ORDERS: Order[] = [
  {
    id: 1,
    petId: 1,
    petName: "Buddy",
    quantity: 1,
    shipDate: "2026-03-01T10:00:00.000Z",
    status: "placed",
    complete: false,
  },
  {
    id: 2,
    petId: 102,
    petName: "Whiskers",
    quantity: 2,
    shipDate: "2026-03-02T11:00:00.000Z",
    status: "approved",
    complete: false,
  },
  {
    id: 3,
    petId: 103,
    petName: "Jerry",
    quantity: 1,
    shipDate: "2026-03-03T12:00:00.000Z",
    status: "delivered",
    complete: true,
  },
  {
    id: 4,
    petId: 104,
    petName: "Rex",
    quantity: 3,
    shipDate: "2026-03-04T09:00:00.000Z",
    status: "placed",
    complete: false,
  },
  {
    id: 5,
    petId: 105,
    petName: "Milo",
    quantity: 1,
    shipDate: "2026-03-05T14:00:00.000Z",
    status: "approved",
    complete: false,
  },
  {
    id: 6,
    petId: 106,
    petName: "Luna",
    quantity: 2,
    shipDate: "2026-03-06T15:00:00.000Z",
    status: "delivered",
    complete: true,
  },
  {
    id: 7,
    petId: 107,
    petName: "Charlie",
    quantity: 1,
    shipDate: "2026-03-07T08:00:00.000Z",
    status: "placed",
    complete: false,
  },
  {
    id: 8,
    petId: 108,
    petName: "Bella",
    quantity: 4,
    shipDate: "2026-03-08T16:00:00.000Z",
    status: "approved",
    complete: false,
  },
  {
    id: 9,
    petId: 109,
    petName: "Max",
    quantity: 1,
    shipDate: "2026-03-09T10:30:00.000Z",
    status: "delivered",
    complete: true,
  },
  {
    id: 10,
    petId: 110,
    petName: "Daisy",
    quantity: 2,
    shipDate: "2026-03-10T13:00:00.000Z",
    status: "placed",
    complete: false,
  },
];

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return DUMMY_ORDERS;
  },

  async getOrderById(id: number): Promise<Order> {
    const res = await api.get<Order>(`/store/order/${id}`);
    return res.data;
  },

  async createOrder(order: Order): Promise<Order> {
    const res = await api.post<Order>("/store/order", order);
    return res.data;
  },

  async deleteOrder(id: number): Promise<GeneralResponse> {
    const res = await api.delete<GeneralResponse>(`/store/order/${id}`);
    return res.data;
  },
};
