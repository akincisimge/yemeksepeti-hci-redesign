import test from 'node:test';
import assert from 'node:assert/strict';
import {marketProducts,marketStores} from '../src/features/market/data/marketData.ts';
import {filterProducts,emptyFilters} from '../src/features/market/filterProducts.ts';
test('631 stable unique products span three stores and twelve categories',()=>{
 assert.equal(marketProducts.length,631);assert.equal(new Set(marketProducts.map(p=>p.id)).size,631);
 assert.equal(new Set(marketProducts.map(p=>p.category)).size,12);
 for(const store of marketStores)assert(marketProducts.filter(p=>p.storeId===store.id).length>=200);
});
test('every expanded product has a valid price, unit, pack and parent store',()=>{
 for(const p of marketProducts){assert(p.price>0&&Number.isFinite(p.price));assert(p.unitPrice>0&&Number.isFinite(p.unitPrice));assert(p.unitLabel);assert(['kg','L','adet'].includes(p.unitBasis));assert(marketStores.some(s=>s.id===p.storeId));}
});
test('category and package filtering works across the expanded catalog',()=>{
 const products=marketProducts.filter(p=>p.storeId==='ymarket-1');
 const found=filterProducts(products,{...emptyFilters,category:'Evcil Dostlar',pack:'1 kg'});
 assert.equal(found.length,8);assert(found.every(p=>p.unitBasis==='kg'));
 assert.equal(marketProducts.find(p=>p.id==='m1').name,'Sütaş Süzme Peynir');
});
