const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event){
   event.preventDefault(); // Cancela el comportamiento por defecto del navegador (No regarga la pag)
   let transactionFormData = new FormData(form); // Crea un bojeto que tiene los campos del form. 
   let transactionObj = convertFormDataToTransactionObj(transactionFormData);     
   saveTransactionObj(transactionObj); 
   insertRowInTransactionTable(transactionObj);
   form.reset();  // Resetea el formulario, dejándolo en blanco. 
 
 
});

document.addEventListener("DOMContentLoaded", function(event){
   let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
   transactionObjArr.forEach(arrayElement => {
      insertRowInTransactionTable(arrayElement) });
});

function getNewTransactionId(){ // retorna un Id válido
   
   let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
   let newTransactionId = JSON.parse(lastTransactionId) + 1 ;
   localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
   console.log(newTransactionId);
   return newTransactionId ; 
}




function convertFormDataToTransactionObj(transactionFormData){
   
   let transactionDescription =  transactionFormData.get("transactionDescription");
   let transactionType = transactionFormData.get("transactionType");  
   let transactionAmount = transactionFormData.get("transactionAmount");
   let transactionCategory = transactionFormData.get("transactionCategory");
   let transactionId = getNewTransactionId();
   return {"transactionType" :transactionType, 
   "transactionDescription": transactionDescription,
   "transactionAmount": transactionAmount,
   "transactionCategory": transactionCategory ,
   "transactionId" : transactionId
 }
}

function insertRowInTransactionTable(transactionObj){
   
   let transactionTableRef = document.getElementById("transactionTable");
   let newTransactionRowRef = transactionTableRef.insertRow(-1);
   // Agrega a las filas el atributo Id
   newTransactionRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"]);
   

   let newTypeCellRef =  newTransactionRowRef.insertCell(0);
   newTypeCellRef.textContent= transactionObj["transactionType"]; 

   newTypeCellRef = newTransactionRowRef.insertCell(1)
   newTypeCellRef.textContent = transactionObj["transactionDescription"];

   newTypeCellRef = newTransactionRowRef.insertCell(2)
   newTypeCellRef.textContent = transactionObj["transactionAmount"];

   newTypeCellRef = newTransactionRowRef.insertCell(3)
   newTypeCellRef.textContent = transactionObj["transactionCategory"];

   let newDeleteCell = newTransactionRowRef.insertCell(4);
   let deleteButton = document.createElement("button"); 
   deleteButton.textContent = "Eliminar"; 
   newDeleteCell.appendChild(deleteButton);


    deleteButton.addEventListener("click", (event)=>{
      let transactionRow = event.target.parentNode.parentNode;
      let transactionId = transactionRow.getAttribute("data-transaction-id"); 
      transactionRow.remove(); 
      deleteTransactionObj(transactionId);
     console.log(transactionRow.getAttribute("data-transaction-id"));
      event.target.parentNode.parentNode.remove(); })   ;
   
 }
 //Le pasa como parámetro el transactionId de la transaccion que quiero eliminar
function deleteTransactionObj(transactionId){
   //Obtengo las transacciones de la "base de datos (localStorage)" (Desconvierto de json a objeto)
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")); 
   // Busca el índice de la transaccioón que quiera eliminar                                                                            
  let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId); 
  // Elimina el elemento de esa posición                                                                                                           
  transactionObjArr.splice(transactionIndexInArray, 1); 
 //Convierto el Array de objeto a JSON
 let transactionArrayJSON = JSON.stringify(transactionObjArr); 
 // Guardo mi Array de transacciones en formato JSON en el local storage
 localStorage.setItem("transactionData", transactionArrayJSON);
 
 }

  function saveTransactionObj(transactionObj){
      let myTransactionArray =  JSON.parse(localStorage.getItem("transactionData")) || []; 
      myTransactionArray.push(transactionObj);  //Agrega el objeto al array
      //Convierto el Array de transacciones a JSON
      let transactionObjArrayJSON = JSON.stringify(myTransactionArray); 
      // Guardo mi Array de transacciones en formato JSON en el local storage
      localStorage.setItem("transactionData", transactionObjArrayJSON);

  }
