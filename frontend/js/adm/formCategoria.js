import { API_BASE_URL } from "../api/config.js"
import { verificacaoAdm } from "../services/requisicoesAdm.js";
import { renderCategorias } from "./categorias.js"

export async function initNewCategoria () {
    const verificar = await verificacaoAdm();
    if (!verificar) return; // Se for false (não logado), para a execução aqui.

    await createCategoria()
    setImagePreview()
}

function createCategoria() {
    const form = document.querySelector("#client-form")
    if (!form) return


    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("nome", document.querySelector("#nome").value)
        formData.append("nicho_id", document.querySelector("#nicho").value)


        const iconFile = document.querySelector("#icon-file")?.files[0]

        if (iconFile) formData.append("icon", iconFile)

        try {
        
            const response = await fetch(`${API_BASE_URL}/api/categorias/new`, {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const categoria = await response.json()
            alert("Categoria criada")
            console.log("Categoria criada", categoria)
            renderCategorias()
            history.back()

        } catch (error) {
            console.error("Erro ao criar a categoria", error)
        }

    })

   
    
}



function setImagePreview() {
    const iconInput = document.getElementById("icon-file")
    const iconImage = document.getElementById("icon_image")

    let iconObjectUrl = null

    if (iconInput && iconImage) {
        console.log("e")
        iconInput.addEventListener("change", () => {
            const file = iconInput.files[0]
            if (!file) return

            if (iconObjectUrl) {
                URL.revokeObjectURL(iconObjectUrl)
            }

            iconObjectUrl = URL.createObjectURL(file)
            iconImage.src= iconObjectUrl
        })
    }

    



}