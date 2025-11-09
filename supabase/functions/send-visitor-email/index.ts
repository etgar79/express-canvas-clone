import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VisitorData {
  userAgent: string;
  referrer: string;
  language: string;
  screenResolution: string;
  timestamp: string;
  page: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const visitorData: VisitorData = await req.json();
    console.log("Received visitor data:", visitorData);

    // Get visitor IP address
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               req.headers.get('cf-connecting-ip') || 
               'לא ידוע';

    // Parse user agent to get browser and OS info
    const ua = visitorData.userAgent;
    let browser = "Unknown";
    let os = "Unknown";

    // Simple browser detection
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    // Simple OS detection
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    // Format timestamp
    const date = new Date(visitorData.timestamp);
    const formattedDate = date.toLocaleString('he-IL', { 
      timeZone: 'Asia/Jerusalem',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          .info-row { margin: 15px 0; padding: 10px; background-color: #f9fafb; border-right: 4px solid #2563eb; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔔 מבקר חדש באתר!</h1>
          
          <div class="info-row">
            <div class="label">⏰ זמן כניסה:</div>
            <div class="value">${formattedDate}</div>
          </div>

          <div class="info-row">
            <div class="label">🌐 דפדפן:</div>
            <div class="value">${browser}</div>
          </div>

          <div class="info-row">
            <div class="label">💻 מערכת הפעלה:</div>
            <div class="value">${os}</div>
          </div>

          <div class="info-row">
            <div class="label">📱 רזולוציה:</div>
            <div class="value">${visitorData.screenResolution}</div>
          </div>

          <div class="info-row">
            <div class="label">🌍 שפה:</div>
            <div class="value">${visitorData.language}</div>
          </div>

          <div class="info-row">
            <div class="label">🌐 כתובת IP:</div>
            <div class="value">${ip}</div>
          </div>

          <div class="info-row">
            <div class="label">📄 עמוד:</div>
            <div class="value">${visitorData.page}</div>
          </div>

          ${visitorData.referrer !== "ישיר" ? `
          <div class="info-row">
            <div class="label">🔗 מקור הגעה:</div>
            <div class="value">${visitorData.referrer}</div>
          </div>
          ` : ''}

          <div class="footer">
            התראה זו נשלחה אוטומטית מהאתר 1979.co.il
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Tech Therapy <onboarding@resend.dev>',
        to: ['etgar79@gmail.com'],
        subject: `🔔 מבקר חדש באתר - ${browser} על ${os}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Resend API error: ${errorData}`);
    }

    const emailData = await resendResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending visitor email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
