import { btnShare } from '../components/shareButton.js'
import { verificarUser, getLojaId, insertNomeDaLoja, verificacaoUsuario } from "../services/requisicoesMerchant.js";
import { API_BASE_URL } from "../api/config.js"



export async function initHome() {
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const lojaId = await getLojaId()

  await insertNomeDaLoja(lojaId.id)
    btnShare(`/lojas/${lojaId.id}?lojaId.id=${lojaId.id}`,
        "Olha o que achei no Guide",
        "Confira a minha loja no Guide:"
    )

    const responseLoja = await fetch(`${API_BASE_URL}/api/lojas/${lojaId.id}`);
    const loja = await responseLoja.json()
   

    renderImagePreview(loja.logo_url, loja.banner_url)
    
}



function renderImagePreview(logo, banner) {

    const logoImage = document.querySelector(".logo-media")
    const bannerImage = document.querySelector(".banner-media")

    if (logoImage) {
            logoImage.src= logo
   
    }

    if (bannerImage) {
            bannerImage.src = banner
            
    }
}