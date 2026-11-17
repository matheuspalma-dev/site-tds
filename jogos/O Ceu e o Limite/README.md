# O CÉU É O LIMITE ☁️🔥

Um jogo arcade web de sobrevivência vertical completo, com física dinâmica, geração procedural infinita, progressão de dificuldade com lava ascendente, 6 personagens com atributos e habilidades ativas únicas, efeitos sonoros com Web Audio API, persistência local e banco de dados de ranking global.

---

## 🎮 Controles

### Desktop (Teclado)
- **Mover Lateralmente:** `A` / `D` ou Setas `←` / `→`
- **Pular:** `Espaço`, `W` ou Seta `↑`
- **Habilidade Especial:** `E` ou `Shift`
- **Pausar / Despausar:** `P`
- **Reiniciar Partida:** `R`
- **Menu Principal:** `ESC`

### Dispositivos Móveis (Touchscreen)
- **Botões Direcionais na Tela:** `◀` (Esquerda) e `▶` (Direita)
- **Botão de Pulo:** `▲ PULO` com suporte a multi-toque
- **Botão de Habilidade:** `⚡ HAB` com indicador de cooldown e animação

---

## 👥 Personagens e Habilidades

| Herói | Tipo | Velocidade | Salto | Controle Aéreo | Habilidade Especial |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Leo** | Equilibrado | 1.0x | 1.0x | 1.0x | **Impulso:** Turbo de velocidade e salto amplificado. |
| **Flash** | Rápido | 1.25x | 0.95x | 1.2x | **Dash Sônico:** Arrancada horizontal no ar. |
| **Pulo** | Saltador | 0.9x | 1.35x | 1.0x | **Super Salto:** Salto colossal que sobe várias plataformas. |
| **Rocky** | Pesado | 0.75x | 1.15x | 0.85x | **Onda de Choque:** Pouso sísmico que desacelera a lava. |
| **Nuvem** | Flutuante | 1.0x | 1.05x | 1.0x | **Flutuação:** Reduz gravidade em 80% para planar no ar. |
| **Fênix** | Especial | 1.05x | 1.1x | 1.05x | **Segunda Chance:** Ressurge das chamas ao tocar na lava (1x). |

---

## ☁️ Tipos de Plataformas

1. **Normal:** Nuvem branca clássica e estável.
2. **Pequena:** Plataforma reduzida exigindo precisão nos pousos.
3. **Móvel:** Desloca-se horizontalmente pelo ar.
4. **Quebradiça:** Desmancha e cai 0.6s após o jogador pisar nela.
5. **Impulso:** Mola elástica com super pulo vertical.
6. **Rara:** Nuvem dourada com efeito sonoro e +1500 pontos de bônus.

---

## 🚀 Execução do Projeto

### Opção 1: Ambiente Web Moderno (React + Express + Vite)
```bash
npm run dev
```
Acesse em: `http://localhost:3000`

### Opção 2: Servidor PHP Standalone
O projeto conta com uma versão completa em PHP (`index.php`, `style.css`, `game.js`, `api.php`):
```bash
php -S localhost:8000
```
Acesse em: `http://localhost:8000`
