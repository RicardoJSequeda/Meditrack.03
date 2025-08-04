// Servicio para APIs médicas gratuitas
export interface MedicalAPIResponse {
  success: boolean
  data: any
  error?: string
}

export class MedicalAPIService {
  private static readonly OPENFDA_BASE_URL = 'https://api.fda.gov'
  private static readonly DISEASE_SH_BASE_URL = 'https://disease.sh/v3/covid-19'
  private static readonly WHO_BASE_URL = 'https://ghoapi.azureedge.net/api'

  // API de OpenFDA para medicamentos
  static async searchMedications(query: string): Promise<MedicalAPIResponse> {
    try {
      const response = await fetch(
        `${this.OPENFDA_BASE_URL}/drug/label.json?search=brand_name:${encodeURIComponent(query)}&limit=5`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data: data.results || []
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: `Error buscando medicamentos: ${error}`
      }
    }
  }

  // API de Disease.sh para estadísticas de enfermedades
  static async getDiseaseStats(disease: string): Promise<MedicalAPIResponse> {
    try {
      const response = await fetch(`${this.DISEASE_SH_BASE_URL}/countries`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: `Error obteniendo estadísticas: ${error}`
      }
    }
  }

  // Simulación de API de síntomas (ya que no hay API gratuita real)
  static async getSymptomInfo(symptom: string): Promise<MedicalAPIResponse> {
    try {
      // Simular respuesta basada en datos locales
      const symptomData = {
        name: symptom,
        description: `Información médica sobre ${symptom}`,
        causes: ['Causa común 1', 'Causa común 2'],
        treatments: ['Tratamiento 1', 'Tratamiento 2'],
        whenToSeekHelp: 'Consultar médico si persiste o empeora'
      }
      
      return {
        success: true,
        data: symptomData
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: `Error obteniendo información del síntoma: ${error}`
      }
    }
  }

  // Simulación de API de diagnósticos
  static async getDiagnosisInfo(diagnosis: string): Promise<MedicalAPIResponse> {
    try {
      const diagnosisData = {
        name: diagnosis,
        description: `Información sobre ${diagnosis}`,
        symptoms: ['Síntoma 1', 'Síntoma 2'],
        treatment: 'Tratamiento recomendado',
        prevention: 'Medidas preventivas'
      }
      
      return {
        success: true,
        data: diagnosisData
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: `Error obteniendo información del diagnóstico: ${error}`
      }
    }
  }

  // Obtener información médica combinada
  static async getMedicalInfo(query: string, type: 'symptom' | 'medication' | 'diagnosis'): Promise<MedicalAPIResponse> {
    switch (type) {
      case 'medication':
        return await this.searchMedications(query)
      case 'symptom':
        return await this.getSymptomInfo(query)
      case 'diagnosis':
        return await this.getDiagnosisInfo(query)
      default:
        return {
          success: false,
          data: null,
          error: 'Tipo de consulta no soportado'
        }
    }
  }

  // Verificar disponibilidad de APIs
  static async checkAPIHealth(): Promise<{
    openfda: boolean
    diseaseSh: boolean
    overall: boolean
  }> {
    const results = {
      openfda: false,
      diseaseSh: false,
      overall: false
    }

    try {
      // Verificar OpenFDA
      const openfdaResponse = await fetch(`${this.OPENFDA_BASE_URL}/drug/label.json?limit=1`)
      results.openfda = openfdaResponse.ok
    } catch (error) {
      console.log('OpenFDA API no disponible:', error)
    }

    try {
      // Verificar Disease.sh
      const diseaseResponse = await fetch(`${this.DISEASE_SH_BASE_URL}/all`)
      results.diseaseSh = diseaseResponse.ok
    } catch (error) {
      console.log('Disease.sh API no disponible:', error)
    }

    results.overall = results.openfda || results.diseaseSh
    return results
  }
} 