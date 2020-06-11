const mostra_ingredientes = document.querySelector('.mostra_ingredientes');
const mostra_modo_preparo = document.querySelector('.mostra_modo_preparo');
const mostra_informacoes = document.querySelector('.mostra_informacoes');

const receitas_ingredientes = document.querySelector('.receitas-ingredientes ul');
const receitas_preparo = document.querySelector('.receitas-modo-de-preparo ul');
const receitas_informacoes = document.querySelector('.receitas-informacoes p');

mostra_ingredientes.addEventListener("click", function(){
    receitas_ingredientes.classList.toggle('recipe');
    if(mostra_ingredientes.innerHTML == 'ESCONDER'){
        mostra_ingredientes.innerHTML = 'MOSTRAR'
    }else{
        mostra_ingredientes.innerHTML = 'ESCONDER'
    }
});

mostra_modo_preparo.addEventListener("click", function(){
    receitas_preparo.classList.toggle('recipe');
    if(mostra_modo_preparo.innerHTML == 'ESCONDER'){
        mostra_modo_preparo.innerHTML = 'MOSTRAR'
    }else{
        mostra_modo_preparo.innerHTML = 'ESCONDER'
    }
});

mostra_informacoes.addEventListener("click", function(){
    receitas_informacoes.classList.toggle('recipe');
    if(mostra_informacoes.innerHTML == 'ESCONDER'){
        mostra_informacoes.innerHTML = 'MOSTRAR'
    }else{
        mostra_informacoes.innerHTML = 'ESCONDER'
    }
});


