# IssoNaoEIA.com - Detector de Textos Gerados por IA

## 🎯 Visão Geral

O **IssoNaoEIA** é um sistema completo para análise e detecção de textos gerados por inteligência artificial. O projeto oferece uma interface web moderna e intuitiva que permite aos usuários verificar a autenticidade de textos e obter certificados de originalidade humana.

## 🌐 Acesso Público

**URL do Sistema:** https://5000-i90eoqfq2sf2ni91b1fvm-f08f9c55.manus.computer

## ✨ Funcionalidades Principais

### 🔍 Análise de Texto
- **Upload/Input de Texto**: Interface para inserir ou colar texto
- **Análise por IA**: Sistema que analisa padrões linguísticos e retorna porcentagem de probabilidade humana
- **Resultados Detalhados**: Exibição de métricas como confiança, contagem de palavras e probabilidade

### 🏆 Sistema de Certificação
- **Selo de Autenticidade Humana**: Certificados para textos com >80% de probabilidade humana
- **Geração de PDF**: Certificados profissionais em formato PDF
- **QR Code**: Códigos para verificação online da autenticidade
- **IDs Únicos**: Sistema de identificação para cada certificado

### 🎨 Interface Moderna
- **Design Responsivo**: Compatível com desktop e mobile
- **Paleta de Cores Profissional**: Azul (#2563EB) e Verde (#10B981)
- **Animações Suaves**: Micro-interações e transições elegantes
- **Acessibilidade**: Seguindo padrões WCAG

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js**: Framework principal
- **Tailwind CSS**: Estilização
- **Shadcn/UI**: Componentes de interface
- **Lucide Icons**: Ícones modernos
- **Vite**: Build tool

### Backend
- **Flask**: Framework web Python
- **ReportLab**: Geração de PDFs
- **QRCode**: Geração de códigos QR
- **Flask-CORS**: Suporte a requisições cross-origin
- **SQLite**: Banco de dados (configurado)

### Deploy
- **Integração Completa**: Frontend servido pelo Flask
- **APIs RESTful**: Endpoints organizados e documentados
- **CORS Configurado**: Suporte a requisições externas

## 📁 Estrutura do Projeto

```
issonaoeia-project/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes UI
│   │   ├── assets/         # Imagens e recursos
│   │   └── App.jsx         # Componente principal
│   └── dist/               # Build de produção
├── backend/                 # Aplicação Flask
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   │   ├── analysis.py # Análise de texto
│   │   │   └── certificate.py # Certificação
│   │   ├── static/         # Frontend integrado
│   │   └── main.py         # Aplicação principal
│   └── requirements.txt    # Dependências Python
└── references/             # Imagens de referência
```

## 🔗 Endpoints da API

### Análise de Texto
- `POST /api/analyze` - Analisa texto e retorna probabilidade humana
- `GET /api/health` - Verificação de saúde da API
- `GET /api/stats` - Estatísticas do serviço

### Certificação
- `POST /api/certificate/generate` - Gera certificado para texto elegível
- `GET /api/certificate/download/{id}` - Download do certificado em PDF
- `GET /api/certificate/verify/{id}` - Verificação de autenticidade
- `GET /api/certificate/badge/{id}` - Selo visual para incorporação

## 🎨 Design System

### Cores
- **Primária**: #2563EB (Azul confiável)
- **Secundária**: #10B981 (Verde sucesso)
- **Alerta**: #F59E0B (Amarelo atenção)
- **Erro**: #EF4444 (Vermelho perigo)

### Tipografia
- **Fonte**: Inter (moderna e legível)
- **Tamanhos**: H1 (48px), H2 (36px), Body (16px)

## 🚀 Como Usar

1. **Acesse o Sistema**: Visite a URL pública
2. **Insira o Texto**: Cole ou digite o texto na área de análise
3. **Analise**: Clique em "Analisar" e aguarde o resultado
4. **Certificação**: Se elegível (>80% humano), gere o certificado
5. **Download**: Baixe o PDF do certificado com QR code

## 💡 Ideias de Monetização

### Modelo Freemium
- **Gratuito**: 3-5 análises por dia
- **Premium**: Análises ilimitadas + certificados personalizados
- **Enterprise**: API para integração + relatórios avançados

### Casos de Uso
- **Educação**: Verificação de trabalhos acadêmicos
- **Jornalismo**: Autenticação de conteúdo editorial
- **Marketing**: Validação de conteúdo original
- **Legal**: Documentação de autenticidade textual

## 🔧 Configuração para Desenvolvimento

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

## 📊 Métricas de Análise

O sistema utiliza diversos fatores para determinar a autenticidade:
- **Comprimento do texto**: Textos mais longos tendem a ser mais humanos
- **Variação de sentenças**: Diversidade na estrutura das frases
- **Pontuação**: Uso natural de vírgulas, pontos e outros sinais
- **Complexidade**: Presença de palavras complexas e variadas

## 🎯 Próximos Passos

1. **Integração com IA Real**: Substituir simulação por modelo de ML
2. **Banco de Dados**: Implementar persistência de certificados
3. **Autenticação**: Sistema de usuários e histórico
4. **API Pública**: Documentação e chaves de acesso
5. **Mobile App**: Aplicativo nativo para iOS/Android

## 📞 Suporte

Para dúvidas ou sugestões sobre o projeto IssoNaoEIA, entre em contato através dos canais oficiais.

---

**© 2024 IssoNaoEIA - Detector de Textos Gerados por IA**

