import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePaymentBreakdown, getPaymentCategoryBySlug, getPaymentItemBySlug } from "../src/data/payments.js";

test("Campus Chapter checkout keeps stored identifiers and charges one 12-month membership plus normal fees", () => {
  const category = getPaymentCategoryBySlug("student-chapter");
  const item = getPaymentItemBySlug("student-chapter-first-payment");
  assert.equal(category.route, "/payments/campus-chapter");
  assert.equal(category.title, "Campus Chapter");
  assert.equal(item.membershipMonths, 12);
  assert.equal(item.baseAmount, 200);
  assert.deepEqual(item.breakdown, [{ label: "Campus Chapter membership (12 months)", amount: 200 }]);
  assert.deepEqual(calculatePaymentBreakdown(item.baseAmount), { baseAmount: 200, maintenanceFee: 2, spesoFee: 3.24, customerTotal: 205.24 });
});

test("separate Monthly Dues keep their original price and payment route", () => {
  const category = getPaymentCategoryBySlug("monthly-dues");
  assert.equal(category.route, "/payments/monthly-dues");
  assert.equal(category.items[0].baseAmount, 15);
  assert.deepEqual(category.items[0].breakdown, [{ label: "Monthly dues", amount: 15 }]);
});
