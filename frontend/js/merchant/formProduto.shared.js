import { API_BASE_URL } from "../api/config.js";
import { verificarUser, getLojaId, insertNomeDaLoja } from "../services/requisicoesMerchant.js";


/**
 * Pega o id do produto pela URL:
 * /produtos/update/17 -> 17
 */
export function getProdutoIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

/**
 * Carrega as categorias no select do formulário.
 * Se receber selectedId, já deixa a categoria marcada.
 */
export async function loadCategorias(selectedId = "") {
  const select = document.querySelector("#categoria");
  if (!select) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/api/categorias`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const categorias = await response.json();

    select.innerHTML = `
      <option value="">Selecione uma categoria</option>
      ${categorias
        .map(
          (categoria) => `
            <option value="${categoria.id}" ${
              String(categoria.id) === String(selectedId) ? "selected" : ""
            }>
              ${categoria.nome}
            </option>
          `
        )
        .join("")}
    `;

    return categorias;
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    select.innerHTML = `<option value="">Erro ao carregar categorias</option>`;
    return [];
  }
}

/**
 * Monta o payload do produto com os campos do formulário.
 * Esse payload serve tanto para criar quanto para editar.
 */
export async function buildProdutoPayload() {
  const lojaId = await getLojaId()
  return {
    loja_id: lojaId.id,
    categoria_id: Number(document.querySelector("#categoria")?.value),
    nome: document.querySelector("#product-name")?.value?.trim() || "",
    descricao: document.querySelector("#product-description")?.value?.trim() || "",
    preco_normal: Number(document.querySelector("#product-price-normal")?.value),
    preco_promocional: document.querySelector("#product-price-promocional")?.value || null,
    destaque: document.querySelector("#destaqueOption")?.value === "true",
    forma_de_pagamento: document.querySelector("#forma-pagamento")?.value || null,
    ativo: true,
  };
}

/**
 * Busca um produto pelo id.
 * Usado no modo edição para preencher o formulário.
 */
export async function fetchProduto(produtoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/produtos/${produtoId}`);

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }
}

/**
 * Busca todas as imagens de um produto.
 * Usado no modo edição para renderizar o carrossel.
 */
export async function fetchProdutoImagens(produtoId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/produto_imagens/buscar_imagens/${produtoId}`
    );

    if (!response.ok) return [];

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar imagens do produto:", error);
    return [];
  }
}

/**
 * Envia as imagens novas do produto para o backend.
 * Só envia arquivos File, não envia strings de imagens antigas.
 */
export async function uploadProdutoImagens(produtoId, items) {
  const files = items.filter((item) => item instanceof File);

  if (!files.length) return [];

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("imagens", file);
  });

  const response = await fetch(
    `${API_BASE_URL}/api/produto_imagens/new/${produtoId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Galeria de imagens do produto.
 * Mantém a mesma lógica simples que você já usava:
 * - limpa o container
 * - renderiza as imagens
 * - adiciona o bloco de upload no final
 * - permite remover imagens da lista local
 */
export function setupImageGallery({
  containerSelector = ".list-grid",
  inputId = "image-input",
  initialItems = [],
  maxFiles = 5,
}) {
  const mediaProduct = document.querySelector(containerSelector);
  if (!mediaProduct) return null;

  let imagensDoProduto = [...initialItems];

  /**
   * Renderiza a galeria inteira de novo.
   * Fica bem parecido com o seu atualizarGaleriaTela().
   */
  function atualizarGaleriaTela() {
    mediaProduct.innerHTML = "";

    imagensDoProduto.forEach((imgData, index) => {
      const itemSection = document.createElement("section");
      itemSection.className = "gallery-item";

      if (imgData instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          itemSection.innerHTML = `
            <img src="${e.target.result}" class="gallery-img">
            <button type="button" class="btn-delete-img" data-index="${index}">&times;</button>
          `;
        };
        reader.readAsDataURL(imgData);
      } else {
        itemSection.innerHTML = `
          <img src="${imgData}" class="gallery-img">
          <button type="button" class="btn-delete-img" data-index="${index}">&times;</button>
        `;
      }

      mediaProduct.appendChild(itemSection);
    });

    if (imagensDoProduto.length < maxFiles) {
      const addBlock = document.createElement("div");
      addBlock.className = "gallery-add-block";
      addBlock.innerHTML = `
        <input type="file" id="${inputId}" accept="image/*" multiple hidden>
        <label for="${inputId}" class="add-block-label">
          <span class="camera-icon">📷</span>
          <span class="add-text">Adicionar fotos e vídeos</span>
        </label>
      `;
      mediaProduct.appendChild(addBlock);
    }
  }

  /**
   * Evita registrar os mesmos eventos mais de uma vez
   * se a função for chamada de novo.
   */
  if (!mediaProduct.dataset.galleryBound) {
    mediaProduct.dataset.galleryBound = "true";

    mediaProduct.addEventListener("change", (event) => {
      if (event.target.id !== inputId) return;

      const files = Array.from(event.target.files || []);
      const slotsAvailable = maxFiles - imagensDoProduto.length;

      if (slotsAvailable <= 0) return;

      const filesToAdd = files.slice(0, slotsAvailable);
      imagensDoProduto = [...imagensDoProduto, ...filesToAdd];
      atualizarGaleriaTela();
    });

    mediaProduct.addEventListener("click", (event) => {
      const button = event.target.closest(".btn-delete-img");
      if (!button) return;

      const indexToRemove = Number(button.dataset.index);
      imagensDoProduto.splice(indexToRemove, 1);
      atualizarGaleriaTela();
    });
  }

  atualizarGaleriaTela();

  return {
    getItems: () => imagensDoProduto,
    setItems: (nextItems) => {
      imagensDoProduto = [...nextItems];
      atualizarGaleriaTela();
    },
    render: atualizarGaleriaTela,
  };
}