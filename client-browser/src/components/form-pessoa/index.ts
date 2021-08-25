import stringStyle from "bundle-text:./form-pessoa.scss"
import stringHtml from "bundle-text:./form-pessoa.html"

export class FormPessoa extends HTMLElement {
    protected _id: number
    protected _root = this.attachShadow({ mode: "closed" })
    protected _domMain: HTMLElement
    protected _domActionBar: HTMLDivElement
    protected _inputs: { [prop: string]: HTMLInputElement } = {}
    protected _buttons: { [prop: string]: HTMLButtonElement } = {}

    constructor() {
        super()
        this._criarElementosPrincipais()
        this._referenciarBotoesEElementos()
        this._atribuirEventos()
    }

    protected _criarElementosPrincipais() {
        const style = document.createElement("style")
        const main = document.createElement("main")
        style.innerHTML = stringStyle
        main.innerHTML = stringHtml
        this._root.append(style, main)
        this._domMain = main
        this._domActionBar = main.querySelector(".actions")
    }

    protected _referenciarBotoesEElementos() {
        this._domMain.querySelectorAll("input[name]").forEach(input => {
            this._inputs[input.getAttribute("name")] = input as HTMLInputElement
        })

        this._domMain.querySelectorAll("button[name]").forEach(button => {
            this._buttons[button.getAttribute("name")] = button as HTMLButtonElement
        })
    }

    protected _atribuirEventos() {
        this._buttons.remover.addEventListener("click", ev => this._remover())
        this._buttons.salvar.addEventListener("click", ev => this._salvar())
    }
    

    protected async _remover() {
        if (this._id) {
            try {
                await fetch(`http://localhost:8080/pessoa/${this._id}`, { method: "DELETE" })
            } catch (e) {
                alert("ERRO: " + e)
                throw new Error(e)
            }
        }
        this.remove()
    }

    protected async _salvar() {
        const values = Object.fromEntries(Object.entries(this._inputs).map(([key, input]) => [key, input.value]))

        const resposta = await fetch(`http://localhost:8080/pessoa/${this._id || ''}`, {
            method: this._id ? "PUT" : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        })

        if (resposta.status !== 200) {
            alert("ERRO NO SERVIDOR!")
            throw new Error("Erro por parte do servidor ao inserir dados")
        }

        const dadosDaResposta = await resposta.json()
        if (!dadosDaResposta.id) return
        this._id = dadosDaResposta.id
    }
}

//
customElements.define("comp-form-pessoa", FormPessoa)
