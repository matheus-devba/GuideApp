
import { uploadParaSupabase } from "../../../backend/middleware/helperSupabase.js"
import { API_BASE_URL } from "../api/config.js"
import { renderClientes } from "./clientes.js"

export async function initNewClient () {
    await createClient()
    setImagePreview()
}

function createClient() {
    const form = document.querySelector("#client-form")
    if (!form) return


    form.addEventListener("submit", async(event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("nome", document.querySelector("#store-name").value)
        formData.append("endereco", document.querySelector("#endereco").value)
        formData.append("telefone", document.querySelector("#telefone").value)
        formData.append("nicho_id", document.querySelector("#nicho_id").value)
        formData.append("descricao", document.querySelector("#descricao").value)
        formData.append("whatsapp", document.querySelector("#whatsapp").value)
        formData.append("ativo", document.querySelector("#ativo").value)

        // req.files['logo'] e req.files['banner'] serão arrays
        
        const logoFile = document.querySelector("#logo-file")?.files[0]
        const bannerFile = document.querySelector("#banner-file")?.files[0]

        let logoUrl = null
        let bannerUrl = null

        // Nome do bucket que você criou no Supabase (ex: 'lojas')
        const BUCKET_NAME = "lojas"

        // Processa o upload do logo
        if (logoFile) {
            logoUrl = await uploadParaSupabase(logoFile, BUCKET_NAME, "logos")
        }

        // Processa o upload do banner
        if (bannerFile) {
            bannerUrl = await uploadParaSupabase(bannerFile, BUCKET_NAME, "banners")
        }

        if (logoFile) formData.append("logo", logoUrl)
        if (bannerFile) formData.append("banner", bannerUrl)

        try {
        
            const response = await fetch(`${API_BASE_URL}/api/lojas/new`, {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const loja = await response.json()
            alert("Loja criada")
            console.log("Loja criada", loja)
            renderClientes()
            history.back()

        } catch (error) {
            console.error("Erro ao criar a loja", error)
        }

    })

   
    
}



export function setImagePreview() {
    const logoInput = document.getElementById("logo-file")
    const bannerInput = document.getElementById("banner-file")

    const logoImage = document.getElementById("logo_image")
    const bannerImage = document.getElementById("banner_image")

    let logoObjectUrl = null
    let bannerObjectUrl = null

    if (logoInput && logoImage) {
        logoInput.addEventListener("change", () => {
            const file = logoInput.files[0]
            if (!file) return

            if (logoObjectUrl) {
                URL.revokeObjectURL(logoObjectUrl)
            }

            logoObjectUrl = URL.createObjectURL(file)
            logoImage.src= logoObjectUrl
        })
    }

    if (bannerInput && bannerImage) {
        bannerInput.addEventListener("change", () => {
            const file = bannerInput.files[0]
            if (!file) return

            if (bannerObjectUrl) {
                URL.revokeObjectURL(bannerObjectUrl)
            }

            bannerObjectUrl = URL.createObjectURL(file)
            bannerImage.src = bannerObjectUrl
            
        })
    }



}