var amount0=0;
var amount1=1;
var P0=0.1;// precio
var P1=10;// Precio de BNB

var buyOrApprove = 0;

var web3;

var address="Conectar";
var swapInstance;


init();
var isConnected = obtenerValorDeLocalStorage("SwapConected");
if(isConnected=="true"){
	connect();
}

async function init() {
    // inyectar proveedor a web3
    // instanciar contratos
    // leer precio P1
    web3 = new Web3(window.ethereum);
    swapInstance = new web3.eth.Contract(exchange_abi, exchange_address);
    P0 = await swapInstance.methods.price().call();
    P1 = Number(P0);
    P0 = P1;
    //alert(P0)
}


async function connect()
{
    //alert("conectar. Obtener address metamask");
    //address = "0x98402384209348209348230948230942";
    await window.ethereum.request({"method": "eth_requestAccounts", "params": []});
    const account = await web3.eth.getAccounts();

    address = account[0];


    document.getElementById('account').innerHTML=address.toString().slice(0,6)+"...";

    await setBalanceUSDT();
    await setBalanceAleph();
    await allowance();

    if(buyOrApprove==0) {
      document.getElementById('swap-submit').innerHTML = "approve";
    }
}


async function handleSubmit() {
    // acá la aprobacion y compra.
    const AmountToBuy = document.querySelector("#form > input.IHAVE").value;

    if(buyOrApprove!=0) {
      swapInstance.methods.buy(AmountToBuy).send({from: address})
          .on('transactionHash', function(hash){
              showToast("transactionHash: "+hash, "orange");
          })
          .on('confirmation', function(confirmationNumber, receipt){
              console.log(confirmationNumber);
          })
          .on('receipt', async function(receipt){
              console.log(receipt);
              showToast("transaccion correcta", "green");
              await setBalanceUSDT();
              await setBalanceAleph();
          })      
    } else {
      usdtInstance = new web3.eth.Contract(usdt_abi, usdt_address);
      usdtInstance.methods.approve(exchange_address,AmountToBuy).send({from: address})
          .on('transactionHash', function(hash){
              showToast("transactionHash: "+hash, "orange");
          })
          .on('confirmation', function(confirmationNumber, receipt){
              console.log(confirmationNumber);
          })
          .on('receipt', async function(receipt){
              console.log(receipt);
              showToast("transaccion correcta", "green");
              await allowance();
              if(buyOrApprove==0) {
                document.getElementById('swap-submit').innerHTML = "Approve";
              } else {
                document.getElementById('swap-submit').innerHTML = "Swapp";
              }
          }) 
    }

}


async function setBalanceUSDT() {
  usdtInstance = new web3.eth.Contract(usdt_abi, usdt_address);
  const balanceUSDT = await usdtInstance.methods.balanceOf(address).call();
  document.getElementById("balanceUSDT").innerHTML = balanceUSDT;
}

async function setBalanceAleph() {
  alephInstance = new web3.eth.Contract(aleph_abi, aleph_address);
  const balanceAleph = await alephInstance.methods.balanceOf(address).call();
  document.getElementById("balanceAleph").innerHTML = balanceAleph;
}

async function allowance() {
  usdtInstance = new web3.eth.Contract(usdt_abi, usdt_address);
  const allowed = await usdtInstance.methods.allowance(address,exchange_address).call();
  buyOrApprove = allowed;
}




  /////////////////////////// Funciones comunes

function setValueTokenToSpend() {
	amount0 = document.getElementsByClassName("IHAVE")[0].value;
	amount0 = amount0 / 1;
	amount1 = amount0/P1 ;
	document.getElementsByClassName("IWANT")[0].value=amount1;
}

function showToast(address, color) {
	var toast = document.getElementById("toast");
	var addressLines = address.match(/.{1,20}/g); // Dividir la dirección en grupos de 6 caracteres
  
	toast.innerHTML = ""; // Limpiar el contenido del toast
  
	addressLines.forEach(function(line) {
	  var lineElement = document.createElement("div");
	  lineElement.textContent = line;
	  toast.appendChild(lineElement);
	});
  
	toast.style.backgroundColor = color;
	toast.classList.add("show");
	setTimeout(function(){
	  toast.classList.remove("show");
	}, 3000);
}

// Función para guardar un valor en localStorage
function guardarValorEnLocalStorage(key, valor) {
	localStorage.setItem(key, valor);
}
  
  // Función para obtener un valor de localStorage
function obtenerValorDeLocalStorage(key) {
	const valor = localStorage.getItem(key);
	return valor !== null ? valor : "DE";
}