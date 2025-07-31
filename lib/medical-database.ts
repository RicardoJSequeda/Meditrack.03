// Sistema de base de datos médica local
export interface Symptom {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high'
  category: string
  relatedSymptoms: string[]
  possibleCauses: string[]
  whenToSeekHelp: string
}

export interface Diagnosis {
  id: string
  name: string
  description: string
  symptoms: string[]
  severity: 'low' | 'medium' | 'high'
  treatment: string
  prevention: string
  whenToSeekHelp: string
}

export interface Medication {
  id: string
  name: string
  genericName: string
  description: string
  uses: string[]
  sideEffects: string[]
  interactions: string[]
  dosage: string
  warnings: string
}

export interface MedicalArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  source: string
  lastUpdated: string
}

// Base de datos expandida de síntomas
export const symptomsDatabase: Symptom[] = [
  // Síntomas neurológicos
  {
    id: 'headache',
    name: 'Dolor de cabeza',
    description: 'Dolor o molestia en la cabeza, cuero cabelludo o cuello',
    severity: 'medium',
    category: 'Neurológico',
    relatedSymptoms: ['náusea', 'vómito', 'sensibilidad a la luz'],
    possibleCauses: ['tensión', 'migraña', 'deshidratación', 'fatiga visual'],
    whenToSeekHelp: 'Si es severo, persistente o acompañado de otros síntomas neurológicos'
  },
  {
    id: 'migraine',
    name: 'Migraña',
    description: 'Dolor de cabeza intenso y pulsátil, generalmente en un lado',
    severity: 'high',
    category: 'Neurológico',
    relatedSymptoms: ['náusea', 'vómito', 'sensibilidad a la luz', 'aura visual'],
    possibleCauses: ['factores genéticos', 'estrés', 'cambios hormonales', 'alimentos'],
    whenToSeekHelp: 'Si es muy intensa, frecuente o no responde al tratamiento'
  },
  {
    id: 'dizziness',
    name: 'Mareo',
    description: 'Sensación de desequilibrio o vértigo',
    severity: 'medium',
    category: 'Neurológico',
    relatedSymptoms: ['náusea', 'vómito', 'dificultad para caminar'],
    possibleCauses: ['deshidratación', 'baja presión arterial', 'infección del oído'],
    whenToSeekHelp: 'Si es severo, persistente o acompañado de otros síntomas'
  },
  {
    id: 'numbness',
    name: 'Entumecimiento',
    description: 'Pérdida de sensibilidad en una parte del cuerpo',
    severity: 'medium',
    category: 'Neurológico',
    relatedSymptoms: ['hormigueo', 'debilidad', 'dolor'],
    possibleCauses: ['compresión nerviosa', 'diabetes', 'esclerosis múltiple'],
    whenToSeekHelp: 'Si es persistente, severo o afecta múltiples áreas'
  },

  // Síntomas sistémicos
  {
    id: 'fever',
    name: 'Fiebre',
    description: 'Temperatura corporal elevada por encima de lo normal',
    severity: 'high',
    category: 'Sistémico',
    relatedSymptoms: ['escalofríos', 'sudoración', 'dolor muscular'],
    possibleCauses: ['infección', 'inflamación', 'reacción a medicamentos'],
    whenToSeekHelp: 'Si es alta (>39°C), persistente o en niños pequeños'
  },
  {
    id: 'fatigue',
    name: 'Fatiga',
    description: 'Cansancio extremo o falta de energía',
    severity: 'low',
    category: 'Sistémico',
    relatedSymptoms: ['dificultad para concentrarse', 'dolor muscular', 'cambios en el sueño'],
    possibleCauses: ['falta de sueño', 'estrés', 'anemia', 'enfermedad crónica'],
    whenToSeekHelp: 'Si es persistente y afecta la vida diaria'
  },
  {
    id: 'weight-loss',
    name: 'Pérdida de peso',
    description: 'Reducción no intencional del peso corporal',
    severity: 'medium',
    category: 'Sistémico',
    relatedSymptoms: ['pérdida de apetito', 'fatiga', 'debilidad'],
    possibleCauses: ['enfermedad crónica', 'cáncer', 'trastornos alimentarios'],
    whenToSeekHelp: 'Si es significativa (>5kg) o no intencional'
  },
  {
    id: 'night-sweats',
    name: 'Sudores nocturnos',
    description: 'Sudoración excesiva durante la noche',
    severity: 'medium',
    category: 'Sistémico',
    relatedSymptoms: ['fiebre', 'pérdida de peso', 'fatiga'],
    possibleCauses: ['infecciones', 'cáncer', 'menopausia', 'medicamentos'],
    whenToSeekHelp: 'Si son frecuentes o acompañados de otros síntomas'
  },

  // Síntomas digestivos
  {
    id: 'abdominal-pain',
    name: 'Dolor abdominal',
    description: 'Dolor en el área del abdomen',
    severity: 'medium',
    category: 'Digestivo',
    relatedSymptoms: ['náusea', 'vómito', 'diarrea', 'pérdida de apetito'],
    possibleCauses: ['indigestión', 'gastritis', 'apendicitis', 'úlcera'],
    whenToSeekHelp: 'Si es severo, persistente o acompañado de fiebre alta'
  },
  {
    id: 'nausea',
    name: 'Náusea',
    description: 'Sensación de malestar estomacal con ganas de vomitar',
    severity: 'medium',
    category: 'Digestivo',
    relatedSymptoms: ['vómito', 'dolor abdominal', 'pérdida de apetito'],
    possibleCauses: ['indigestión', 'infección', 'migraña', 'ansiedad'],
    whenToSeekHelp: 'Si es persistente, severa o acompañada de otros síntomas'
  },
  {
    id: 'vomiting',
    name: 'Vómito',
    description: 'Expulsión forzada del contenido del estómago',
    severity: 'medium',
    category: 'Digestivo',
    relatedSymptoms: ['náusea', 'dolor abdominal', 'deshidratación'],
    possibleCauses: ['infección viral', 'intoxicación alimentaria', 'migraña'],
    whenToSeekHelp: 'Si es persistente, severo o hay signos de deshidratación'
  },
  {
    id: 'diarrhea',
    name: 'Diarrea',
    description: 'Deposiciones líquidas y frecuentes',
    severity: 'medium',
    category: 'Digestivo',
    relatedSymptoms: ['dolor abdominal', 'náusea', 'deshidratación'],
    possibleCauses: ['infección viral', 'intoxicación alimentaria', 'medicamentos'],
    whenToSeekHelp: 'Si es severa, persistente o hay signos de deshidratación'
  },
  {
    id: 'constipation',
    name: 'Estreñimiento',
    description: 'Dificultad para evacuar o deposiciones infrecuentes',
    severity: 'low',
    category: 'Digestivo',
    relatedSymptoms: ['dolor abdominal', 'hinchazón', 'malestar'],
    possibleCauses: ['dieta baja en fibra', 'deshidratación', 'medicamentos'],
    whenToSeekHelp: 'Si es persistente o acompañado de dolor severo'
  },

  // Síntomas respiratorios
  {
    id: 'shortness-breath',
    name: 'Dificultad para respirar',
    description: 'Sensación de falta de aire o respiración dificultosa',
    severity: 'high',
    category: 'Respiratorio',
    relatedSymptoms: ['tos', 'dolor en el pecho', 'fatiga'],
    possibleCauses: ['asma', 'neumonía', 'ansiedad', 'enfermedad cardíaca'],
    whenToSeekHelp: 'Buscar atención médica inmediata si es severa'
  },
  {
    id: 'cough',
    name: 'Tos',
    description: 'Expulsión de aire de los pulmones de forma brusca',
    severity: 'low',
    category: 'Respiratorio',
    relatedSymptoms: ['dolor de garganta', 'congestión nasal', 'fiebre'],
    possibleCauses: ['resfriado', 'gripe', 'alergias', 'asma'],
    whenToSeekHelp: 'Si es persistente, severa o acompañada de fiebre alta'
  },
  {
    id: 'chest-pain',
    name: 'Dolor en el pecho',
    description: 'Dolor o molestia en el área del pecho',
    severity: 'high',
    category: 'Respiratorio',
    relatedSymptoms: ['dificultad para respirar', 'náusea', 'sudoración'],
    possibleCauses: ['angina', 'ataque cardíaco', 'reflujo', 'ansiedad'],
    whenToSeekHelp: 'Buscar atención médica inmediata'
  },

  // Síntomas cardiovasculares
  {
    id: 'palpitations',
    name: 'Palpitaciones',
    description: 'Sensación de latidos cardíacos irregulares o rápidos',
    severity: 'medium',
    category: 'Cardiovascular',
    relatedSymptoms: ['dolor en el pecho', 'dificultad para respirar', 'mareo'],
    possibleCauses: ['ansiedad', 'cafeína', 'enfermedad cardíaca', 'medicamentos'],
    whenToSeekHelp: 'Si son frecuentes, severas o acompañadas de otros síntomas'
  },
  {
    id: 'swelling-legs',
    name: 'Hinchazón en las piernas',
    description: 'Acumulación de líquido en las extremidades inferiores',
    severity: 'medium',
    category: 'Cardiovascular',
    relatedSymptoms: ['dificultad para respirar', 'fatiga', 'dolor'],
    possibleCauses: ['insuficiencia cardíaca', 'problemas renales', 'embarazo'],
    whenToSeekHelp: 'Si es severa, unilateral o acompañada de otros síntomas'
  },

  // Síntomas musculoesqueléticos
  {
    id: 'joint-pain',
    name: 'Dolor articular',
    description: 'Dolor en las articulaciones del cuerpo',
    severity: 'medium',
    category: 'Musculoesquelético',
    relatedSymptoms: ['rigidez', 'hinchazón', 'dificultad para moverse'],
    possibleCauses: ['artritis', 'lesión', 'uso excesivo', 'enfermedad autoinmune'],
    whenToSeekHelp: 'Si es severo, persistente o afecta múltiples articulaciones'
  },
  {
    id: 'back-pain',
    name: 'Dolor de espalda',
    description: 'Dolor en la región lumbar o dorsal',
    severity: 'medium',
    category: 'Musculoesquelético',
    relatedSymptoms: ['rigidez', 'dificultad para moverse', 'dolor irradiado'],
    possibleCauses: ['mala postura', 'lesión', 'hernia discal', 'estrés'],
    whenToSeekHelp: 'Si es severo, persistente o irradia a las piernas'
  },
  {
    id: 'muscle-pain',
    name: 'Dolor muscular',
    description: 'Dolor en los músculos del cuerpo',
    severity: 'low',
    category: 'Musculoesquelético',
    relatedSymptoms: ['rigidez', 'debilidad', 'fatiga'],
    possibleCauses: ['ejercicio excesivo', 'tensión', 'infección viral'],
    whenToSeekHelp: 'Si es severo, persistente o acompañado de otros síntomas'
  },

  // Síntomas dermatológicos
  {
    id: 'rash',
    name: 'Erupción cutánea',
    description: 'Cambios en la piel como manchas, protuberancias o ampollas',
    severity: 'medium',
    category: 'Dermatológico',
    relatedSymptoms: ['picazón', 'enrojecimiento', 'hinchazón'],
    possibleCauses: ['alergia', 'infección', 'enfermedad autoinmune', 'medicamentos'],
    whenToSeekHelp: 'Si es severa, extensa o acompañada de otros síntomas'
  },
  {
    id: 'itching',
    name: 'Picazón',
    description: 'Sensación de irritación que provoca ganas de rascarse',
    severity: 'low',
    category: 'Dermatológico',
    relatedSymptoms: ['erupción', 'enrojecimiento', 'sequedad'],
    possibleCauses: ['alergia', 'sequedad de piel', 'infección', 'estrés'],
    whenToSeekHelp: 'Si es severa, persistente o afecta grandes áreas'
  }
]

// Base de datos expandida de diagnósticos
export const diagnosisDatabase: Diagnosis[] = [
  {
    id: 'migraine',
    name: 'Migraña',
    description: 'Dolor de cabeza intenso y recurrente, generalmente en un lado de la cabeza',
    symptoms: ['dolor de cabeza', 'náusea', 'sensibilidad a la luz', 'vómito'],
    severity: 'medium',
    treatment: 'Descanso en lugar oscuro, medicamentos para el dolor, evitar desencadenantes',
    prevention: 'Identificar y evitar desencadenantes, mantener horarios regulares',
    whenToSeekHelp: 'Si es muy severa, frecuente o no responde al tratamiento'
  },
  {
    id: 'common-cold',
    name: 'Resfriado común',
    description: 'Infección viral del tracto respiratorio superior',
    symptoms: ['congestión nasal', 'estornudos', 'dolor de garganta', 'tos'],
    severity: 'low',
    treatment: 'Descanso, hidratación, medicamentos para síntomas',
    prevention: 'Lavado frecuente de manos, evitar contacto con personas enfermas',
    whenToSeekHelp: 'Si los síntomas persisten más de 10 días o empeoran'
  },
  {
    id: 'gastritis',
    name: 'Gastritis',
    description: 'Inflamación del revestimiento del estómago',
    symptoms: ['dolor abdominal', 'náusea', 'pérdida de apetito', 'indigestión'],
    severity: 'medium',
    treatment: 'Medicamentos antiácidos, cambios en la dieta, evitar irritantes',
    prevention: 'Evitar alimentos picantes, alcohol, tabaco, manejar el estrés',
    whenToSeekHelp: 'Si el dolor es severo, persistente o hay sangrado'
  },
  {
    id: 'hypertension',
    name: 'Hipertensión arterial',
    description: 'Presión arterial elevada de forma crónica',
    symptoms: ['dolor de cabeza', 'mareo', 'fatiga', 'dificultad para respirar'],
    severity: 'high',
    treatment: 'Medicamentos antihipertensivos, cambios en el estilo de vida',
    prevention: 'Dieta baja en sodio, ejercicio regular, control del peso',
    whenToSeekHelp: 'Monitoreo regular de la presión arterial'
  },
  {
    id: 'diabetes',
    name: 'Diabetes mellitus',
    description: 'Trastorno del metabolismo de la glucosa',
    symptoms: ['sed excesiva', 'orinar frecuentemente', 'fatiga', 'pérdida de peso'],
    severity: 'high',
    treatment: 'Medicamentos orales o insulina, dieta controlada, ejercicio',
    prevention: 'Mantener peso saludable, dieta equilibrada, ejercicio regular',
    whenToSeekHelp: 'Si hay síntomas de diabetes o antecedentes familiares'
  },
  {
    id: 'anxiety',
    name: 'Trastorno de ansiedad',
    description: 'Trastorno de salud mental caracterizado por preocupación excesiva',
    symptoms: ['preocupación excesiva', 'dificultad para respirar', 'palpitaciones', 'fatiga'],
    severity: 'medium',
    treatment: 'Terapia cognitivo-conductual, técnicas de relajación, medicamentos si es necesario',
    prevention: 'Técnicas de manejo del estrés, ejercicio regular, sueño adecuado',
    whenToSeekHelp: 'Si interfiere con la vida diaria o causa angustia severa'
  },
  {
    id: 'depression',
    name: 'Depresión',
    description: 'Trastorno del estado de ánimo caracterizado por tristeza persistente',
    symptoms: ['tristeza persistente', 'pérdida de interés', 'fatiga', 'cambios en el sueño'],
    severity: 'high',
    treatment: 'Terapia psicológica, medicamentos antidepresivos, cambios en el estilo de vida',
    prevention: 'Mantener relaciones sociales, ejercicio regular, manejo del estrés',
    whenToSeekHelp: 'Si los síntomas persisten más de 2 semanas o son severos'
  },
  {
    id: 'asthma',
    name: 'Asma',
    description: 'Enfermedad crónica que afecta las vías respiratorias',
    symptoms: ['dificultad para respirar', 'tos', 'sibilancias', 'opresión en el pecho'],
    severity: 'medium',
    treatment: 'Inhaladores broncodilatadores, corticosteroides, evitar desencadenantes',
    prevention: 'Evitar alérgenos, no fumar, ejercicio regular',
    whenToSeekHelp: 'Si hay ataques frecuentes o severos'
  },
  {
    id: 'arthritis',
    name: 'Artritis',
    description: 'Inflamación de las articulaciones',
    symptoms: ['dolor articular', 'rigidez', 'hinchazón', 'dificultad para moverse'],
    severity: 'medium',
    treatment: 'Medicamentos antiinflamatorios, fisioterapia, cambios en el estilo de vida',
    prevention: 'Mantener peso saludable, ejercicio regular, evitar lesiones',
    whenToSeekHelp: 'Si el dolor es severo, persistente o afecta la movilidad'
  },
  {
    id: 'urinary-tract-infection',
    name: 'Infección del tracto urinario',
    description: 'Infección bacteriana del sistema urinario',
    symptoms: ['dolor al orinar', 'frecuencia urinaria', 'dolor abdominal', 'fiebre'],
    severity: 'medium',
    treatment: 'Antibióticos, hidratación abundante, analgésicos',
    prevention: 'Buena higiene, hidratación adecuada, orinar después del sexo',
    whenToSeekHelp: 'Si hay fiebre, dolor severo o síntomas persistentes'
  }
]

// Base de datos expandida de medicamentos
export const medicationsDatabase: Medication[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    genericName: 'Acetaminofén',
    description: 'Medicamento para aliviar el dolor y reducir la fiebre',
    uses: ['dolor de cabeza', 'fiebre', 'dolor muscular', 'dolor dental'],
    sideEffects: ['náusea', 'dolor de estómago', 'reacciones alérgicas'],
    interactions: ['alcohol', 'anticoagulantes', 'otros analgésicos'],
    dosage: '500-1000mg cada 4-6 horas, máximo 4g por día',
    warnings: 'No exceder la dosis recomendada, consultar si hay enfermedad hepática'
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofeno',
    genericName: 'Ibuprofeno',
    description: 'Antiinflamatorio no esteroideo para dolor e inflamación',
    uses: ['dolor de cabeza', 'dolor muscular', 'inflamación', 'fiebre'],
    sideEffects: ['dolor de estómago', 'náusea', 'úlceras', 'problemas renales'],
    interactions: ['aspirina', 'anticoagulantes', 'diuréticos'],
    dosage: '200-400mg cada 4-6 horas, máximo 1200mg por día',
    warnings: 'Evitar en personas con úlceras o problemas renales'
  },
  {
    id: 'aspirin',
    name: 'Aspirina',
    genericName: 'Ácido acetilsalicílico',
    description: 'Medicamento para dolor, fiebre e inflamación',
    uses: ['dolor de cabeza', 'fiebre', 'dolor muscular', 'prevención de coágulos'],
    sideEffects: ['dolor de estómago', 'sangrado', 'úlceras', 'reacciones alérgicas'],
    interactions: ['anticoagulantes', 'otros antiinflamatorios', 'alcohol'],
    dosage: '325-650mg cada 4-6 horas, máximo 4g por día',
    warnings: 'No usar en niños con fiebre, evitar en personas con úlceras'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazol',
    genericName: 'Omeprazol',
    description: 'Inhibidor de la bomba de protones para reducir la acidez estomacal',
    uses: ['acidez estomacal', 'úlceras', 'reflujo gastroesofágico'],
    sideEffects: ['dolor de cabeza', 'náusea', 'diarrea', 'dolor abdominal'],
    interactions: ['anticoagulantes', 'hierro', 'vitamina B12'],
    dosage: '20-40mg una vez al día, antes del desayuno',
    warnings: 'No usar por más de 14 días sin consultar médico'
  },
  {
    id: 'loratadine',
    name: 'Loratadina',
    genericName: 'Loratadina',
    description: 'Antihistamínico para tratar alergias',
    uses: ['rinitis alérgica', 'urticaria', 'alergias estacionales'],
    sideEffects: ['somnolencia', 'dolor de cabeza', 'sequedad de boca'],
    interactions: ['alcohol', 'sedantes', 'antidepresivos'],
    dosage: '10mg una vez al día',
    warnings: 'Puede causar somnolencia, evitar conducir'
  },
  {
    id: 'metformin',
    name: 'Metformina',
    genericName: 'Metformina',
    description: 'Medicamento antidiabético oral para controlar la glucosa',
    uses: ['diabetes tipo 2', 'síndrome de ovario poliquístico'],
    sideEffects: ['náusea', 'diarrea', 'dolor abdominal', 'pérdida de apetito'],
    interactions: ['alcohol', 'diuréticos', 'corticosteroides'],
    dosage: '500-2000mg por día, dividido en 2-3 dosis',
    warnings: 'Tomar con alimentos, monitorear función renal'
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicilina',
    genericName: 'Amoxicilina',
    description: 'Antibiótico de amplio espectro para infecciones bacterianas',
    uses: ['infecciones respiratorias', 'infecciones del tracto urinario', 'otitis'],
    sideEffects: ['náusea', 'diarrea', 'erupción cutánea', 'candidiasis'],
    interactions: ['alcohol', 'anticoagulantes', 'anticonceptivos'],
    dosage: '250-500mg cada 8 horas, según la infección',
    warnings: 'Completar todo el tratamiento, puede afectar anticonceptivos'
  },
  {
    id: 'diphenhydramine',
    name: 'Difenhidramina',
    genericName: 'Difenhidramina',
    description: 'Antihistamínico sedante para alergias e insomnio',
    uses: ['alergias', 'insomnio', 'náusea', 'picazón'],
    sideEffects: ['somnolencia', 'sequedad de boca', 'visión borrosa', 'estreñimiento'],
    interactions: ['alcohol', 'sedantes', 'antidepresivos'],
    dosage: '25-50mg cada 4-6 horas para alergias, 50mg para insomnio',
    warnings: 'Causa somnolencia severa, no conducir o operar maquinaria'
  },
  {
    id: 'pseudoephedrine',
    name: 'Pseudoefedrina',
    genericName: 'Pseudoefedrina',
    description: 'Descongestionante nasal para aliviar la congestión',
    uses: ['congestión nasal', 'sinusitis', 'resfriado común'],
    sideEffects: ['insomnio', 'nerviosismo', 'aumento de presión arterial', 'palpitaciones'],
    interactions: ['antidepresivos', 'medicamentos para presión arterial'],
    dosage: '30-60mg cada 4-6 horas, máximo 240mg por día',
    warnings: 'Puede aumentar la presión arterial, evitar en hipertensos'
  },
  {
    id: 'guaifenesin',
    name: 'Guaifenesina',
    genericName: 'Guaifenesina',
    description: 'Expectorante para ayudar a expulsar la mucosidad',
    uses: ['tos productiva', 'congestión de pecho', 'bronquitis'],
    sideEffects: ['náusea', 'vómito', 'dolor de cabeza', 'mareo'],
    interactions: ['alcohol', 'sedantes', 'medicamentos para la tos'],
    dosage: '200-400mg cada 4 horas, máximo 2400mg por día',
    warnings: 'Beber mucha agua, puede causar náusea'
  }
]

// Base de datos expandida de artículos
export const medicalArticlesDatabase: MedicalArticle[] = [
  {
    id: 'article-1',
    title: 'Cómo prevenir la migraña',
    content: 'La migraña puede ser causada por factores hormonales, estrés y alimentos. Identifica tus desencadenantes y evítalos.',
    category: 'Neurológico',
    tags: ['migraña', 'tratamiento', 'prevención'],
    source: 'MedlinePlus',
    lastUpdated: '2023-01-15'
  },
  {
    id: 'article-2',
    title: 'Tratamiento de la fiebre',
    content: 'La fiebre es un mecanismo de defensa del cuerpo. Aprende a manejarla y cuándo buscar atención médica.',
    category: 'Sistémico',
    tags: ['fiebre', 'tratamiento', 'prevención'],
    source: 'MayoClinic',
    lastUpdated: '2023-02-20'
  },
  {
    id: 'article-3',
    title: 'Dieta saludable para la diabetes',
    content: 'Una dieta equilibrada y rica en fibra puede ayudar a controlar los niveles de glucosa en sangre.',
    category: 'Diabetes',
    tags: ['diabetes', 'dieta', 'control'],
    source: 'AmericanDiabetesAssociation',
    lastUpdated: '2023-03-10'
  },
  {
    id: 'article-4',
    title: 'Ejercicio para la ansiedad',
    content: 'El ejercicio regular puede ayudar a reducir los síntomas de la ansiedad y mejorar el estado de ánimo.',
    category: 'Ansiedad',
    tags: ['ansiedad', 'ejercicio', 'tratamiento'],
    source: 'NHS',
    lastUpdated: '2023-04-05'
  },
  {
    id: 'article-5',
    title: 'Cómo manejar la depresión',
    content: 'La depresión es un trastorno mental. Conoce los síntomas y cómo abordarlos.',
    category: 'Depresión',
    tags: ['depresión', 'tratamiento', 'síntomas'],
    source: 'MayoClinic',
    lastUpdated: '2023-05-15'
  }
]

// Funciones de búsqueda y recomendaciones
export class MedicalDatabaseService {
  // Buscar síntomas por nombre o descripción
  static searchSymptoms(query: string): Symptom[] {
    const searchTerm = query.toLowerCase()
    return symptomsDatabase.filter(symptom => 
      symptom.name.toLowerCase().includes(searchTerm) ||
      symptom.description.toLowerCase().includes(searchTerm) ||
      symptom.category.toLowerCase().includes(searchTerm)
    )
  }

  // Buscar diagnósticos por síntomas
  static findDiagnosisBySymptoms(symptomIds: string[]): Diagnosis[] {
    return diagnosisDatabase.filter(diagnosis => 
      diagnosis.symptoms.some(symptom => 
        symptomIds.some(id => 
          symptomsDatabase.find(s => s.id === id)?.name.toLowerCase().includes(symptom.toLowerCase())
        )
      )
    )
  }

  // Buscar medicamentos por uso
  static findMedicationsByUse(use: string): Medication[] {
    const searchTerm = use.toLowerCase()
    return medicationsDatabase.filter(medication => 
      medication.uses.some(use => use.toLowerCase().includes(searchTerm))
    )
  }

  // Obtener artículos por categoría
  static getArticlesByCategory(category: string): MedicalArticle[] {
    return medicalArticlesDatabase.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Evaluar severidad de síntomas
  static evaluateSymptomSeverity(symptomIds: string[]): 'low' | 'medium' | 'high' {
    const symptoms = symptomsDatabase.filter(s => symptomIds.includes(s.id))
    const highSeverityCount = symptoms.filter(s => s.severity === 'high').length
    const mediumSeverityCount = symptoms.filter(s => s.severity === 'medium').length

    if (highSeverityCount > 0) return 'high'
    if (mediumSeverityCount > 0) return 'medium'
    return 'low'
  }

  // Generar recomendaciones basadas en síntomas
  static generateRecommendations(symptomIds: string[]): {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  } {
    const severity = this.evaluateSymptomSeverity(symptomIds)
    const diagnoses = this.findDiagnosisBySymptoms(symptomIds)

    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    }

    if (severity === 'high') {
      recommendations.immediate.push('Buscar atención médica inmediata')
    }

    if (diagnoses.length > 0) {
      recommendations.shortTerm.push(`Considerar evaluación médica para: ${diagnoses.map(d => d.name).join(', ')}`)
    }

    recommendations.longTerm.push('Mantener un estilo de vida saludable')
    recommendations.longTerm.push('Realizar chequeos médicos regulares')

    return recommendations
  }

  // Obtener estadísticas de la base de datos
  static getDatabaseStats() {
    const categories = [...new Set(symptomsDatabase.map(s => s.category))]
    const severities = ['low', 'medium', 'high']
    
    return {
      totalSymptoms: symptomsDatabase.length,
      totalDiagnoses: diagnosisDatabase.length,
      totalMedications: medicationsDatabase.length,
      categories: categories.map(category => ({
        name: category,
        count: symptomsDatabase.filter(s => s.category === category).length
      })),
      severities: severities.map(severity => ({
        level: severity,
        count: symptomsDatabase.filter(s => s.severity === severity).length
      }))
    }
  }
} 