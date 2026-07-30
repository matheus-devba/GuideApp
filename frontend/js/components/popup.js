function createPopupContainer() {
  // remove popup anterior para não empilhar
  const antigo = document.querySelector('[data-popup-root="true"]')
  if (antigo) antigo.remove()

  const overlay = document.createElement("div")
  overlay.dataset.popupRoot = "true"
  overlay.className = "popup-overlay"

  const box = document.createElement("div")
  box.className = "popup-box"

  const titleEl = document.createElement("h3")
  titleEl.className = "popup-title"

  const messageEl = document.createElement("p")
  messageEl.className = "popup-message"

  const actions = document.createElement("div")
  actions.className = "popup-actions"

  box.appendChild(titleEl)
  box.appendChild(messageEl)
  box.appendChild(actions)
  overlay.appendChild(box)
  document.body.appendChild(overlay)

  const close = () => {
    overlay.remove()
  }

  const closeByEsc = (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault()
      close()
      document.removeEventListener("keydown", closeByEsc)
    }
  }

  document.addEventListener("keydown", closeByEsc)

  // remove listener quando fechar
  const wrappedClose = () => {
    close()
    document.removeEventListener("keydown", closeByEsc)
  }

  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) {
      wrappedClose()
    }
  })

  return { overlay, box, titleEl, messageEl, actions, close: wrappedClose }
}


export function popupMessage({
  titulo = "Mensagem",
  mensagem = "",
  textoBotao = "OK"
} = {}) {
  const popup = createPopupContainer()

  popup.titleEl.textContent = titulo
  popup.messageEl.textContent = mensagem

  const btn = document.createElement("button")
  btn.type = "button"
  btn.textContent = textoBotao
  btn.className = "popup-btn popup-btn-primary"

  btn.addEventListener("click", () => {
    popup.close()
  })

  popup.actions.appendChild(btn)
  btn.focus()

  return { close: popup.close }
}


export function popupConfirm({
  titulo = "Confirmação",
  mensagem = "Confirma esta ação?",
  textoSim = "Sim",
  textoNao = "Não"
} = {}) {
  return new Promise((resolve) => {
    const popup = createPopupContainer()

    popup.titleEl.textContent = titulo
    popup.messageEl.textContent = mensagem

    const btnNao = document.createElement("button")
    btnNao.type = "button"
    btnNao.textContent = textoNao
    btnNao.className = "popup-btn popup-btn-secondary"

    const btnSim = document.createElement("button")
    btnSim.type = "button"
    btnSim.textContent = textoSim
    btnSim.className = "popup-btn popup-btn-primary"

    btnNao.addEventListener("click", () => {
      popup.close()
      resolve(false)
    })

    btnSim.addEventListener("click", () => {
      popup.close()
      resolve(true)
    })

    popup.actions.appendChild(btnNao)
    popup.actions.appendChild(btnSim)
    btnNao.focus()
  })
}