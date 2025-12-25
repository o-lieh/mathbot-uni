from .web3_config_payment import address_node ,w3 , contract , OWNER_ADDRESS , PRIVATE_KEY
import json
from dotenv import load_dotenv
import os

contract_address = address_node.to_checksum_address("write address")
contract_abi = json.loads('ABI')
owner_address = address_node.to_checksum_address(OWNER_ADDRESS)
nonce_owner = w3.eth.get_transaction_count(owner_address)


# This function will send the remaining Ethereum, which is the site's share of the competition,
#  to the relevant wallet after the competition prizes have been distributed.
def signup(ID):
    address = address_node.to_checksum_address(address)
    tx = contract.functions.signup(int(ID)).build_transaction({
        'from':owner_address ,
        'gas': 1000000,
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce_owner
    })
    sign_tx = w3.eth.account.sign_transaction(tx , PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(sign_tx.rawTransaction)
    return w3.to_hex(tx_hash)
