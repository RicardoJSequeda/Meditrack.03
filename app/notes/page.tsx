"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  StickyNote,
  Calendar,
  Star,
  Archive,
  Pin,
  Edit,
  Trash2,
  Download,
  BarChart3,
  FileText,
  Heart,
  Pill,
  Activity,
  User,
  BookOpen,
} from "lucide-react"
import { useNotes, updateNote, deleteNote as deleteNoteApi } from '@/hooks/use-notes'
import { WelcomeMessage } from '@/components/welcome-message'

interface Note {
  id: string
  title: string
  content: string
  category: "personal" | "medico" | "cita" | "medicacion" | "sintoma" | "general"
  tags: string[]
  isPinned: boolean
  isFavorite: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  wordCount: number
}

const categories = [
  { id: "personal", name: "Personal", icon: User, color: "bg-blue-100 text-blue-800" },
  { id: "medico", name: "Médico", icon: Heart, color: "bg-red-100 text-red-800" },
  { id: "cita", name: "Cita", icon: Calendar, color: "bg-green-100 text-green-800" },
  { id: "medicacion", name: "Medicación", icon: Pill, color: "bg-purple-100 text-purple-800" },
  { id: "sintoma", name: "Síntoma", icon: Activity, color: "bg-orange-100 text-orange-800" },
  { id: "general", name: "General", icon: FileText, color: "bg-gray-100 text-gray-800" },
]

const popularTags = ["dolor", "medicamento", "seguimiento", "consulta", "ejercicio", "dieta", "sueño", "presión"]

export default function NotesPage() {
  const { notes, isLoading, mutate } = useNotes()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [showArchived, setShowArchived] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general" as Note["category"],
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  // Datos simulados
  useEffect(() => {
    // const mockNotes: Note[] = [
    //   {
    //     id: "1",
    //     title: "Consulta con Dr. García",
    //     content: "Revisión general. Presión arterial: 120/80. Peso: 68kg. Todo normal. Próxima cita en 3 meses.",
    //     category: "medico",
    //     tags: ["consulta", "presión", "peso"],
    //     isPinned: true,
    //     isFavorite: true,
    //     isArchived: false,
    //     createdAt: "2024-01-15T10:30:00Z",
    //     updatedAt: "2024-01-15T10:30:00Z",
    //     wordCount: 18,
    //   },
    //   {
    //     id: "2",
    //     title: "Medicamentos actuales",
    //     content: "Losartán 50mg - 1 vez al día por la mañana. Metformina 500mg - 2 veces al día con comidas.",
    //     category: "medicacion",
    //     tags: ["medicamento", "losartan", "metformina"],
    //     isPinned: true,
    //     isFavorite: false,
    //     isArchived: false,
    //     createdAt: "2024-01-14T08:00:00Z",
    //     updatedAt: "2024-01-14T08:00:00Z",
    //     wordCount: 16,
    //   },
    //   {
    //     id: "3",
    //     title: "Síntomas de ayer",
    //     content:
    //       "Dolor de cabeza leve por la tarde. Posiblemente relacionado con el estrés del trabajo. Mejoró después de descansar.",
    //     category: "sintoma",
    //     tags: ["dolor", "cabeza", "estrés"],
    //     isPinned: false,
    //     isFavorite: false,
    //     isArchived: false,
    //     createdAt: "2024-01-13T16:45:00Z",
    //     updatedAt: "2024-01-13T16:45:00Z",
    //     wordCount: 19,
    //   },
    //   {
    //     id: "4",
    //     title: "Plan de ejercicios",
    //     content: "Caminar 30 minutos diarios. Ejercicios de estiramiento por las mañanas. Yoga los fines de semana.",
    //     category: "personal",
    //     tags: ["ejercicio", "caminar", "yoga"],
    //     isPinned: false,
    //     isFavorite: true,
    //     isArchived: false,
    //     createdAt: "2024-01-12T07:00:00Z",
    //     updatedAt: "2024-01-12T07:00:00Z",
    //     wordCount: 15,
    //   },
    //   {
    //     id: "5",
    //     title: "Cita con nutricionista",
    //     content: "Programada para el 25 de enero a las 2:00 PM. Llevar diario de comidas de la semana pasada.",
    //     category: "cita",
    //     tags: ["cita", "nutricionista", "dieta"],
    //     isPinned: false,
    //     isFavorite: false,
    //     isArchived: false,
    //     createdAt: "2024-01-11T14:20:00Z",
    //     updatedAt: "2024-01-11T14:20:00Z",
    //     wordCount: 16,
    //   },
    // ]
    // setNotes(mockNotes)
  }, [])

  const filteredNotes = notes.filter((note: Note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    const matchesTag = selectedTag === "all" || note.tags.includes(selectedTag)
    const matchesArchived = showArchived ? note.isArchived : !note.isArchived

    return matchesSearch && matchesCategory && matchesTag && matchesArchived
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const pinnedNotes = sortedNotes.filter((note: Note) => note.isPinned)
  const regularNotes = sortedNotes.filter((note: Note) => !note.isPinned)

  const handleCreateNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: newNote.content.split(" ").length,
    }
    // setNotes([note, ...notes])
    // setNewNote({ title: "", content: "", category: "general", tags: [] })
    // setIsCreateModalOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
    })
    setIsCreateModalOpen(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    // const updatedNotes = notes.map((note) =>
    //   note.id === editingNote.id
    //     ? {
    //         ...note,
    //         title: newNote.title,
    //         content: newNote.content,
    //         category: newNote.category,
    //         tags: newNote.tags,
    //         updatedAt: new Date().toISOString(),
    //         wordCount: newNote.content.split(" ").length,
    //       }
    //     : note,
    // )
    // setNotes(updatedNotes)
    setEditingNote(null)
    setNewNote({ title: "", content: "", category: "general", tags: [] })
    setIsCreateModalOpen(false)
  }

  const handleTogglePin = async (id: string, value: boolean) => {
    await updateNote(id, { isPinned: value })
    mutate()
  }
  const handleToggleFavorite = async (id: string, value: boolean) => {
    await updateNote(id, { isFavorite: value })
    mutate()
  }
  const handleToggleArchive = async (id: string, value: boolean) => {
    await updateNote(id, { isArchived: value })
    mutate()
  }
  const handleDeleteNote = async (id: string) => {
    await deleteNoteApi(id)
    mutate()
  }

  const addTag = () => {
    if (newTag && !newNote.tags.includes(newTag)) {
      setNewNote({ ...newNote, tags: [...newNote.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewNote({ ...newNote, tags: newNote.tags.filter((tag) => tag !== tagToRemove) })
  }

  // Exportar avanzado
  const [exportType, setExportType] = useState<'all' | 'favorites' | 'archived' | 'pinned'>('all')
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')

  const getExportNotes = () => {
    if (exportType === 'favorites') return notes.filter((n: Note) => n.isFavorite && !n.isArchived)
    if (exportType === 'archived') return notes.filter((n: Note) => n.isArchived)
    if (exportType === 'pinned') return notes.filter((n: Note) => n.isPinned && !n.isArchived)
    return notes
  }

  const exportNotes = () => {
    const exportNotes = getExportNotes()
    let dataStr = ''
    let exportFileDefaultName = 'mis-notas-meditrack.' + exportFormat
    if (exportFormat === 'json') {
      dataStr = JSON.stringify(exportNotes, null, 2)
    } else {
      // CSV
      const headers = ['title','content','category','isPinned','isFavorite','isArchived','createdAt','updatedAt']
      const rows = exportNotes.map((n: Note) => headers.map(h => JSON.stringify((n as any)[h] ?? '')).join(','))
      dataStr = headers.join(',') + '\n' + rows.join('\n')
    }
    const dataUri = 'data:text/' + (exportFormat === 'json' ? 'json' : 'csv') + ';charset=utf-8,' + encodeURIComponent(dataStr)
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[5]
  }

  const getStats = () => {
    const total = notes.filter((n: Note) => !n.isArchived).length
    const byCategory = categories.map((cat) => ({
      ...cat,
      count: notes.filter((n: Note) => n.category === cat.id && !n.isArchived).length,
    }))
    const totalWords = notes.filter((n: Note) => !n.isArchived).reduce((sum: number, note: Note) => sum + note.wordCount, 0)
    const avgWords = total > 0 ? Math.round(totalWords / total) : 0

    return { total, byCategory, totalWords, avgWords }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StickyNote className="w-8 h-8 text-blue-600" />
                <WelcomeMessage />
              </div>
              <p className="text-gray-600 mt-1">Organiza y gestiona tus notas de salud</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={exportNotes}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Nota
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingNote ? "Editar Nota" : "Crear Nueva Nota"}</DialogTitle>
                    <DialogDescription>
                      {editingNote ? "Modifica los detalles de tu nota" : "Añade una nueva nota a tu colección"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Título de la nota..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={newNote.category}
                        onValueChange={(value) => setNewNote({ ...newNote, category: value as Note["category"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">Contenido</Label>
                      <Textarea
                        id="content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Escribe el contenido de tu nota..."
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label>Etiquetas</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Nueva etiqueta..."
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(newNote.tags) && newNote.tags.map((tag: string, idx: number) => (
                          <Badge
                            key={tag + '-' + idx}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularTags
                          .filter((tag) => Array.isArray(newNote.tags) && !newNote.tags.includes(tag))
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-50"
                              onClick={() => setNewNote({ ...newNote, tags: [...newNote.tags, tag] })}
                            >
                              + {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateModalOpen(false)
                          setEditingNote(null)
                          setNewNote({ title: "", content: "", category: "general", tags: [] })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
                        {editingNote ? "Actualizar" : "Crear"} Nota
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Notas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Favoritas</p>
                  <p className="text-2xl font-bold text-yellow-600">{notes.filter((n: Note) => n.isFavorite && !n.isArchived).length}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Archivadas</p>
                  <p className="text-2xl font-bold text-gray-600">{notes.filter((n: Note) => n.isArchived).length}</p>
                </div>
                <Archive className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fijadas</p>
                  <p className="text-2xl font-bold text-purple-600">{notes.filter((n: Note) => n.isPinned && !n.isArchived).length}</p>
                </div>
                <Pin className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Última Nota Modificada</p>
                  <p className="text-xs text-gray-800 font-semibold">
                    {notes.length > 0 ? `${notes[0].title}` : '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {notes.length > 0 ? (typeof window === 'undefined' ? notes[0].updatedAt : new Date(notes[0].updatedAt).toLocaleString()) : '—'}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar en notas, contenido o etiquetas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etiquetas</SelectItem>
                  {Array.from(new Set(notes.flatMap((note: Note) => note.tags))).map((tag, idx) => {
                    const t = tag as string;
                    return (
                      <SelectItem key={t + '-' + idx} value={t}>
                        #{t}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="oldest">Más antiguos</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                  <SelectItem value="category">Categoría</SelectItem>
                </SelectContent>
              </Select>
              <Button variant={showArchived ? "default" : "outline"} onClick={() => setShowArchived(!showArchived)}>
                <Archive className="w-4 h-4 mr-2" />
                {showArchived ? "Ocultar" : "Ver"} Archivadas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Distribución por Categorías */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribución por Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.byCategory.map((category: (typeof categories[number]) & { count: number }) => (
                <div key={category.id} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${category.color} mb-2`}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-lg font-bold text-gray-900">{category.count}</p>
                  <Progress value={(category.count / stats.total) * 100} className="h-1 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notas Fijadas */}
        {pinnedNotes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Pin className="w-5 h-5 text-yellow-500" />
              Notas Fijadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map((note: Note) => {
                const categoryInfo = getCategoryInfo(note.category)
                return (
                  <Card key={note.id} className="border-l-4 border-l-yellow-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={categoryInfo.color}>
                              <categoryInfo.icon className="w-3 h-3 mr-1" />
                              {categoryInfo.name}
                            </Badge>
                            <span
                              className="text-xs text-gray-500"
                              suppressHydrationWarning
                            >
                              {typeof window === "undefined"
                                ? note.updatedAt
                                : new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleTogglePin(note.id, !note.isPinned)} className="h-8 w-8 p-0">
                            <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(note.id, !note.isFavorite)}
                            className="h-8 w-8 p-0"
                          >
                            <Star
                              className={`w-4 h-4 ${note.isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{note.wordCount} palabras</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleArchive(note.id, !note.isArchived)}
                            className="h-7 w-7 p-0"
                          >
                            <Archive className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Notas Regulares */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-blue-500" />
            {showArchived ? "Notas Archivadas" : "Todas las Notas"}
            <Badge variant="outline">{regularNotes.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularNotes.map((note: Note) => {
              const categoryInfo = getCategoryInfo(note.category)
              return (
                <Card key={note.id} className={`${showArchived ? "opacity-75" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={categoryInfo.color}>
                            <categoryInfo.icon className="w-3 h-3 mr-1" />
                            {categoryInfo.name}
                          </Badge>
                          <span
                            className="text-xs text-gray-500"
                            suppressHydrationWarning
                          >
                            {typeof window === "undefined"
                              ? note.updatedAt
                              : new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleTogglePin(note.id, !note.isPinned)} className="h-8 w-8 p-0">
                          <Pin
                            className={`w-4 h-4 ${note.isPinned ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(note.id, !note.isFavorite)}
                          className="h-8 w-8 p-0"
                        >
                          <Star
                            className={`w-4 h-4 ${note.isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Array.isArray(note.tags) && note.tags.map((tag: string, idx: number) => (
                        <Badge key={tag + idx} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.wordCount} palabras</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)} className="h-7 w-7 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleArchive(note.id, !note.isArchived)}
                          className="h-7 w-7 p-0"
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron notas</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all" || selectedTag !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda"
                  : "Comienza creando tu primera nota médica"}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Nota
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
