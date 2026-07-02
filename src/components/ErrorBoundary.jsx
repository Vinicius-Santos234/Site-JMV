import { Component } from "react";
import { genId } from "../utils/genId";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null, message: null };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorId: genId("ERR_RENDER"),
      message: error?.message ?? "Erro desconhecido",
    };
  }

  componentDidCatch(error, info) {
    console.error(
      `[${this.state.errorId}] Falha de renderização:`,
      error,
      info.componentStack
    );
  }

  handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <h2>Algo deu errado</h2>
          <p>
            Ocorreu um erro inesperado. Tente recarregar a página. Se o problema
            persistir, informe o código abaixo ao suporte.
          </p>
          <code className="error-boundary-code">{this.state.errorId}</code>
          <button className="btn-primary" onClick={this.handleReload}>
            Recarregar página
          </button>
        </div>
      </div>
    );
  }
}
