// Templates de spécifications techniques par catégorie

export interface SpecificationField {
  key: string
  label: string
  placeholder: string
  suggestions?: string[]
}

export interface SpecificationTemplate {
  [category: string]: SpecificationField[]
}

// Templates de spécifications par catégorie de produit
export const SPECIFICATION_TEMPLATES: Record<string, SpecificationField[]> = {
  phones: [
    {
      key: 'ecran_taille',
      label: 'Taille écran',
      placeholder: 'Ex: 6,7 pouces',
      suggestions: ['6,1"', '6,3"', '6,5"', '6,7"', '6,8"', '6,9"']
    },
    {
      key: 'ecran_type',
      label: 'Type écran',
      placeholder: 'Ex: OLED Super Retina XDR',
      suggestions: ['OLED', 'AMOLED', 'Super AMOLED', 'LTPO OLED', 'LCD', 'IPS LCD', 'Liquid Retina', 'Super Retina XDR', 'Dynamic AMOLED']
    },
    {
      key: 'ecran_refresh',
      label: 'Taux rafraîchissement',
      placeholder: 'Ex: 120 Hz',
      suggestions: ['60 Hz', '90 Hz', '120 Hz', '144 Hz', 'ProMotion 120 Hz']
    },
    {
      key: 'processeur',
      label: 'Processeur',
      placeholder: 'Ex: A17 Pro Bionic',
      suggestions: ['A17 Pro', 'A16 Bionic', 'A15 Bionic', 'Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2', 'Snapdragon 8 Gen 1', 'Exynos 2400', 'Google Tensor G3', 'MediaTek Dimensity 9300']
    },
    {
      key: 'ram',
      label: 'Mémoire RAM',
      placeholder: 'Ex: 8 Go',
      suggestions: ['4 Go', '6 Go', '8 Go', '12 Go', '16 Go', '18 Go']
    },
    {
      key: 'batterie_capacite',
      label: 'Capacité batterie',
      placeholder: 'Ex: 4323 mAh',
      suggestions: ['3000 mAh', '4000 mAh', '4500 mAh', '5000 mAh', '5500 mAh']
    },
    {
      key: 'batterie_charge',
      label: 'Charge rapide',
      placeholder: 'Ex: 25W',
      suggestions: ['20W', '25W', '30W', '45W', '65W', '80W', '100W', '120W']
    },
    {
      key: 'camera_principale',
      label: 'Caméra principale',
      placeholder: 'Ex: 48 MP',
      suggestions: ['12 MP', '48 MP', '50 MP', '64 MP', '108 MP', '200 MP']
    },
    {
      key: 'camera_ultra_wide',
      label: 'Ultra grand-angle',
      placeholder: 'Ex: 12 MP',
      suggestions: ['8 MP', '12 MP', '13 MP', '16 MP', '48 MP', '50 MP']
    },
    {
      key: 'camera_telephoto',
      label: 'Téléobjectif',
      placeholder: 'Ex: 12 MP 5x',
      suggestions: ['Aucun', '12 MP 3x', '12 MP 5x', '10 MP 3x', '10 MP 10x', 'Périscope 5x']
    },
    {
      key: 'camera_frontale',
      label: 'Caméra frontale',
      placeholder: 'Ex: 12 MP',
      suggestions: ['8 MP', '10 MP', '12 MP', '16 MP', '32 MP', '40 MP']
    },
    {
      key: 'video',
      label: 'Vidéo',
      placeholder: 'Ex: 4K 60fps',
      suggestions: ['1080p 30fps', '1080p 60fps', '4K 30fps', '4K 60fps', '8K 30fps', '8K 60fps']
    },
    {
      key: 'os',
      label: 'Système d\'exploitation',
      placeholder: 'Ex: iOS 17',
      suggestions: ['iOS 18', 'iOS 17', 'iOS 16', 'Android 15', 'Android 14', 'Android 13', 'One UI 6', 'One UI 5', 'MIUI 14', 'HyperOS']
    },
    {
      key: 'connectivite',
      label: 'Connectivité',
      placeholder: 'Ex: 5G, WiFi 6E, Bluetooth 5.3',
      suggestions: ['5G', '4G LTE', 'WiFi 6', 'WiFi 6E', 'WiFi 7', 'Bluetooth 5.3', 'Bluetooth 5.2', 'NFC']
    },
    {
      key: 'etancheite',
      label: 'Étanchéité',
      placeholder: 'Ex: IP68',
      suggestions: ['IP67', 'IP68', 'IP69']
    },
    {
      key: 'biometrie',
      label: 'Biométrie',
      placeholder: 'Ex: Face ID',
      suggestions: ['Face ID', 'Touch ID', 'Lecteur empreinte sous écran', 'Lecteur empreinte latéral', 'Reconnaissance faciale 2D']
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      placeholder: 'Ex: 160.8 x 78.1 x 7.8 mm'
    },
    {
      key: 'poids',
      label: 'Poids',
      placeholder: 'Ex: 221 g'
    }
  ],

  watches: [
    {
      key: 'ecran_taille',
      label: 'Taille écran',
      placeholder: 'Ex: 1,9 pouces',
      suggestions: ['1,4"', '1,5"', '1,6"', '1,7"', '1,9"', '2,0"']
    },
    {
      key: 'ecran_type',
      label: 'Type écran',
      placeholder: 'Ex: AMOLED Always-On',
      suggestions: ['AMOLED', 'OLED', 'LCD', 'LTPO AMOLED', 'Retina LTPO OLED']
    },
    {
      key: 'boitier_taille',
      label: 'Taille boîtier',
      placeholder: 'Ex: 45 mm',
      suggestions: ['40 mm', '41 mm', '42 mm', '44 mm', '45 mm', '46 mm', '49 mm']
    },
    {
      key: 'materiau',
      label: 'Matériau boîtier',
      placeholder: 'Ex: Aluminium',
      suggestions: ['Aluminium', 'Acier inoxydable', 'Titane', 'Céramique', 'Plastique renforcé']
    },
    {
      key: 'batterie',
      label: 'Autonomie batterie',
      placeholder: 'Ex: Jusqu\'à 18 heures',
      suggestions: ['Jusqu\'à 1 jour', 'Jusqu\'à 2 jours', 'Jusqu\'à 5 jours', 'Jusqu\'à 7 jours', 'Jusqu\'à 14 jours']
    },
    {
      key: 'capteurs',
      label: 'Capteurs',
      placeholder: 'Ex: Fréquence cardiaque, SpO2, ECG',
      suggestions: ['Fréquence cardiaque', 'SpO2', 'ECG', 'Température', 'Accéléromètre', 'Gyroscope', 'Altimètre']
    },
    {
      key: 'gps',
      label: 'GPS',
      placeholder: 'Ex: GPS double fréquence',
      suggestions: ['GPS', 'GPS + GLONASS', 'GPS double fréquence', 'GPS multibande']
    },
    {
      key: 'connectivite',
      label: 'Connectivité',
      placeholder: 'Ex: Bluetooth 5.3, WiFi',
      suggestions: ['Bluetooth 5.0', 'Bluetooth 5.3', 'WiFi', 'LTE', '4G', '5G', 'NFC']
    },
    {
      key: 'etancheite',
      label: 'Résistance eau',
      placeholder: 'Ex: 5 ATM',
      suggestions: ['IP68', '5 ATM', '10 ATM', '50 mètres', '100 mètres', 'WR50']
    },
    {
      key: 'os',
      label: 'Système',
      placeholder: 'Ex: watchOS 10',
      suggestions: ['watchOS 11', 'watchOS 10', 'Wear OS 4', 'Wear OS 3', 'HarmonyOS', 'Fitbit OS', 'Garmin OS']
    }
  ],

  earphones: [
    {
      key: 'type',
      label: 'Type',
      placeholder: 'Ex: Intra-auriculaires',
      suggestions: ['Intra-auriculaires', 'Circum-auriculaires', 'Supra-auriculaires', 'Semi intra-auriculaires']
    },
    {
      key: 'anc',
      label: 'Réduction de bruit',
      placeholder: 'Ex: ANC adaptive',
      suggestions: ['ANC active', 'ANC adaptive', 'ANC hybride', 'Réduction passive', 'Sans ANC']
    },
    {
      key: 'autonomie_ecouteurs',
      label: 'Autonomie écouteurs',
      placeholder: 'Ex: 6 heures',
      suggestions: ['4h', '5h', '6h', '7h', '8h', '10h', '12h']
    },
    {
      key: 'autonomie_boitier',
      label: 'Autonomie totale (avec boîtier)',
      placeholder: 'Ex: 30 heures',
      suggestions: ['20h', '24h', '30h', '36h', '40h', '50h']
    },
    {
      key: 'charge',
      label: 'Charge rapide',
      placeholder: 'Ex: 5 min = 1h d\'écoute'
    },
    {
      key: 'connectivite',
      label: 'Connectivité',
      placeholder: 'Ex: Bluetooth 5.3',
      suggestions: ['Bluetooth 5.0', 'Bluetooth 5.2', 'Bluetooth 5.3', 'aptX', 'LDAC', 'AAC']
    },
    {
      key: 'drivers',
      label: 'Drivers',
      placeholder: 'Ex: 11mm dynamiques',
      suggestions: ['6mm', '8mm', '10mm', '11mm', '12mm', '40mm', '50mm']
    },
    {
      key: 'certification',
      label: 'Certifications',
      placeholder: 'Ex: Hi-Res Audio',
      suggestions: ['Hi-Res Audio', 'Dolby Atmos', 'Sony 360 Reality Audio', 'Spatial Audio']
    },
    {
      key: 'etancheite',
      label: 'Résistance eau',
      placeholder: 'Ex: IPX4',
      suggestions: ['IPX2', 'IPX4', 'IPX5', 'IPX7', 'IP55', 'IP57']
    },
    {
      key: 'compatibilite',
      label: 'Compatibilité',
      placeholder: 'Ex: iOS, Android',
      suggestions: ['iOS uniquement', 'Android uniquement', 'iOS & Android', 'Multipoint', 'Universal']
    }
  ],

  cases: [
    {
      key: 'compatibilite',
      label: 'Compatible avec',
      placeholder: 'Ex: iPhone 15 Pro Max'
    },
    {
      key: 'materiau',
      label: 'Matériau',
      placeholder: 'Ex: Silicone',
      suggestions: ['Silicone', 'TPU', 'Polycarbonate', 'Aluminium', 'Cuir', 'Aramide', 'Tissu']
    },
    {
      key: 'protection',
      label: 'Protection',
      placeholder: 'Ex: Chute 4 mètres',
      suggestions: ['MIL-STD-810G', 'Chute 1m', 'Chute 2m', 'Chute 3m', 'Chute 4m', '360°']
    },
    {
      key: 'caracteristiques',
      label: 'Caractéristiques',
      placeholder: 'Ex: MagSafe, Support sans fil',
      suggestions: ['MagSafe', 'Qi compatible', 'Support sans fil', 'Béquille', 'Porte-cartes', 'Antidérapante']
    }
  ],

  accessories: [
    {
      key: 'type',
      label: 'Type d\'accessoire',
      placeholder: 'Ex: Chargeur, Câble, Protection écran'
    },
    {
      key: 'compatibilite',
      label: 'Compatibilité',
      placeholder: 'Ex: iPhone 15 Pro, Samsung Galaxy S24'
    }
  ],

  electronics: [
    {
      key: 'type',
      label: 'Type de produit',
      placeholder: 'Ex: Powerbank, Adaptateur'
    }
  ]
}

// Helper pour obtenir le template selon la catégorie
export function getSpecificationTemplate(category: string): SpecificationField[] {
  return SPECIFICATION_TEMPLATES[category] || SPECIFICATION_TEMPLATES.accessories
}

// Helper pour générer une clé unique pour une nouvelle spécification
export function generateSpecKey(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
