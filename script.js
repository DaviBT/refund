// elementos formulario
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// elemento da lista
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// captura o evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
};

// formata o valor monetário para o real brasileiro
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// captura o evento de submit do formulario para obter valores
form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    name: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  };

  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.name;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .replace("R$", "")
      .trim()}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover despesa");

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.appendChild(expenseItem);

    formClear(); // limpa o form pra add um novo item

    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.error(error);
  }
}

// atualiza os totais
function updateTotals() {
  try {
    const items = expenseList.querySelectorAll("li");
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // variavel para incrementar o total
    let total = 0;

    // percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // substituir virgula para ponto e tirar valor não numerico
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      // verifica se é um num valido
      if (isNaN(value)) {
        return alert("o valor não parece ser um número");
      }

      // incrementar o valor total
      total += Number(value);
    }

    // span do R$ formatado
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // formata o valor e remove o R$
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expensesTotal.innerHTML = "";

    // adiciona o simbolo R$ e o total
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Não foi possível atualizar os totais.");
    console.error(error);
  }
}

// evento que captura cliques na lista
expenseList.addEventListener("click", function (event) {
  // verifica se o item é o de excluir
  if (event.target.classList.contains("remove-icon")) {
    // obtem a li pai do elemento clicado
    const item = event.target.closest(".expense");
    // remove item da lista
    item.remove();
  }

  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
