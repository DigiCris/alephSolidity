// SPDX-License-Identifier: MIT
pragma solidity >0.7.0 <0.9.0;

contract Faucet {
    string mensaje;

    function setMensaje(string calldata _mensaje) public {
        mensaje = _mensaje;
    }

    function getMensaje() public view returns(string memory) {
        return(mensaje);
    }
}