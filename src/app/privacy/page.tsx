import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — The Circle',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#ccc', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        .legal-container { max-width: 760px; margin: 0 auto; padding: 60px 24px 80px; }
        .legal-title { font-family: 'Orbitron', sans-serif; font-size: 1.6rem; color: white; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .legal-subtitle { color: #555; font-size: 0.85rem; margin-bottom: 48px; }
        .legal-section { margin-bottom: 36px; }
        .legal-section h2 { font-size: 1rem; color: #FFC107; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: 600; }
        .legal-section p, .legal-section li { font-size: 0.9rem; line-height: 1.7; color: #888; }
        .legal-section ul { padding-left: 20px; }
        .legal-section li { margin-bottom: 6px; }
        .legal-back { display: inline-flex; align-items: center; gap: 8px; color: #444; font-size: 0.85rem; text-decoration: none; margin-bottom: 40px; transition: color 0.15s; }
        .legal-back:hover { color: #FFC107; }
        hr { border: none; border-top: 1px solid #1a1a1a; margin: 36px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 12px; }
        th { text-align: left; color: #555; font-weight: 600; padding: 8px 12px; border-bottom: 1px solid #1a1a1a; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 10px 12px; border-bottom: 1px solid #111; color: #777; vertical-align: top; }
      `}</style>

      <div className="legal-container">
        <Link href="/" className="legal-back">← Retour à l'accueil</Link>

        <h1 className="legal-title">Politique de confidentialité</h1>
        <p className="legal-subtitle">Dernière mise à jour : mars 2026 — Conforme au RGPD</p>

        <div className="legal-section">
          <h2>Responsable du traitement</h2>
          <p>
            Angelos Lemire — thecircle.contact@gmail.com<br />
            The Circle agit en tant que responsable du traitement des données personnelles collectées via la plateforme.
          </p>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Données collectées</h2>
          <table>
            <thead>
              <tr>
                <th>Donnée</th>
                <th>Finalité</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adresse email</td>
                <td>Authentification, communications</td>
                <td>Durée du compte + 1 an</td>
              </tr>
              <tr>
                <td>Pseudo / nom d'affichage</td>
                <td>Identification dans les communautés</td>
                <td>Durée du compte</td>
              </tr>
              <tr>
                <td>Photo de profil (optionnelle)</td>
                <td>Personnalisation du profil</td>
                <td>Durée du compte</td>
              </tr>
              <tr>
                <td>Adresse IP</td>
                <td>Sécurité, lutte contre la fraude</td>
                <td>90 jours (logs Vercel)</td>
              </tr>
              <tr>
                <td>Données d'utilisation (pages visitées)</td>
                <td>Statistiques anonymisées (Vercel Analytics)</td>
                <td>90 jours</td>
              </tr>
              <tr>
                <td>Données de performance (Core Web Vitals)</td>
                <td>Amélioration du service (Speed Insights)</td>
                <td>90 jours</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Base légale des traitements</h2>
          <ul>
            <li><strong style={{ color: '#ccc' }}>Exécution du contrat</strong> — création et gestion de votre compte</li>
            <li><strong style={{ color: '#ccc' }}>Consentement</strong> — cookies d'analyse (Analytics, Speed Insights)</li>
            <li><strong style={{ color: '#ccc' }}>Intérêt légitime</strong> — sécurité de la plateforme, prévention de la fraude</li>
          </ul>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Sous-traitants et transferts</h2>
          <ul>
            <li><strong style={{ color: '#ccc' }}>Supabase</strong> — hébergement base de données (Singapour / UE) — conforme RGPD</li>
            <li><strong style={{ color: '#ccc' }}>Vercel</strong> — hébergement applicatif (États-Unis) — couvert par les clauses contractuelles types de la Commission Européenne</li>
          </ul>
          <p style={{ marginTop: 12 }}>Aucune donnée n'est vendue ou partagée à des tiers à des fins commerciales.</p>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong style={{ color: '#ccc' }}>Accès</strong> — obtenir une copie de vos données</li>
            <li><strong style={{ color: '#ccc' }}>Rectification</strong> — corriger vos données inexactes</li>
            <li><strong style={{ color: '#ccc' }}>Suppression</strong> — demander la suppression de votre compte et données</li>
            <li><strong style={{ color: '#ccc' }}>Portabilité</strong> — recevoir vos données dans un format structuré</li>
            <li><strong style={{ color: '#ccc' }}>Opposition</strong> — vous opposer à certains traitements</li>
            <li><strong style={{ color: '#ccc' }}>Retrait du consentement</strong> — à tout moment pour les cookies</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Pour exercer vos droits : <a href="mailto:thecircle.contact@gmail.com" style={{ color: '#FFC107' }}>thecircle.contact@gmail.com</a>
            <br />Délai de réponse : 30 jours maximum.
          </p>
          <p style={{ marginTop: 12 }}>
            Vous pouvez également introduire une réclamation auprès de la{' '}
            <strong style={{ color: '#ccc' }}>CNIL</strong> (cnil.fr) si vous estimez que vos droits ne sont pas respectés.
          </p>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Cookies</h2>
          <p>
            The Circle utilise des cookies techniques (nécessaires au fonctionnement) et des cookies analytiques
            (Vercel Analytics et Speed Insights, anonymisés). Vous pouvez refuser les cookies analytiques
            via le bandeau affiché à votre première visite.
          </p>
        </div>
      </div>
    </div>
  )
}
