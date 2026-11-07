import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFilters, filterProducts } from '../src/features/market/filterProducts.ts';
const products = [
 {id:'a',name:'Laktozsuz Süt',description:'1 L',unitLabel:'1 L',brand:'Günlük',category:'Süt',price:55,unitPrice:55,unitBasis:'L',tags:['Laktozsuz']},
 {id:'b',name:'Laktozsuz Süt',description:'500 ml',unitLabel:'500 ml',brand:'Doğa',category:'Süt',price:32,unitPrice:64,unitBasis:'L',tags:['Laktozsuz']},
 {id:'c',name:'Peynir',description:'500 g',brand:'Günlük',category:'Süt',price:120,unitPrice:240,unitBasis:'kg',tags:[]},
 {id:'d',name:'Pirinç',description:'1 kg',brand:'Sofra',category:'Temel Gıda',price:90,unitPrice:90,unitBasis:'kg',tags:[]},
];
const ids = patch=>filterProducts(products,{...emptyFilters,...patch}).map(p=>p.id);
test('search handles Turkish characters, case, whitespace, brand and multiple terms',()=>{
 assert.deepEqual(ids({search:'  LAKTOZSUZ SUT  '}),['a','b']);
 assert.deepEqual(ids({search:'sut doga'}),['b']);
 assert.deepEqual(ids({search:'PIRINC'}),['d']);
});
test('brand, category, budget and dietary filters combine without changing source',()=>{
 assert.deepEqual(ids({category:'Süt',brand:'Doğa',maxPrice:'40',tag:'Laktozsuz'}),['b']);
 assert.deepEqual(ids({category:'Süt',maxPrice:'20'}),[]);
 assert.deepEqual(products.map(p=>p.id),['a','b','c','d']);
});
test('unit price reveals cheaper per litre product despite higher package price',()=>{
 assert.deepEqual(ids({basis:'L',sort:'price-asc'}),['b','a']);
 assert.deepEqual(ids({basis:'L',sort:'unit'}),['a','b']);
});
test('price descending, empty budget and zero budget behave explicitly',()=>{
 assert.deepEqual(ids({sort:'price-desc'}),['c','d','a','b']);
 assert.equal(ids({}).length,4);
 assert.deepEqual(ids({maxPrice:'0'}),[]);
});

test('package size narrows the same product to the requested amount',()=>{
 assert.deepEqual(ids({search:'laktozsuz',pack:'1 L'}),['a']);
 assert.deepEqual(ids({search:'laktozsuz',pack:'500 ml'}),['b']);
});
