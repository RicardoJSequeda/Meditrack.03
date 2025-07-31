import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useApi } from '@/hooks/use-api'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const { put } = useApi()

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Todos los campos son requeridos' })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' })
      setLoading(false)
      return
    }

    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número' })
      setLoading(false)
      return
    }

    try {
      const response = await put('/api/auth/change-password', {
        currentPassword,
        newPassword
      })

      if (response.success) {
        setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' })
        // Limpiar formulario
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onClose()
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al cambiar la contraseña' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña. Verifica tu contraseña actual.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage(null)
      onClose()
    }
  }

  const validation = validatePassword(newPassword)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={loading}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Validación de contraseña */}
            {newPassword && (
              <div className="space-y-1 text-xs">
                <div className={`flex items-center gap-1 ${validation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${validation.minLength ? 'bg-green-600' : 'bg-gray-400'}`} />
                  Al menos 6 caracteres
                </div>
                <div className={`flex items-center gap-1 ${validation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${validation.hasUpperCase ? 'bg-green-600' : 'bg-gray-400'}`} />
                  Una letra mayúscula
                </div>
                <div className={`flex items-center gap-1 ${validation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${validation.hasLowerCase ? 'bg-green-600' : 'bg-gray-400'}`} />
                  Una letra minúscula
                </div>
                <div className={`flex items-center gap-1 ${validation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${validation.hasNumber ? 'bg-green-600' : 'bg-gray-400'}`} />
                  Un número
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !validation.isValid || newPassword !== confirmPassword}
              className="flex-1"
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 