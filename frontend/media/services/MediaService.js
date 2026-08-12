// services/media/MediaService.js
// const TemplateRenderer = require("./TemplateRenderer");
import { Template } from "./Template.js"
import { TemplateRenderer } from "./TemplateRenderer.js"

export class MediaService {

    async generate(options) {

        const {
            template,
            data,
            tipo,
            divulgacao
        } = options;

        let html;

        
        if (tipo == "produtos") {
            html = await Template.template_produtos(data, divulgacao); // template com 2 fotos
            
        }
        if ( tipo == "categorias") {
            html = await Template.template_categorias(data, divulgacao); // template com 4 fotos
            
        }
        
        if (tipo == "listas") {
            html = await Template.template_listas(data, divulgacao); // template com 4 fotos
            
        }
        
         
        return html

    }

}

// module.exports = new MediaService();