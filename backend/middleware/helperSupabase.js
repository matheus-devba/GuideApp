import path from 'path'
import { supabase } from './supabaseClient.js'

/**
 * Envia um arquivo recebido do Multer em memória para o Supabase Storage.
 * @param {Object} file - Objeto do arquivo vindo do req.files['campo'][0]
 * @param {string} bucketName - Nome do Bucket no Supabase (ex: 'lojas')
 * @param {string} folder - Pasta dentro do bucket (ex: 'logos', 'banners')
 */
export async function uploadParaSupabase(file, bucketName, folder = '') {
  if (!file) return null

  // Gera um nome único com extensão original
  const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
  const filePath = folder ? `${folder}/${uniqueName}` : uniqueName

  // Envia o buffer diretamente para o Supabase
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    })

  if (error) {
    throw new Error(`Erro no upload do Supabase: ${error.message}`)
  }

  // Gera e retorna a URL pública do arquivo
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}