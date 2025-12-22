import {
  Injectable,
  Logger,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as QRCode from 'qrcode';
// import * as PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma';
import { bookingConfigFactory } from '../configs';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(bookingConfigFactory.KEY)
    private readonly bookingConfig: ConfigType<typeof bookingConfigFactory>,
  ) {
    // Ensure ticket storage directory exists
    this.ensureStorageDirectory();
  }

  /**
   * Generate ticket after booking confirmation
   * Called from booking service after payment verification
   */
  async generateTicket(bookingId: number): Promise<void> {
    try {
      // Get booking details
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          event: true,
          user: true,
        },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // ✅ DEFENSIVE CHECK - Event date must exist
      if (!booking.event.eventDate) {
        this.logger.error(
          `Cannot generate ticket - Event date missing for booking: ${booking.bookingReference}`,
        );
        throw new Error('Event date is required to generate ticket');
      }

      // Step 1: Generate QR Code
      const qrCodeData = await this.generateQRCode(booking);

      // Step 2: Generate PDF Ticket
      const ticketUrl = await this.generatePDFTicket(
        booking,
        qrCodeData.qrCodeFilename,
      );

      // Step 3: Update booking with ticket details
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          qrCode: qrCodeData.qrCodeFilename,
          qrCodeData: qrCodeData.encryptedData,
          ticketUrl,
        },
      });

      this.logger.log(
        `Ticket generated for booking: ${booking.bookingReference}`,
      );
    } catch (error) {
      this.logger.error(
        `Error generating ticket for booking ${bookingId}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to generate ticket');
    }
  }

  /**
   * Generate QR Code and save as PNG file
   * Returns filename (not base64 data URL)
   */
  private async generateQRCode(booking: any): Promise<{
    qrCodeFilename: string;
    encryptedData: string;
  }> {
    try {
      // Create encrypted payload
      const payload = {
        ref: booking.bookingReference,
        eventId: booking.eventId,
        seats: booking.seatCount,
        timestamp: Date.now(),
      };

      const encryptedData = this.encryptData(JSON.stringify(payload));

      // Generate QR code as PNG buffer (not base64 data URL)
      const qrCodeBuffer = await QRCode.toBuffer(encryptedData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        type: 'png',
      });

      // Save QR code as file
      const qrFilename = `qr-${booking.bookingReference}.png`;
      const qrDirectory = path.join(
        this.bookingConfig.ticketStoragePath,
        '../qr-codes',
      );

      // Ensure QR directory exists
      if (!fs.existsSync(qrDirectory)) {
        fs.mkdirSync(qrDirectory, { recursive: true });
        this.logger.log(`Created QR codes directory: ${qrDirectory}`);
      }

      const qrFilePath = path.join(qrDirectory, qrFilename);

      // Write QR code file
      await fs.promises.writeFile(qrFilePath, qrCodeBuffer);

      this.logger.log(`QR code saved: ${qrFilename}`);

      return {
        qrCodeFilename: qrFilename,
        encryptedData,
      };
    } catch (error) {
      this.logger.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Generate PDF Ticket
   * Creates a professional-looking ticket with QR code
   */
  private async generatePDFTicket(
    booking: any,
    qrCodeFilename: string,
  ): Promise<string> {
    try {
      const fileName = `ticket-${booking.bookingReference}.pdf`;
      const filePath = path.join(
        this.bookingConfig.ticketStoragePath,
        fileName,
      );

      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Header
      doc
        .fontSize(24)
        .fillColor('#1a1a1a')
        .text('E-TICKET', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor('#666666')
        .text(`Booking Reference: ${booking.bookingReference}`, {
          align: 'center',
        })
        .moveDown(2);

      // Event Details Section
      doc.fontSize(18).fillColor('#1a1a1a').text('Event Details').moveDown(0.5);

      doc
        .fontSize(14)
        .fillColor('#333333')
        .text(`Event: ${booking.event.title}`)
        .moveDown(0.3);

      if (booking.event.venue) {
        doc.text(`Venue: ${booking.event.venue}`).moveDown(0.3);
      }

      if (booking.event.address) {
        doc
          .fontSize(11)
          .fillColor('#666666')
          .text(`Address: ${booking.event.address}`)
          .moveDown(0.3);
      }

      if (booking.event.eventDate) {
        doc
          .fontSize(12)
          .fillColor('#333333')
          .text(
            `Date: ${new Date(booking.event.eventDate).toLocaleDateString(
              'en-IN',
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )}`,
          )
          .moveDown(0.3);
      }

      if (booking.event.startTime) {
        doc.text(
          `Time: ${new Date(booking.event.startTime).toLocaleTimeString(
            'en-IN',
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          )}`,
        );
      }

      doc.moveDown(1.5);

      // Booking Details Section
      doc
        .fontSize(18)
        .fillColor('#1a1a1a')
        .text('Booking Details')
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor('#333333')
        .text(`Number of Seats: ${booking.seatCount}`)
        .moveDown(0.3)
        .text(`Total Amount: ₹${Number(booking.totalAmount).toFixed(2)}`)
        .moveDown(0.3)
        .text(
          `Booking Date: ${new Date(booking.createdAt).toLocaleDateString('en-IN')}`,
        );

      doc.moveDown(1.5);

      // Customer Details
      doc
        .fontSize(18)
        .fillColor('#1a1a1a')
        .text('Customer Details')
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor('#333333')
        .text(`Name: ${booking.user.firstname} ${booking.user.lastname}`)
        .moveDown(0.3)
        .text(`Email: ${booking.user.email}`);

      if (booking.user.mobile) {
        doc.moveDown(0.3).text(`Mobile: ${booking.user.mobile}`);
      }

      doc.moveDown(2);

      // QR Code Section
      doc
        .fontSize(16)
        .fillColor('#1a1a1a')
        .text('Entry QR Code', { align: 'center' })
        .moveDown(0.5);

      // Read QR code file and embed in PDF
      const qrDirectory = path.join(
        this.bookingConfig.ticketStoragePath,
        '../qr-codes',
      );
      const qrFilePath = path.join(qrDirectory, qrCodeFilename);
      const qrBuffer = await fs.promises.readFile(qrFilePath);

      doc.image(qrBuffer, {
        fit: [200, 200],
        align: 'center',
      });

      doc.moveDown(1);

      doc
        .fontSize(10)
        .fillColor('#999999')
        .text('Please present this QR code at the venue entrance', {
          align: 'center',
        });

      // Footer
      doc
        .moveDown(2)
        .fontSize(9)
        .fillColor('#999999')
        .text('This is an e-ticket. No need to print.', { align: 'center' })
        .moveDown(0.2)
        .text('For any queries, please contact support.', { align: 'center' });

      // Finalize PDF
      doc.end();

      // Wait for write to complete
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (err) => reject(err));
      });

      // Return relative URL for storage
      return `/tickets/${fileName}`;
    } catch (error) {
      this.logger.error('Error generating PDF ticket:', error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive data for QR code
   * Uses AES-256-CBC encryption
   */
  private encryptData(data: string): string {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret-key';
      const key = crypto.scryptSync(secret, 'salt', 32);
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Combine IV and encrypted data
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      this.logger.error('Error encrypting data:', error);
      throw error;
    }
  }

  /**
   * Decrypt QR code data (for scanning/verification)
   * Used when QR is scanned at venue
   */
  decryptQRData(encryptedData: string): any {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret-key';
      const key = crypto.scryptSync(secret, 'salt', 32);

      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error('Error decrypting QR data:', error);
      return null;
    }
  }

  /**
   * Ensure ticket storage directory exists
   */
  private ensureStorageDirectory(): void {
    const dir = this.bookingConfig.ticketStoragePath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      this.logger.log(`Created ticket storage directory: ${dir}`);
    }
  }

  /**
   * Verify QR code at venue entrance
   * Returns booking details if valid
   */
  async verifyQRCode(qrCodeData: string): Promise<any> {
    try {
      // Decrypt QR data
      const decrypted = this.decryptQRData(qrCodeData);

      if (!decrypted) {
        return { valid: false, message: 'Invalid QR code' };
      }

      // Get booking
      const booking = await this.prisma.booking.findUnique({
        where: { bookingReference: decrypted.ref },
        include: { event: true, user: true },
      });

      if (!booking) {
        return { valid: false, message: 'Booking not found' };
      }

      if (booking.status !== 'CONFIRMED' && booking.status !== 'ATTENDED') {
        return { valid: false, message: 'Booking not confirmed' };
      }

      // Check if already scanned
      if (booking.isScanned) {
        return {
          valid: true,
          alreadyScanned: true,
          message: 'Ticket already scanned',
          scannedAt: booking.scannedAt,
          booking,
        };
      }

      // Mark as scanned
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: {
          isScanned: true,
          scannedAt: new Date(),
          status: 'ATTENDED',
        },
      });

      return {
        valid: true,
        alreadyScanned: false,
        message: 'Entry allowed',
        booking,
      };
    } catch (error) {
      this.logger.error('Error verifying QR code:', error);
      return { valid: false, message: 'Verification failed' };
    }
  }
}
