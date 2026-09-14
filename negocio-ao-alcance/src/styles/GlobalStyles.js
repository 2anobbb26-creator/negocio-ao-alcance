import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 30%, #16213e 60%, #1a1a4e 80%, #2d1b69 100%);
    min-height: 100vh;
    color: #fff;
  }

  /* Fundo com partículas estilo espaço - igual à foto */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(1px 1px at 10px 20px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 30px 60px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 50px 120px, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 80px 30px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 120px 80px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 150px 40px, rgba(255,255,255,0.2), transparent),
      radial-gradient(1px 1px at 200px 150px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 250px 50px, rgba(255,255,255,0.2), transparent);
    background-size: 300px 300px;
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scrollbar personalizada com tema escuro */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #0a0e27;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #16213e, #2d1b69);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #1a1a4e, #4a2c8a);
  }
`;