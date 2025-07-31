"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Heart,
  Star,
  Bookmark,
  Share2,
  TrendingUp,
  Clock,
  Award,
  Lightbulb,
  Apple,
  Dumbbell,
  Moon,
  Brain,
  Shield,
  Eye,
  BookOpen,
  Users,
  Calendar,
  Loader2,
} from "lucide-react"
import { useAdvice, useAdviceCategories, useAdviceTags, likeAdvice, bookmarkAdvice, shareAdvice } from "@/hooks/use-advice"
import { getUserId } from "@/lib/api-functions"

interface Advice {
  id: string
  title: string
  content: string
  category: string
  author: {
    name: string
    credentials: string
    avatar: string
    verified: boolean
  }
  difficulty: string
  readTime: number
  _count?: {
  likes: number
  bookmarks: number
  shares: number
    views: number
  }
  tags: string[]
  publishedAt: string
  trending: boolean
  featured: boolean
}

const categories = [
  {
    id: "nutricion",
    name: "Nutrición",
    icon: Apple,
    color: "bg-green-100 text-green-800",
    description: "Alimentación saludable",
  },
  {
    id: "ejercicio",
    name: "Ejercicio",
    icon: Dumbbell,
    color: "bg-blue-100 text-blue-800",
    description: "Actividad física",
  },
  { id: "sueno", name: "Sueño", icon: Moon, color: "bg-purple-100 text-purple-800", description: "Descanso reparador" },
  {
    id: "salud-mental",
    name: "Salud Mental",
    icon: Brain,
    color: "bg-pink-100 text-pink-800",
    description: "Bienestar emocional",
  },
  {
    id: "prevencion",
    name: "Prevención",
    icon: Shield,
    color: "bg-orange-100 text-orange-800",
    description: "Cuidado preventivo",
  },
]

const difficulties = [
  { id: "facil", name: "Fácil", color: "bg-green-100 text-green-800" },
  { id: "intermedio", name: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
  { id: "avanzado", name: "Avanzado", color: "bg-red-100 text-red-800" },
]

const trendingTags = [
  "hidratacion",
  "ejercicio-casa",
  "meditacion",
  "vitamina-d",
  "sueno-reparador",
  "estres",
  "antioxidantes",
  "cardio",
]

export default function AdvicePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("trending")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [likedAdvice, setLikedAdvice] = useState<Set<string>>(new Set())
  const [bookmarkedAdvice, setBookmarkedAdvice] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // Usar los hooks para obtener datos de la base de datos
  const { advice, isLoading: isLoadingAdvice, isError, mutate } = useAdvice({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
    tags: selectedTag !== "all" ? [selectedTag] : undefined,
    sortBy,
  })

  const { categories: dbCategories } = useAdviceCategories()
  const { tags: dbTags } = useAdviceTags()

  if (isLoadingAdvice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
        <span className="text-gray-600">Cargando consejos...</span>
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-red-600 font-bold mb-2">Error al cargar los consejos</span>
        <Button onClick={() => mutate()}>Reintentar</Button>
      </div>
    )
  }

  const filteredAdvice = advice?.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty
    const matchesTag = selectedTag === "all" || item.tags?.includes(selectedTag)

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTag
  }) || []

  const sortedAdvice = [...filteredAdvice].sort((a: any, b: any) => {
    switch (sortBy) {
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b._count?.likes - a._count?.likes
      case "popular":
        return b._count?.likes - a._count?.likes
      case "recent":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "bookmarks":
        return b._count?.bookmarks - a._count?.bookmarks
      default:
        return 0
    }
  })

  const featuredAdvice = advice?.filter((item: any) => item.featured) || []
  const trendingAdvice = advice?.filter((item: any) => item.trending).slice(0, 3) || []

  const handleLike = async (id: string) => {
    try {
      setIsLoading(true)
      
      // Verificar si hay usuario autenticado
      const token = localStorage.getItem('token')
      const userId = getUserId()
      
      if (!token || !userId) {
        console.log('No hay usuario autenticado')
        // Mostrar mensaje amigable
        const shouldLogin = confirm('Para dar like a los consejos, necesitas iniciar sesión. ¿Quieres ir al login?')
        if (shouldLogin) {
          window.location.href = '/login'
        }
        return
      }
      
      await likeAdvice(id)
      setLikedAdvice(prev => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
      await mutate()
    } catch (error) {
      console.error('Error handling like:', error)
      alert('Error al dar like: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async (id: string) => {
    try {
      setIsLoading(true)
      
      // Verificar si hay usuario autenticado
      const token = localStorage.getItem('token')
      const userId = getUserId()
      
      if (!token || !userId) {
        console.log('No hay usuario autenticado')
        // Mostrar mensaje amigable
        const shouldLogin = confirm('Para guardar consejos, necesitas iniciar sesión. ¿Quieres ir al login?')
        if (shouldLogin) {
          window.location.href = '/login'
        }
        return
      }
      
      await bookmarkAdvice(id)
      setBookmarkedAdvice(prev => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
      await mutate()
    } catch (error) {
      console.error('Error handling bookmark:', error)
      alert('Error al guardar bookmark: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async (id: string) => {
    try {
      setIsLoading(true)
      const adviceItem = advice?.find((item: any) => item.id === id)
      
      if (navigator.share && adviceItem) {
        await navigator.share({
          title: adviceItem.title,
          text: adviceItem.content.substring(0, 100) + '...',
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(
          `${adviceItem?.title}\n\n${adviceItem?.content.substring(0, 100)}...\n\n${window.location.href}`
        )
        console.log('Contenido copiado al portapapeles')
      }
      
      // Solo registrar en BD si hay usuario autenticado
      const token = localStorage.getItem('token')
      const userId = getUserId()
      
      if (token && userId) {
        await shareAdvice(id, 'web')
        await mutate()
      }
    } catch (error) {
      console.error('Error sharing advice:', error)
      alert('Error al compartir: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleReadAdvice = (id: string) => {
    // Aquí se navegaría a la página de detalle del consejo
    console.log('Navegando al consejo:', id)
    // Por ahora solo mostramos una alerta
    const adviceItem = advice?.find((item: any) => item.id === id)
    if (adviceItem) {
      alert(`Leyendo: ${adviceItem.title}\n\n${adviceItem.content}`)
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0]
  }

  const getDifficultyInfo = (difficultyId: string) => {
    return difficulties.find((diff) => diff.id === difficultyId) || difficulties[0]
  }

  const getStats = () => {
    const totalAdvice = advice?.length || 0
    const totalLikes = advice?.reduce((sum: number, item: any) => sum + (item._count?.likes || 0), 0) || 0
    const totalBookmarks = advice?.reduce((sum: number, item: any) => sum + (item._count?.bookmarks || 0), 0) || 0
    const avgReadTime = advice?.length ? Math.round(advice.reduce((sum: number, item: any) => sum + (item.readTime || 0), 0) / advice.length) : 0

    return { totalAdvice, totalLikes, totalBookmarks, avgReadTime }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-green-600" />
                Consejos de Salud
              </h1>
              <p className="text-gray-600 mt-1">Consejos respaldados por expertos para tu bienestar</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Mi Biblioteca
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Seguir Expertos
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Consejos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalAdvice}</p>
                </div>
                <Lightbulb className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-red-600">{stats.totalLikes}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Guardados</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalBookmarks}</p>
                </div>
                <Bookmark className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgReadTime}min</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="destacados">Destacados</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="categorias">Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {/* Filtros y Búsqueda */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar consejos, temas o autores..."
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
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las dificultades</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="popular">Más populares</SelectItem>
                      <SelectItem value="recent">Más recientes</SelectItem>
                      <SelectItem value="bookmarks">Más guardados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Etiquetas Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Temas Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag("all")}
                  >
                    Todos
                  </Button>
                  {trendingTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lista de Consejos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAdvice.map((item) => {
                const categoryInfo = getCategoryInfo(item.category)
                const difficultyInfo = getDifficultyInfo(item.difficulty)

                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={categoryInfo.color}>
                              <categoryInfo.icon className="w-3 h-3 mr-1" />
                              {categoryInfo.name}
                            </Badge>
                            <Badge className={difficultyInfo.color}>{difficultyInfo.name}</Badge>
                            {item.trending && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {item.featured && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="w-3 h-3 mr-1" />
                                Destacado
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                          <AvatarFallback>
                            {item.author.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.author.name}</p>
                            {item.author.verified && <Award className="w-3 h-3 text-blue-500" />}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{item.author.credentials}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.content}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(item.id)}
                            disabled={isLoading}
                            className={`flex items-center gap-1 ${
                              likedAdvice.has(item.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Heart className={`w-4 h-4 ${likedAdvice.has(item.id) ? 'fill-current' : ''}`} />
                            )}
                            <span className="text-xs">{item._count?.likes || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(item.id)}
                            disabled={isLoading}
                            className={`flex items-center gap-1 ${
                              bookmarkedAdvice.has(item.id) 
                                ? 'text-blue-500 hover:text-blue-600' 
                                : 'text-gray-500 hover:text-blue-500'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedAdvice.has(item.id) ? 'fill-current' : ''}`} />
                            <span className="text-xs">{item._count?.bookmarks || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(item.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1 text-gray-500 hover:text-green-500"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs">{item._count?.shares || 0}</span>
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleReadAdvice(item.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Leer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="destacados" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredAdvice.map((item: Advice) => {
                const categoryInfo = getCategoryInfo(item.category)
                const difficultyInfo = getDifficultyInfo(item.difficulty)

                return (
                  <Card key={item.id} className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                        <Badge className={categoryInfo.color}>
                          <categoryInfo.icon className="w-3 h-3 mr-1" />
                          {categoryInfo.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                          <AvatarFallback>
                            {item.author.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{item.author.name}</p>
                            {item.author.verified && <Award className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-sm text-gray-500">{item.author.credentials}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{item.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(item.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{item._count?.likes || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(item.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                          >
                            <Bookmark className="w-4 h-4" />
                            <span>{item._count?.bookmarks || 0}</span>
                          </Button>
                        </div>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleReadAdvice(item.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Leer Completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="space-y-4">
              {trendingAdvice.map((item: any, index: number) => {
                const categoryInfo = getCategoryInfo(item.category)

                return (
                  <Card key={item.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-yellow-600">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                            <Badge className={categoryInfo.color}>
                              <categoryInfo.icon className="w-3 h-3 mr-1" />
                              {categoryInfo.name}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
                                <AvatarFallback>
                                  {item.author.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{item.author.name}</p>
                                <p className="text-xs text-gray-500">{item._count?.likes || 0} likes</p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleReadAdvice(item.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="categorias" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: any) => {
                const categoryAdvice = advice?.filter((item: any) => item.category === category.id) || []
                const totalLikes = categoryAdvice.reduce((sum: number, item: any) => sum + (item._count?.likes || 0), 0)

                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} mb-3`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Consejos:</span>
                          <span className="font-medium">{categoryAdvice.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total likes:</span>
                          <span className="font-medium">{totalLikes}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Trending:</span>
                          <span className="font-medium">{categoryAdvice.filter((item: any) => item.trending).length}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        Explorar {category.name}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {sortedAdvice.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron consejos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedTag !== "all"
                  ? "Intenta ajustar tus filtros de búsqueda o explora diferentes categorías"
                  : "No hay consejos disponibles en este momento"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedDifficulty("all")
                  setSelectedTag("all")
                  setSortBy("trending")
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
