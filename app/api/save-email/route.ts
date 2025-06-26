import { NextRequest, NextResponse } from 'next/server';
import { emailLeadService } from '@/lib/db/services';

// Hilfsfunktion für Client-IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const { email, result } = await request.json();

    // Validierung der E-Mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Meta-Daten sammeln
    const metadata = {
      industry: result?.company_info?.industry,
      companySize: result?.company_info?.companySize,
      calculatedLevel: result?.calculated_level,
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || undefined,
      source: 'assessment',
    };

    // E-Mail-Lead in Datenbank speichern
    const leadId = await emailLeadService.saveOrUpdateLead(email, metadata);

    // Optional: Weitere Integrationen
    // Beispiele für mögliche zusätzliche Integrationen:
    
    // 1. An ein CRM senden (z.B. HubSpot, Salesforce):
    // if (process.env.HUBSPOT_API_KEY) {
    //   await fetch('https://api.hubapi.com/contacts/v1/contact', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       properties: [
    //         { property: 'email', value: email },
    //         { property: 'company_industry', value: result.company_info.industry },
    //         { property: 'ai_maturity_level', value: result.calculated_level },
    //         { property: 'ai_score', value: result.score }
    //       ]
    //     })
    //   });
    // }

    // 2. An einen Newsletter-Service senden (z.B. Mailchimp):
    // if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
    //   await fetch(`https://us1.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //     merge_fields: {
    //       INDUSTRY: result.company_info.industry,
    //       AI_LEVEL: result.calculated_level
    //     }
    //   })
    // });
    // }

    console.log('E-Mail-Lead gespeichert:', { email, leadId, metadata });

    return NextResponse.json({
      success: true,
      message: 'E-Mail erfolgreich gespeichert',
      leadId,
    });

  } catch (error) {
    console.error('Fehler beim Speichern der E-Mail:', error);
    
    // Fallback: auch bei Datenbankfehlern erfolgreich antworten
    return NextResponse.json({
      success: true,
      message: 'E-Mail verarbeitet',
      warning: 'Datenbank möglicherweise nicht verfügbar',
    });
  }
}
