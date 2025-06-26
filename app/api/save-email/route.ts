import { NextRequest, NextResponse } from 'next/server';

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

    // Hier würden Sie normalerweise die E-Mail in Ihrer Datenbank oder CRM speichern
    // Beispiele für mögliche Integrationen:
    
    // 1. In einer Datenbank speichern:
    // await db.emails.create({
    //   email,
    //   industry: result.company_info.industry,
    //   companySize: result.company_info.companySize,
    //   maturityLevel: result.calculated_level,
    //   score: result.score,
    //   createdAt: new Date()
    // });

    // 2. An ein CRM senden (z.B. HubSpot, Salesforce):
    // await fetch('https://api.hubapi.com/contacts/v1/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     properties: [
    //       { property: 'email', value: email },
    //       { property: 'company_industry', value: result.company_info.industry },
    //       { property: 'ai_maturity_level', value: result.calculated_level },
    //       { property: 'ai_score', value: result.score }
    //     ]
    //   })
    // });

    // 3. An einen Newsletter-Service senden (z.B. Mailchimp):
    // await fetch(`https://us1.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
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

    // Für die Demo-Version loggen wir nur
    console.log('Email submitted:', {
      email,
      industry: result.company_info.industry,
      companySize: result.company_info.companySize,
      maturityLevel: result.calculated_level,
      score: result.score,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'E-Mail erfolgreich gespeichert' 
    });

  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern der E-Mail' },
      { status: 500 }
    );
  }
}
