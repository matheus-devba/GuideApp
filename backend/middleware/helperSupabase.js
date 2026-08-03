const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function uploadParaSupabase(file, bucketName, folder = "") {
  if (!file?.buffer) return null

  const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || "")}`
  const filePath = folder ? `${folder}/${uniqueName}` : uniqueName

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    })

  if (error) throw new Error(`Erro no upload do Supabase: ${error.message}`)

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}

module.exports = { uploadParaSupabase }