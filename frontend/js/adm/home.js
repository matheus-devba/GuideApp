import { verificacaoAdm } from "../services/requisicoesAdm.js";

export async function initHome() {
    const verificar = await verificacaoAdm();
    if (!verificar) return; // Se for false (não logado), para a execução aqui.
}