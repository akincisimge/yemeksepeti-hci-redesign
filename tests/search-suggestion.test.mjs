import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFilters, filterProducts, searchSuggestion, editDistance } from '../src/features/market/filterProducts.ts';
const products=[
 {name:'Sütlü Çikolata',description:'80 g',category:'Atıştırmalık',brand:'Örnek',price:40},
 {name:'Laktozsuz Süt',description:'1 L',category:'Süt',brand:'Günlük',price:55},
];
const filters=patch=>({...emptyFilters,...patch});
test('vowel omissions produce explicit chocolate suggestion, not silent matches',()=>{
 assert.equal(filterProducts(products,filters({search:'çklata'})).length,0);
 assert.equal(searchSuggestion(products,filters({search:'çklata'})),'Sütlü Çikolata');
 assert.equal(filterProducts(products,filters({search:'Sütlü Çikolata'})).length,1);
});
test('suggestions preserve other filters and never point to hidden results',()=>{
 assert.equal(searchSuggestion(products,filters({search:'çklata',category:'Süt'})),null);
 assert.equal(searchSuggestion(products,filters({search:'çklata',maxPrice:'10'})),null);
});
test('no suggestions for exact hits, very short queries or unrelated queries',()=>{
 assert.equal(searchSuggestion(products,filters({search:'sut'})),null);
 assert.equal(searchSuggestion(products,filters({search:'çk'})),null);
 assert.equal(searchSuggestion(products,filters({search:'bilgisayar'})),null);
});
test('adjacent transpositions count as one typo',()=>{
 assert.equal(editDistance('sut','stu'),1);
 assert.equal(searchSuggestion(products,filters({search:'laktozsus'})),'Laktozsuz Süt');
});
