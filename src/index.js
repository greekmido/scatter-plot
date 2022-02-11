import './index.css';
console.log("hello webpack for the 2nd time");

if(module.hot){
    module.hot.accept();
}
