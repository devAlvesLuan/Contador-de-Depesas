// seleciona os elementos do formulario
const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura um input pra formatar o valor em reais
amount.oninput = () => {
  // pega o valor do input e remove os caracteres que não são números
  let value = amount.value.replace(/\D/g, '');

  // Transforma o valor em centavos para reais (ex: 150/100 = 1,50)
  value = Number(value) / 100;
  
  // atualiza o valor do input
  amount.value = formatCurrencyBRL(value);


}

function formatCurrencyBRL(value) {
  // formata o valor para o padrão de moeda brasileira
  value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return value;
}

// Captura o evento de submit do formulario
form.onsubmit = (event) => {

  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
   };

   expensedAdd(newExpense);
}

// Adicionando item a lista
function expensedAdd(newExpense) {
    try {
      // Cria elemento na lista 
      const expenseItem = document.createElement("li")
      expenseItem.classList.add("expense")
      
      // Cria o icone da categoria
      const expenseIcon = document.createElement("img")
      expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
      expenseIcon.setAttribute("alt", newExpense.category_name)

      // Cria a info da despensa
      const expenseInfo = document.createElement("div")
      expenseInfo.classList.add("expense-info")

      // Cria o nome da despesa
      const expenseName = document.createElement("strong")
      expenseName.textContent = newExpense.expense

      // Cria a categoria da despesa
      const expenseCategory = document.createElement("span")
      expenseCategory.textContent = newExpense.category_name

      // Adiciona nome e categoria na div das info da despesa
      expenseInfo.append(expenseName, expenseCategory)

      // Cria o valor da despesa
      const expenseAmount = document.createElement("span")
      expenseAmount.classList.add("expense-amount")
      expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`
      // Cria icone de remover
      const removeIcon = document.createElement("img")
      removeIcon.classList.add("remove-icon")
      removeIcon.setAttribute("src", "img/remove.svg")
      removeIcon.setAttribute("alt", "remover")


      // Adiciona as info no item
      expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

      // Cria a lista
      expenseList.append(expenseItem)

      // Limpa o formulario
      formClear()

      // Atualiza os totais
      updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas.")
        console.log(alert)
    }
}

// Atualiza os totais
function updateTotals() {
    try {
        // Recupera todos os itens da lista
        const items = expenseList.children

        // Atualiza a qnt de itens da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Variavel pra incrementar o total
        let total = 0

        // Percorre cada item da lista
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            //  Removendo caracteres não numericos e subsitui as virgulas por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            value = parseFloat(value)

            //Verifica se o número é valido
            if(isNaN(value)) {
                return alert("O valor não é um número")
            }

            // Incrementa o valor total
            total += Number(value)
            
        }

        // Criando a span com o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

        // Adiciona o simbolo da moeda e o valor total
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possivel atualizar os totais")
    }
}

// Evento que captura click no item da lista
expenseList.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-icon")){
        // Obtem a li pai do elemento
        const item = event.target.closest(".expense")

        // Remove o item da lista
        item.remove()
    }

    // Atualiza os totais
    updateTotals()
})

// Limpa o formulario
function formClear(){
    // Limpa 
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Foca no elemento do "nome da despesa"
    expense.focus()
}
