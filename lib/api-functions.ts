// Funciones para manejar las operaciones CRUD de registros médicos

export interface DiagnosisData {
  condition: string
  diagnosedDate: string
  doctor: string
  specialty: string
  severity: 'LEVE' | 'MODERADA' | 'GRAVE'
  status: 'ACTIVA' | 'CONTROLADA' | 'RESUELTA'
  lastReading?: string
  nextCheckup?: string
  notes?: string
}

export interface TreatmentData {
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  adherence?: number
  status: 'ACTIVO' | 'SUSPENDIDO' | 'COMPLETADO'
  sideEffects?: string
  doctorNotes?: string
  prescribedBy: string
  diagnosisId?: string
}

export interface MedicalEventData {
  type: 'CIRUGIA' | 'EMERGENCIA' | 'VACUNA' | 'CONSULTA' | 'HOSPITALIZACION' | 'PROCEDIMIENTO'
  title: string
  date: string
  location: string
  doctor: string
  description: string
  outcome: string
  followUp?: string
}

export interface MedicalDocumentData {
  type: 'ANALISIS' | 'RADIOGRAFIA' | 'INFORME' | 'RECETA' | 'CERTIFICADO' | 'NOTA'
  title: string
  date: string
  doctor: string
  category: string
  description: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  results?: string
  recommendations?: string
}

// Función para obtener el token del localStorage
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Función para decodificar el token y obtener el userId
export function getUserId(): string | null {
  const token = getToken()
  if (!token) return null

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    const payload = JSON.parse(jsonPayload)
    return payload.userId
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

// Función genérica para hacer peticiones a las APIs
async function apiRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const url = new URL(endpoint, window.location.origin)
  if (method === 'GET') {
    url.searchParams.set('userId', userId)
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: method !== 'GET' ? JSON.stringify({ ...data, userId }) : undefined
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Funciones para diagnósticos
export async function createDiagnosis(data: DiagnosisData) {
  return apiRequest('/api/diagnoses', 'POST', data)
}

export async function getDiagnoses() {
  return apiRequest('/api/diagnoses', 'GET')
}

// Funciones para tratamientos
export async function createTreatment(data: TreatmentData) {
  return apiRequest('/api/treatments', 'POST', data)
}

export async function getTreatments() {
  return apiRequest('/api/treatments', 'GET')
}

// Funciones para eventos médicos
export async function createMedicalEvent(data: MedicalEventData) {
  return apiRequest('/api/medical-events', 'POST', data)
}

export async function getMedicalEvents() {
  return apiRequest('/api/medical-events', 'GET')
}

// Funciones para documentos médicos
export async function createMedicalDocument(data: MedicalDocumentData) {
  return apiRequest('/api/medical-documents', 'POST', data)
}

export async function getMedicalDocuments() {
  return apiRequest('/api/medical-documents', 'GET')
}

// Función para subir archivo
export async function uploadFile(file: File): Promise<{
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  storagePath: string
}> {
  const token = getToken()
  const userId = getUserId()

  if (!token || !userId) {
    throw new Error('No hay token de autenticación o userId')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)

  const response = await fetch('/api/upload-file', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

// Función para validar datos antes de enviar
export function validateDiagnosisData(data: any): DiagnosisData {
  const required = ['condition', 'diagnosedDate', 'doctor', 'specialty', 'severity', 'status']
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es requerido`)
    }
  }

  if (!['LEVE', 'MODERADA', 'GRAVE'].includes(data.severity)) {
    throw new Error('La severidad debe ser LEVE, MODERADA o GRAVE')
  }

  if (!['ACTIVA', 'CONTROLADA', 'RESUELTA'].includes(data.status)) {
    throw new Error('El estado debe ser ACTIVA, CONTROLADA o RESUELTA')
  }

  return data as DiagnosisData
}

export function validateTreatmentData(data: any): TreatmentData {
  const required = ['medication', 'dosage', 'frequency', 'startDate', 'prescribedBy', 'status']
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es requerido`)
    }
  }

  if (!['ACTIVO', 'SUSPENDIDO', 'COMPLETADO'].includes(data.status)) {
    throw new Error('El estado debe ser ACTIVO, SUSPENDIDO o COMPLETADO')
  }

  return data as TreatmentData
}

export function validateMedicalEventData(data: any): MedicalEventData {
  const required = ['type', 'title', 'date', 'location', 'doctor', 'description', 'outcome']
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es requerido`)
    }
  }

  if (!['CIRUGIA', 'EMERGENCIA', 'VACUNA', 'CONSULTA', 'HOSPITALIZACION', 'PROCEDIMIENTO'].includes(data.type)) {
    throw new Error('El tipo debe ser CIRUGIA, EMERGENCIA, VACUNA, CONSULTA, HOSPITALIZACION o PROCEDIMIENTO')
  }

  return data as MedicalEventData
}

export function validateMedicalDocumentData(data: any): MedicalDocumentData {
  const required = ['type', 'title', 'date', 'doctor', 'category', 'description']
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es requerido`)
    }
  }

  if (!['ANALISIS', 'RADIOGRAFIA', 'INFORME', 'RECETA', 'CERTIFICADO', 'NOTA'].includes(data.type)) {
    throw new Error('El tipo debe ser ANALISIS, RADIOGRAFIA, INFORME, RECETA, CERTIFICADO o NOTA')
  }

  return data as MedicalDocumentData
} 