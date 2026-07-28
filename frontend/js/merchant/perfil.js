import { setImagePreview } from "../adm/formCliente.js";
import { API_BASE_URL } from "../api/config.js"
import { getUserId, getLojaId, insertNomeDaLoja, verificacaoUsuario } from "../services/requisicoesMerchant.js";

export async function initPerfil() {
  const verificar = await verificacaoUsuario();
  if (!verificar) return; // Se for false (não logado), para a execução aqui.

  const lojaId = await getLojaId()

  await renderPerfil()


}

async function renderPerfil() {
  const lojaId = await getLojaId()

  const responseLoja = await fetch(`${API_BASE_URL}/api/lojas/${lojaId.id}`);
  const loja = await responseLoja.json()

  const campoNomeLoja = document.querySelector('#store-name').value = loja.nome
  const campoWhatsapp = document.querySelector('#whatsapp').value = loja.whatsapp
  await updatePerfil(lojaId.id)
  setImagePreview()
  renderImagePreview(loja.logo_url, loja.banner_url)

}

async function updatePerfil(lojaId) {
    const form = document.querySelector("#perfil-form")
    if (!form) return


    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const formData = new FormData()

        const storeNameEl = document.querySelector("#store-name");
        const whatsappEl = document.querySelector("#whatsapp");

        if (storeNameEl.value =="" || whatsappEl.value == "" ) {
            alert("Dados vazios")
            return
        }

        formData.append("nome", document.querySelector("#store-name").value)
        formData.append("whatsapp", document.querySelector("#whatsapp").value)

        const logoFile = document.querySelector("#logo-file")?.files[0]
        const bannerFile = document.querySelector("#banner-file")?.files[0]

        if (logoFile) formData.append("logo", logoFile)
        if (bannerFile) formData.append("banner", bannerFile)

        try {
        
            const response = await fetch(`${API_BASE_URL}/api/lojas/update/perfil/${lojaId}`, {
                method: "PUT",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const loja = await response.json()
            alert("Loja Editada")
            console.log("Loja Editada", loja)
            history.back()

        } catch (error) {
            console.error("Erro ao editar a loja", error)
        }

    })
}

function renderImagePreview(logo, banner) {
    const logoInput = document.getElementById("logo-file")
    const bannerInput = document.getElementById("banner-file")

    const logoImage = document.getElementById("logo_image")
    const bannerImage = document.getElementById("banner_image")

    if (logoInput && logoImage) {
            logoImage.src= logo
   
    }

    if (bannerInput && bannerImage) {
            bannerImage.src = banner
            
    }
}