import { nichos } from "../mocks/nichos_db.js"

export function initPerfil() {
    nichosOptions()
}


function nichosOptions() {
    const nichoSelect = document.getElementById("nichoOption")

    nichoSelect.innerHTML = 
       ` 
       <option value="cosmeticos">Nicho Da Loja</option>
       ${nichos.map((nicho) =>
           `<option value="${nicho.value}">${nicho.name}</option>
        
    `).join('')} `
}