import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { MOCK_ORDERS } from "../data/orders.data.ts";

export class orderService {
  static async getLatestOrders(limit?: number) {
    if (limit && limit > 0) {
      return MOCK_ORDERS.slice(0, limit).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return MOCK_ORDERS.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  static getLatestOrderswithCustomerDetails(limit?: number) {
    const customers = MOCK_CUSTOMERS;

    const orders = MOCK_ORDERS.map((order) => {
      const customer = customers.find(
        (customer) => customer._id === order.customer_id,
      );
      return {
        ...order,
        customer: customer?.name || "unknown",
      };
    });

    const sortedOrders = orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    if (limit && limit > 0) {
      return sortedOrders.slice(0, limit);
    }

    return sortedOrders;
  }

  static async getOrderById(id: string) {
    return MOCK_ORDERS.find((order) => order.id === id) || null;
  }
}
