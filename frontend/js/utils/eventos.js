import { API_BASE_URL } from "../api/config.js";

export const Eventos = {
    VIEW_PRODUTO: "VIEW_PRODUTO",
    VIEW_PRODUTO_HOME: "VIEW_PRODUTO_HOME",
    VIEW_LOJA: "VIEW_LOJA",
    VIEW_LOJA_HOME: "VIEW_LOJA_HOME",
    // CLICK_WHATSAPP: "CLICK_WHATSAPP",
    VIEW_LISTA: "VIEW_LISTA",
    VIEW_LISTA_HOME: "VIEW_LISTA_HOME",
    INTERESSE_LISTA: "INTERESSE_LISTA",
    INTERESSE_LISTA_HOME: "INTERESSE_LISTA_HOME",
    INTERESSE_PRODUTO: "INTERESSE_PRODUTO",
    INTERESSE_PRODUTO_HOME: "INTERESSE_PRODUTO_HOME"
};

export async function addEventos(rota, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${rota}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" }
    });

    const responseEvent = await fetch(`${API_BASE_URL}/api/eventos/newEvent`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
    });
    
    if (!response.ok || !responseEvent.ok) {
      throw new Error("Erro ao processar as requisições da API");
      return
    }

  } catch (error) {
    console.error("Falha ao registrar visualização/evento:", error);
  }
}



