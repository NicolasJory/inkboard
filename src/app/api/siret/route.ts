import { NextRequest, NextResponse } from 'next/server';

const SIRENE_API_URL = 'https://api.insee.fr/entreprises/sirene/V3.11/siret';

export async function GET(request: NextRequest) {
  const siret = request.nextUrl.searchParams.get('siret');

  if (!siret || siret.length !== 14) {
    return NextResponse.json({ error: 'SIRET invalide (14 chiffres requis)' }, { status: 400 });
  }

  const token = process.env.INSEE_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Configuration API INSEE manquante' }, { status: 500 });
  }

  try {
    const response = await fetch(`${SIRENE_API_URL}/${siret}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ valid: false, error: 'SIRET introuvable' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Erreur lors de la vérification' },
        { status: response.status },
      );
    }

    const data = await response.json();
    const etablissement = data.etablissement;

    return NextResponse.json({
      valid: true,
      companyName: etablissement.uniteLegale?.denominationUniteLegale ?? null,
      address: [
        etablissement.adresseEtablissement?.numeroVoieEtablissement,
        etablissement.adresseEtablissement?.typeVoieEtablissement,
        etablissement.adresseEtablissement?.libelleVoieEtablissement,
        etablissement.adresseEtablissement?.codePostalEtablissement,
        etablissement.adresseEtablissement?.libelleCommuneEtablissement,
      ]
        .filter(Boolean)
        .join(' '),
      activity: etablissement.uniteLegale?.activitePrincipaleUniteLegale ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Erreur de connexion à l'API INSEE" }, { status: 502 });
  }
}
