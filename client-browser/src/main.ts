
import "./main.scss" 
import { FormPessoa } from "./components/form-pessoa"

const elMain = document.querySelector("main")
const elBtNovaPessoa = document.querySelector(".bt-adicionar-pessoa")

elBtNovaPessoa.addEventListener("click", ev => {
    const elFormPessoa = new FormPessoa()
    elMain.append(elFormPessoa)
})
void async function carregarPessoas() {
    const resposta = await fetch("http://localhost:8080/pessoa")
    const dadosDeResposta = await resposta.json()
    dadosDeResposta.forEach(dadosDePessoa => {
        const elFormPessoa = new FormPessoa()
        elFormPessoa.carregarDadosPreCarregados(dadosDePessoa)
        elMain.append(elFormPessoa)
    });
}()