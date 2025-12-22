/**
 * GST Utility Helper
 * Centralized GST calculation logic
 */

export interface GSTCalculation {
  basePrice: number;
  platformFee: number;
  gstAmount: number;
  finalPrice: number;
}

export class GSTUtil {
  /**
   * Calculate platform fee and GST
   *
   * @param basePrice - Ticket price set by organizer
   * @param commissionRate - Platform commission percentage (e.g., 10 for 10%)
   * @param gstRate - GST rate percentage (e.g., 18 for 18%)
   * @param gstEnabled - Whether GST is enabled
   * @returns Calculated pricing breakdown
   */
  static calculatePricing(
    basePrice: number,
    commissionRate: number,
    gstRate: number,
    gstEnabled: boolean,
  ): GSTCalculation {
    // Platform commission (before GST)
    const platformFeeBase = (basePrice * commissionRate) / 100;

    let platformFee = platformFeeBase;
    let gstAmount = 0;

    // Add GST on platform fee if enabled
    if (gstEnabled) {
      gstAmount = (platformFeeBase * gstRate) / 100;
      platformFee = platformFeeBase + gstAmount;
    }

    // Final price user pays
    const finalPrice = basePrice + platformFee;

    return {
      basePrice: this.roundToTwo(basePrice),
      platformFee: this.roundToTwo(platformFee),
      gstAmount: this.roundToTwo(gstAmount),
      finalPrice: this.roundToTwo(finalPrice),
    };
  }

  /**
   * Calculate refund breakdown for cancellations
   *
   * @param totalAmount - Total amount paid
   * @param cancellationChargePercent - Cancellation fee percentage
   * @returns Refund calculation
   */
  static calculateRefund(
    totalAmount: number,
    cancellationChargePercent: number,
  ): {
    cancellationFee: number;
    refundAmount: number;
  } {
    const cancellationFee = (totalAmount * cancellationChargePercent) / 100;
    const refundAmount = totalAmount - cancellationFee;

    return {
      cancellationFee: this.roundToTwo(cancellationFee),
      refundAmount: this.roundToTwo(refundAmount),
    };
  }

  /**
   * Round to 2 decimal places
   */
  private static roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}
