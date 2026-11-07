#!/usr/bin/env node
// Code Red GO / NO-GO safeguard. No credentials, contacts or personal data.
import fs from 'node:fs';
const path=new URL('./readiness.json', import.meta.url);
const x=JSON.parse(fs.readFileSync(path,'utf8'));
if(x.production_authorized!==false)throw Error('Never store production authorization in a public manifest');
const missing=x.gates.filter(g=>g.ready!==true);
const dependent=x.services.filter(s=>s.status==='dependent');
const ready=missing.length===0&&dependent.length===0;
const result={status:ready?'GO':'NO_GO',critical_gates_missing:missing.map(g=>g.id),
  dependencies:dependent.map(s=>s.id),warnings:ready?[]:['Do NOT disconnect SpotHopper','Do NOT modify production DNS']};
console.log(JSON.stringify(result,null,2));
if(process.argv.includes('--require-go')&&!ready)process.exitCode=1;
