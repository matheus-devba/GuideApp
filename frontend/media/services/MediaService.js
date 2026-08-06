// services/media/MediaService.js
// const TemplateRenderer = require("./TemplateRenderer");
import { Template } from "./Template.js"
// import { TemplateRenderer } from "./TemplateRenderer.js"

export class MediaService {

    async generate(options) {

        const {
            template,
            data
        } = options;

        let html;

        

        switch (template) {

            case "template_1":
                html = Template.render1(data); // template com 2 fotos
                break;

            case "template_2":
                html = Template.render2(data); // template com 4 fotos
                break;

            default:
                throw new Error("Template não encontrado.");

        }

        console.log(html)
        // return await TemplateRenderer.render(html);

    }

}

// module.exports = new MediaService();