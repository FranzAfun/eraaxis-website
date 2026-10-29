import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCustomerTotal, calculatePaymentBreakdown } from '../src/data/payments.js';

test('checkout rounds the combined 1.6% once, with the GHS 30 cap', () => {
  const amounts = [17, 77, 202, 402, 702, 2102, 1874.68, 1874.69, 1874.99, 1875, 1875.01];
  for (let cents = 1; cents <= 250000; cents += 137) amounts.push(cents / 100 + 2);
  for (const gateway of amounts) {
    const base = Math.round((gateway - 2) * 100) / 100;
    const fee = Math.min(Math.round(Math.round(gateway * 100) * 16 / 1000), 3000) / 100;
    const total = Math.round((gateway + fee) * 100) / 100;
    assert.equal(calculateCustomerTotal(base), total, `gateway ${gateway}`);
    assert.deepEqual(calculatePaymentBreakdown(base), { baseAmount: base, maintenanceFee: 2, spesoFee: fee, customerTotal: total });
  }
  assert.equal(calculateCustomerTotal(200), 205.23);
});
