import { btnSearch } from '../components/shareButton.js'
import { getLojaId } from '../services/requisicoesMerchant.js'


export async function initHome() {
    const loja_id = await getLojaId()
    console.log(loja_id)
    btnSearch(`/lojas/${loja_id.id}?loja_id=${loja_id.id}`)
    
}