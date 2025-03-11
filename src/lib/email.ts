import { Resend } from 'resend'
import type { Booking, Notary } from '@/types'
import { Booking as SupabaseBooking } from '@/lib/supabase'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing env.RESEND_API_KEY')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingConfirmationEmailProps {
  booking: Booking
  notary: Notary
  clientEmail: string
  clientName: string
}

export async function sendBookingConfirmationEmail({
  booking,
  notary,
  clientEmail,
  clientName,
}: BookingConfirmationEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NotaryFinderNow <notifications@notaryfindernow.com>',
      to: [clientEmail],
      subject: 'Booking Confirmation - NotaryFinderNow',
      html: generateBookingConfirmationEmail(booking)
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    throw error
  }
}

export function generateBookingConfirmationEmail(booking: Booking) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
          }
          .content {
            padding: 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <p>Your notary appointment has been confirmed!</p>
            <div>
              <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Service Type:</strong> ${booking.serviceType}</p>
              <p><strong>Location:</strong> ${booking.location}</p>
              <p><strong>Notes:</strong> ${booking.notes || 'No additional notes'}</p>
            </div>
            <p>If you need to make any changes to your appointment, please contact us.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NotaryFinderNow. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendClaimNotification(
  notaryName: string,
  claimantEmail: string,
  claimantName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NotaryFinderNow <notifications@notaryfindernow.com>',
      to: ['support@notaryfindernow.com'],
      subject: `New Listing Claim - ${notaryName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d4ed8;">New Listing Claim</h1>
          
          <p>A new claim has been submitted for the following listing:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Listing:</strong> ${notaryName}</p>
            <p><strong>Claimant Name:</strong> ${claimantName}</p>
            <p><strong>Claimant Email:</strong> ${claimantEmail}</p>
          </div>
          
          <p>Please review this claim in the admin dashboard.</p>
        </div>
      `
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error sending claim notification email:', error)
    throw error
  }
}

export function generateBookingNotificationEmail(booking: Booking) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
          }
          .content {
            padding: 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Request</h1>
          </div>
          <div class="content">
            <p>You have received a new booking request!</p>
            <div>
              <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Service Type:</strong> ${booking.serviceType}</p>
              <p><strong>Location:</strong> ${booking.location}</p>
              <p><strong>Notes:</strong> ${booking.notes || 'No additional notes'}</p>
              <p><strong>Client Name:</strong> ${booking.clientName}</p>
              <p><strong>Client Email:</strong> ${booking.clientEmail}</p>
              <p><strong>Client Phone:</strong> ${booking.clientPhone}</p>
            </div>
            <p>Please review and confirm this booking request.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NotaryFinderNow. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
} 