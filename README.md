# 🌿 Landing Page Premium - Nutricionista Maria Helena (Protocolo EVOLUIR)

Landing page responsiva, moderna e de alta conversão para a **Nutricionista Esportiva Maria Helena**, desenvolvida com **HTML5 semântico, CSS3 moderno (Mobile-First) e Vanilla JavaScript puro (sem dependências)**.

---

## 🚀 Novas Funcionalidades e Aprimoramentos

- **Design de Alto Padrão (Sem Emojis):** Todos os emojis foram substituídos por ícones vetoriais modernos e minimalistas (inline SVGs estilo Lucide/Phosphor).
- **Hero Section 100vh com Typing Effect:** Ocupa 100% da tela inicial, com estrutura para vídeo ou imagem de alta resolução com overlay escuro/esverdeado e efeito de digitação automático ("Emagrecimento e Performance sem neuras.") com cursor piscante.
- **Protocolo EVOLUIR com 7 Pilares (E-V-O-L-U-I-R):**
  1. **E** - Estratégia Individualizada
  2. **V** - Vida Real & Flexibilidade
  3. **O** - Otimização de Performance
  4. **L** - Longevidade dos Resultados
  5. **U** - Unidade Corpo & Mente
  6. **I** - Inteligência Nutricional
  7. **R** - Resultados Duradouros
- **Cards de Atendimento Premium:** Consulta Presencial e Online com borda superior verde esmeralda, sombras suaves e ícones minimalistas.
- **Calculadora de Hidratação Inteligente com Glassmorphism:** Fundo com gradiente suave e card translúcido centralizado, zero emojis e cálculo dinâmico de 35ml, 40ml e 45ml por kg.
- **Galeria Mosaico (Bento Grid):** Layout assimétrico mesclando fotos verticais e horizontais com efeitos de hover e cartões de métricas.
- **Banner CTA 100% Centralizado:** Título, subtítulo e botão perfeitamente alinhados ao centro da tela.
- **Crédito no Rodapé:** Identificação `"Desenvolvido por Zyntek"` no limite inferior do footer.

---

## 📁 Estrutura de Arquivos

```
maria-helena-nutri/
│
├── index.html        # Estrutura HTML5 semântica e documentada
├── style.css         # Estilização CSS3 (Mobile-First, Bento Grid, Glassmorphism, 100vh Hero)
├── script.js         # JavaScript puro (Typing effect, Calculadora, Speed Dial, Modal FAQ, Scroll Spy)
└── README.md         # Documentação e manual de uso
```

---

## 🛠️ Como Customizar a Página

### 1. Hero: Usar Vídeo de Fundo ou Trocar a Imagem
No arquivo `index.html`, dentro da tag `<div class="hero-bg-media">`:
- **Para Imagem:** Substitua a URL do atributo `src` da tag `<img class="hero-bg-image">`.
- **Para Vídeo:** Descomente a tag `<video class="hero-bg-video">` e insira o caminho do seu arquivo `.mp4`.

### 2. Galeria Bento Grid: Inserir Suas Fotos
No `index.html`, procure pelos comentários de marcação:
- `<!-- [IMAGEM_RESULTADO_1_AQUI (Vertical - Recomendado 600x800px)] -->`
- `<!-- [IMAGEM_RESULTADO_2_AQUI (Horizontal - Recomendado 800x500px)] -->`
- `<!-- [IMAGEM_RESULTADO_3_AQUI (Quadrada - Recomendado 600x600px)] -->`
- `<!-- [IMAGEM_RESULTADO_4_AQUI (Horizontal - Recomendado 800x500px)] -->`

### 3. WhatsApp e Instagram
- Localize e substitua o número `5511999999999` pelo seu WhatsApp nos arquivos `index.html` e `script.js`.
- Localize e substitua `https://instagram.com/mariahelenanutri` pelo seu perfil oficial.

---

## 🌐 Deploy no GitHub Pages (2 Minutos)

1. Crie um novo repositório no seu GitHub (exemplo: `maria-helena-nutricionista`).
2. No seu terminal dentro da pasta `maria-helena-nutri`, execute:
   ```bash
   git init
   git add .
   git commit -m "feat: landing page premium nutricionista maria helena"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/maria-helena-nutricionista.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings** > **Pages**.
4. Em **Branch**, selecione `main` e a pasta `/ (root)`, e clique em **Save**.
5. Seu site estará publicado gratuitamente com HTTPS em:
   `https://SEU-USUARIO.github.io/maria-helena-nutricionista/`
