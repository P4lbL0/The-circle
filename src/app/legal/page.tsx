import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — The Circle',
}

export default function LegalPage() {
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
        .legal-section li { margin-bottom: 4px; }
        .legal-back { display: inline-flex; align-items: center; gap: 8px; color: #444; font-size: 0.85rem; text-decoration: none; margin-bottom: 40px; transition: color 0.15s; }
        .legal-back:hover { color: #FFC107; }
        hr { border: none; border-top: 1px solid #1a1a1a; margin: 36px 0; }
      `}</style>

      <div className="legal-container">
        <Link href="/" className="legal-back">← Retour à l'accueil</Link>

        <h1 className="legal-title">Mentions légales</h1>
        <p className="legal-subtitle">Dernière mise à jour : mars 2026</p>

        <div className="legal-section">
          <h2>Éditeur du site</h2>
          <ul>
            <li><strong style={{ color: '#ccc' }}>Nom :</strong> Angelos Lemire</li>
            <li><strong style={{ color: '#ccc' }}>Statut :</strong> Particulier</li>
            <li><strong style={{ color: '#ccc' }}>Adresse :</strong> [ADRESSE À COMPLÉTER]</li>
            <li><strong style={{ color: '#ccc' }}>Email :</strong> thecircle.contact@gmail.com</li>
          </ul>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Hébergement</h2>
          <ul>
            <li><strong style={{ color: '#ccc' }}>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong style={{ color: '#ccc' }}>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
            <li><strong style={{ color: '#ccc' }}>Site :</strong> vercel.com</li>
          </ul>
          <br />
          <ul>
            <li><strong style={{ color: '#ccc' }}>Base de données :</strong> Supabase Inc.</li>
            <li><strong style={{ color: '#ccc' }}>Adresse :</strong> 970 Toa Payoh North, Singapour</li>
            <li><strong style={{ color: '#ccc' }}>Site :</strong> supabase.com</li>
          </ul>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu présent sur The Circle (textes, graphismes, logos, icônes, images, code source)
            est la propriété exclusive d'Angelos Lemire, sauf mention contraire.
            Toute reproduction, distribution ou exploitation sans autorisation écrite préalable est interdite.
          </p>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Limitation de responsabilité</h2>
          <p>
            The Circle ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation
            du site ou de l'impossibilité d'y accéder. Les informations présentes sur le site sont fournies à titre
            indicatif et peuvent être modifiées à tout moment.
          </p>
        </div>

        <hr />

        <div className="legal-section">
          <h2>Contact</h2>
          <p>Pour toute question : <a href="mailto:thecircle.contact@gmail.com" style={{ color: '#FFC107' }}>thecircle.contact@gmail.com</a></p>
        </div>
      </div>
    </div>
  )
}
