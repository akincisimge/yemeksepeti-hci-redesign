import test from 'node:test';
import assert from 'node:assert/strict';
import {turkeyProvinces} from '../src/data/turkey.ts';
import {makeLocation,restoreLocation,deliversTo} from '../src/data/delivery.ts';
import {addressFromResponse} from '../src/lib/location.ts';
test('81 provinces and 973 districts are bundled, with valid district parents',()=>{
 assert.equal(turkeyProvinces.length,81);
 assert.equal(turkeyProvinces.reduce((n,p)=>n+p.districts.length,0),973);
 assert.equal(new Set(turkeyProvinces.map(p=>p.name)).size,81);
 for(const p of turkeyProvinces){assert(p.districts.length);assert(makeLocation(p.name,p.districts[0],'Örnek Mahalle'));}
});
test('manual choices accept all provinces and preserve original demo region identities',()=>{
 assert.equal(makeLocation('mugla','mentese','Kötekli Mahallesi').id,'kotekli');
 assert.equal(makeLocation('Istanbul','Kadikoy','Caferağa').city,'İstanbul');
 assert.equal(makeLocation('Istanbul','Kadikoy','Caferağa').district,'Kadıköy');
 assert(turkeyProvinces.find(p=>p.name==='İstanbul').districts.includes('Şişli'));
 assert(turkeyProvinces.find(p=>p.name==='İstanbul').districts.includes('Sarıyer'));
 assert.equal(makeLocation('İstanbul','Menteşe','Kötekli'),null);
 assert.equal(makeLocation('Muğla','Menteşe',''),null);
 assert.equal(makeLocation('Muğla','Menteşe','<script>'),null);
});
test('saved coarse addresses are validated and GPS coordinates are not retained',()=>{
 const location=restoreLocation({city:'Muğla',district:'Menteşe',neighborhood:'Kötekli',latitude:37,longitude:28,source:'gps'});
 assert.equal(location.source,'gps');assert(!('latitude' in location));assert(!('longitude' in location));
 assert.equal(restoreLocation('kotekli').city,'Muğla');assert.equal(restoreLocation({city:'not-a-city'}),null);
});
test('GPS address extraction fills verified province, district and neighborhood',()=>{
 assert.deepEqual(addressFromResponse({countryCode:'TR',principalSubdivision:'Muğla',city:'Menteşe',locality:'Kötekli',localityInfo:{administrative:[{name:'Muğla',adminLevel:4},{name:'Menteşe',adminLevel:6},{name:'Kötekli',adminLevel:8}]}}),{city:'Muğla',district:'Menteşe',neighborhood:'Kötekli'});
});
test('coarse reverse results never invent a neighborhood or silently pick a district',()=>{
 assert.deepEqual(addressFromResponse({countryCode:'TR',principalSubdivision:'İstanbul',city:'İstanbul',locality:'İstanbul'}),{city:'İstanbul',district:'',neighborhood:''});
 assert.throws(()=>addressFromResponse({countryCode:'DE',principalSubdivision:'Berlin'}));
});
test('new Turkish locations can browse the explicitly mock store network',()=>{
 const location=makeLocation('İzmir','Konak','Alsancak');
 assert(deliversTo('ymarket-1',location));assert(deliversTo('bim-1',location));assert(!deliversTo('unknown-store',location));
});
