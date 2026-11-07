import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const script=new URL('./tableagent-link-prep.mjs',import.meta.url);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ciaobella-test-'));
try{
 const file=path.join(dir,'services.json');
 const original={version:1,staging_only:true,services:{
  reservations:{provider:'SpotHopper',url:'https://tmt.spotapps.co/reservations?spot_id=344525'},
  catering:{provider:'SpotHopper',url:'https://tmt.spotapps.co/catering?spot_id=344525'},
  ordering:{provider:'Slice',url:'https://slicelife.com/'}
 }};
 const reset=()=>fs.writeFileSync(file,JSON.stringify(original));
 const run=args=>spawnSync(process.execPath,[script.pathname,...args],{encoding:'utf8',env:{...process.env,CIAO_BELLA_SERVICES:file}});
 const url='https://tableagent.com/iframe/cb-testing-only/';
 reset();
 assert.equal(run(['--url',url]).status,0);
 assert.equal(JSON.parse(fs.readFileSync(file)).services.reservations.provider,'SpotHopper');
 assert.notEqual(run(['--url','https://evil.example/fake','--booking-page-tested','--staff-flow-tested','--apply']).status,0);
 assert.notEqual(run(['--url','https://tableagent.com/myaccount/register/','--booking-page-tested','--staff-flow-tested','--apply']).status,0);
 assert.notEqual(run(['--url',url,'--apply']).status,0);
 assert.equal(run(['--url',url,'--booking-page-tested','--staff-flow-tested','--apply']).status,0);
 const next=JSON.parse(fs.readFileSync(file));
 assert.equal(next.services.reservations.provider,'TableAgent');
 assert.equal(next.services.catering.provider,'SpotHopper');
 assert.equal(next.services.ordering.provider,'Slice');
 console.log('PASS: dry run, HTTPS provider check, manual test gates, and independent Slice/catering links');
} finally{fs.rmSync(dir,{recursive:true,force:true})}
