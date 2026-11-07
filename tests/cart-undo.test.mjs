import test from 'node:test';
import assert from 'node:assert/strict';
import { cartReducer } from '../src/state/cartOperations.ts';
const product = (id, service='market', storeId='one')=>({id,name:id,service,storeId,storeName:storeId,price:10,category:'test',description:'test'});
const initial = ()=>({carts:{market:[{product:product('a'),quantity:3},{product:product('b'),quantity:2},{product:product('c'),quantity:1}],food:[{product:product('food','food'),quantity:2}]},pending:null});
const remove = (state,id,token=1)=>cartReducer(state,{type:'change',service:'market',id,delta:-100,token});
test('remove hides product immediately and undo restores exact quantity and position',()=>{
 const removed=remove(initial(),'b');
 assert.deepEqual(removed.carts.market.map(x=>x.product.id),['a','c']);
 assert.equal(removed.pending.entries[0].quantity,2);
 assert.deepEqual(cartReducer(removed,{type:'undo'}).carts,initial().carts);
});
test('sequential adjacent deletions are grouped and restored in original order',()=>{
 const state=remove(remove(initial(),'a'),'b',2);
 assert.equal(state.pending.entries.length,2);
 assert.deepEqual(cartReducer(state,{type:'undo'}).carts,initial().carts);
});
test('decreasing last quantity triggers undo and rapid increments use latest reducer state',()=>{
 const state=cartReducer(initial(),{type:'change',service:'market',id:'c',delta:-1,token:1});
 assert.equal(state.pending.entries[0].product.id,'c');
 const increment=cartReducer(cartReducer(state,{type:'add',product:product('a')}),{type:'add',product:product('a')});
 assert.equal(increment.carts.market[0].quantity,5);
});
test('re-adding a removed item then undo preserves new additions',()=>{
 const removed=remove(initial(),'a');
 const added=cartReducer(removed,{type:'add',product:product('a')});
 assert.equal(cartReducer(added,{type:'undo'}).carts.market.find(x=>x.product.id==='a').quantity,4);
});
test('store switching and checkout clear invalidate only the affected service undo',()=>{
 const state=remove(initial(),'a');
 const switched=cartReducer(state,{type:'add',product:product('z','market','two')});
 assert.equal(switched.pending,null);
 assert.equal(switched.carts.food.length,1);
 const checkedOut=cartReducer(state,{type:'clear',services:['market']});
 assert.equal(checkedOut.pending,null);
 assert.equal(cartReducer(checkedOut,{type:'undo'}).carts.market.length,0);
});
test('clear basket undo restores all lines while actual clear cannot resurrect orders',()=>{
 const removed=cartReducer(initial(),{type:'remove-all',service:'market',token:1});
 assert.equal(removed.carts.market.length,0);
 assert.deepEqual(cartReducer(removed,{type:'undo'}).carts,initial().carts);
});
test('stale toast timer cannot dismiss a newer removal',()=>{
 const state=remove(remove(initial(),'a',1),'b',2);
 assert.equal(cartReducer(state,{type:'dismiss',token:1}).pending.token,2);
 assert.equal(cartReducer(state,{type:'dismiss',token:2}).pending,null);
});
test('undo never mixes two stores even when called with stale external state',()=>{
 const removed=remove(initial(),'a');
 const stale={...removed,carts:{...removed.carts,market:[{product:product('z','market','two'),quantity:1}]}};
 assert.deepEqual(cartReducer(stale,{type:'undo'}).carts.market,stale.carts.market);
});
