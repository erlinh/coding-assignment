import { OrderBatch, ValidationError } from "../types/OrderModels.js";

const ORDER_ID_PATTERN = /^ORD-\d{4}-\d{6}$/;
const EMAIL_PATTERN = /^[^@]+@[^@]+\.[^@]+$/;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export interface IOrderValidatorService {
  validate(batch: OrderBatch): ValidationError[];
}

export class OrderValidatorService implements IOrderValidatorService {
  validate(batch: OrderBatch): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const order of batch.orders) {
      const orderId = order.header.orderId || "unknown";

      this.validateRequired(errors, orderId, order.header.orderId, "Header.OrderId");
      this.validateRequired(errors, orderId, order.header.orderDate, "Header.OrderDate");
      this.validateRequired(errors, orderId, order.customer.customerId, "Customer.CustomerId");
      this.validateRequired(errors, orderId, order.customer.name, "Customer.Name");
      this.validateRequired(errors, orderId, order.customer.email, "Customer.Email");

      if (order.header.orderId && !ORDER_ID_PATTERN.test(order.header.orderId)) {
        errors.push({
          orderId,
          field: "Header.OrderId",
          message: "OrderId must match pattern ORD-YYYY-NNNNNN",
          errorCode: "FORMAT",
        });
      }

      if (order.customer.email && !EMAIL_PATTERN.test(order.customer.email)) {
        errors.push({
          orderId,
          field: "Customer.Email",
          message: "Email must match pattern [^@]+@[^@]+\\.[^@]+",
          errorCode: "FORMAT",
        });
      }

      if (order.customer.address.country && !COUNTRY_CODE_PATTERN.test(order.customer.address.country)) {
        errors.push({
          orderId,
          field: "Customer.Address.Country",
          message: "Country code must be exactly 2 uppercase letters",
          errorCode: "FORMAT",
        });
      }

      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];

        if (item.currency && !CURRENCY_CODE_PATTERN.test(item.currency)) {
          errors.push({
            orderId,
            field: `Items[${i}].Currency`,
            message: "Currency code must be exactly 3 uppercase letters",
            errorCode: "FORMAT",
          });
        }

        if (item.quantity <= 0) {
          errors.push({
            orderId,
            field: `Items[${i}].Quantity`,
            message: "Quantity must be greater than 0",
            errorCode: "RANGE",
          });
        }

        if (item.unitPrice < 0) {
          errors.push({
            orderId,
            field: `Items[${i}].UnitPrice`,
            message: "UnitPrice must be greater than or equal to 0",
            errorCode: "RANGE",
          });
        }
      }

      if (order.totals.subtotal < 0) {
        errors.push({
          orderId,
          field: "Totals.Subtotal",
          message: "Subtotal must be greater than or equal to 0",
          errorCode: "RANGE",
        });
      }

      if (order.totals.taxAmount < 0) {
        errors.push({
          orderId,
          field: "Totals.TaxAmount",
          message: "TaxAmount must be greater than or equal to 0",
          errorCode: "RANGE",
        });
      }

      if (order.totals.total < 0) {
        errors.push({
          orderId,
          field: "Totals.Total",
          message: "Total must be greater than or equal to 0",
          errorCode: "RANGE",
        });
      }
    }

    return errors;
  }

  private validateRequired(
    errors: ValidationError[],
    orderId: string,
    value: string,
    field: string
  ): void {
    if (!value || value.trim() === "") {
      errors.push({
        orderId,
        field,
        message: `${field} is required`,
        errorCode: "REQUIRED",
      });
    }
  }
}