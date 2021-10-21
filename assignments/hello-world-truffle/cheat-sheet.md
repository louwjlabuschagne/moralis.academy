
```javascript
truffle develop
compile
migrate
let instance = await HelloWorld.deployed();
await instance.setMessage("asdf").call();
await instance.setMessage("asdf", {value: web3.utils.toWei('1','ether')})
await instance.setMessage("asdf", {value: web3.utils.toWei('1','ether'), from:accounts[0]})    
```