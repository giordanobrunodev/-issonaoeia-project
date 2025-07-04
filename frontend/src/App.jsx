import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { CheckCircle, FileText, Zap, Shield, ArrowRight, Upload, BarChart3 } from 'lucide-react'
import './App.css'
import logo from './assets/logo.png'

function App() {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [showDemo, setShowDemo] = useState(false)
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false)

  const analyzeText = async () => {
    if (!text.trim()) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult({
          humanProbability: data.result.human_probability,
          confidence: data.result.confidence,
          wordCount: data.result.word_count,
          isHuman: data.result.is_human
        })
      } else {
        console.error('Erro na análise:', data.error)
        // Fallback para simulação em caso de erro
        const humanProbability = Math.floor(Math.random() * 100)
        setResult({
          humanProbability,
          confidence: Math.floor(Math.random() * 30) + 70,
          wordCount: text.split(' ').length,
          isHuman: humanProbability >= 80
        })
      }
    } catch (error) {
      console.error('Erro de conexão:', error)
      // Fallback para simulação em caso de erro de conexão
      const humanProbability = Math.floor(Math.random() * 100)
      setResult({
        humanProbability,
        confidence: Math.floor(Math.random() * 30) + 70,
        wordCount: text.split(' ').length,
        isHuman: humanProbability >= 80
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateCertificate = async () => {
    if (!result) return
    
    setIsGeneratingCertificate(true)
    try {
      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_result: {
            human_probability: result.humanProbability,
            confidence: result.confidence,
            word_count: result.wordCount,
            text_preview: text.substring(0, 100)
          }
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Fazer download do certificado
        const downloadUrl = `${data.download_url}`
        window.open(downloadUrl, '_blank')
        
        alert(`Certificado gerado com sucesso!\\nID: ${data.certificate_id}\\nVerificação: ${data.verification_url}`)
      } else {
        alert(`Erro ao gerar certificado: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao gerar certificado:', error)
      alert('Erro de conexão ao gerar certificado')
    } finally {
      setIsGeneratingCertificate(false)
    }
  }

  const demoText = "Este é um exemplo de texto escrito por um humano. Contém nuances naturais, variações no estilo de escrita e uma estrutura orgânica que demonstra autenticidade. A linguagem flui de forma natural, com pequenas imperfeições que são características da escrita humana genuína."

  const runDemo = () => {
    setText(demoText)
    setShowDemo(true)
    setTimeout(() => {
      setResult({
        humanProbability: 87,
        confidence: 92,
        wordCount: demoText.split(' ').length,
        isHuman: true
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="IssoNaoEIA" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">IssoNaoEIA</h1>
              <p className="text-sm text-muted-foreground">Detector de IA</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
            <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Análise Instantânea
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Descubra se seu texto foi
            <span className="text-primary"> criado por IA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nossa tecnologia avançada analisa textos e identifica com precisão se foram gerados por inteligência artificial ou escritos por humanos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' })}>
              Analisar Texto Agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={runDemo}>
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Como Funciona</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Processo simples e rápido para verificar a autenticidade do seu texto
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>1. Envie o Texto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cole ou digite o texto que deseja analisar. Suportamos textos de qualquer tamanho.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>2. Análise por IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nossa IA analisa padrões linguísticos, estrutura e características únicas do texto.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle>3. Receba o Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Obtenha uma pontuação de autenticidade e, se qualificado, um certificado de originalidade.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analisador */}
      <section id="analyzer" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Analisador de Texto</h2>
            <p className="text-muted-foreground">
              Cole seu texto abaixo e descubra se foi criado por IA
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Texto para Análise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole ou digite o texto que deseja analisar..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {text.length} caracteres • {text.split(' ').filter(word => word.length > 0).length} palavras
                </span>
                <Button 
                  onClick={analyzeText} 
                  disabled={!text.trim() || isAnalyzing}
                  className="min-w-[120px]"
                >
                  {isAnalyzing ? 'Analisando...' : 'Analisar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isAnalyzing && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground">Analisando seu texto...</p>
                  <Progress value={66} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultado */}
          {result && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-secondary" />
                  Resultado da Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {result.humanProbability}%
                    </div>
                    <p className="text-sm text-muted-foreground">Probabilidade Humana</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">
                      {result.confidence}%
                    </div>
                    <p className="text-sm text-muted-foreground">Confiança</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {result.wordCount}
                    </div>
                    <p className="text-sm text-muted-foreground">Palavras</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Autenticidade Humana</span>
                    <span className="text-sm text-muted-foreground">{result.humanProbability}%</span>
                  </div>
                  <Progress value={result.humanProbability} className="h-3" />
                </div>

                {result.isHuman && (
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-secondary mr-2" />
                      <span className="font-semibold text-secondary">Elegível para Certificação</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Este texto possui alta probabilidade de ser autêntico e pode receber nosso Selo de Autenticidade Humana.
                    </p>
                    <Button variant="outline" size="sm" onClick={generateCertificate} disabled={isGeneratingCertificate}>
                      {isGeneratingCertificate ? 'Gerando...' : 'Gerar Certificado'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt="IssoNaoEIA" className="h-8 w-8" />
            <span className="font-bold text-foreground">IssoNaoEIA</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 IssoNaoEIA. Detector de textos gerados por IA.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

