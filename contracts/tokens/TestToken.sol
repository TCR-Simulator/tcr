import "tokens/eip20/EIP20.sol";

contract TestToken is EIP20 {
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public constant name = 'TestToken';                   //fancy name: eg Simon Bucks
    uint8 public constant decimals = 18;                //How many decimals to show.
    string public constant symbol = 'TST';                 //An identifier: eg SBX
    uint256 public constant TOTAL_SUPPLY = 1400000000 * 10 ** 18;

    constructor() public {
    	totalSupply = TOTAL_SUPPLY;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), 'To address is 0x0.');
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), 'To address is 0x0.');
        return super.transferFrom(_from, _to, _value);
    }

    function balanceOf(address _owner) view public returns (uint256 balance) {
        return super.balanceOf(_owner);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        return super.approve(_spender, _value);
    }

    function allowance(address _owner, address _spender)
    view public returns (uint256 remaining) {
      	return super.allowance(_owner, _spender);
    }

    function sendToken(address address, uint256 _value) external {
        require(balances[msg.sender] >= value); // Underflow check
        balances[msg.sender] -= value;
        balances[address] += _value;
        require(balances[address] >= _value); // Overflow check
        emit Transfer(msg.sender, address, _value);
	}
}