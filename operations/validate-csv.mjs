#!/usr/bin/env node
// Offline structural validator. No customer data leaves this computer.
// Usage: node operations/validate-csv.mjs reservations /private/export.csv
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const required = {
 contacts:['source_id','name','email','phone'],
 reservations:['source_id','name','start_local','party_size','status'],
 waitlist:['source_id','name','party_size','status'],
 inquiries:['source_id','type','name','status'],
 consents:['source_id','channel','status','evidence_source','evidence_timestamp']
};
function csvRead(input){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<input.length;i++){
  const c=input[i];
  if(quoted){if(c==='"'&&input[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}
  else if(c==='"')quoted=true;
  else if(c===','){row.push(field);field='';}
  else if(c==='\r'||c==='\n'){if(c==='\r'&&input[i+1]==='\n')i++;row.push(field);rows.push(row);row=[];field='';}
  else field+=c;
 }
 if(quoted)throw Error('Unclosed CSV quote');
 if(row.length||field){row.push(field);rows.push(row);}
 return rows.filter(r=>r.some(x=>x.trim().length));
}
function check(type,data){
 const rows=csvRead(data),head=rows.shift()?.map(s=>s.trim().replace(/^\uFEFF/,''));
 if(!head)throw Error('CSV empty');
 const missing=required[type].filter(h=>!head.includes(h));
 if(missing.length)throw Error('Required columns absent: '+missing.join(', '));
 const idSet=new Set();let invalid=0,duplicate=0,unknownConsent=0;
 const validStatus={
 reservations:['requested','confirmed','seated','completed','cancelled','no_show'],
 waitlist:['waiting','notified','seated','left','cancelled'],
 inquiries:['new','contacted','quoted','booked','closed','cancelled'],
 consents:['unknown','opted_in','opted_out']
 };
 for(const r of rows){
  let x=Object.fromEntries(head.map((col,i)=>[col,(r[i]||'').trim()]));
  if(r.length>head.length)invalid++;
  if(!x.source_id){invalid++;continue;}
  if(idSet.has(x.source_id))duplicate++;else idSet.add(x.source_id);
  if(type==='reservations'){
   if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(x.start_local||''))invalid++;
   if(!/^\d+$/.test(x.party_size||'')||Number(x.party_size)<1||Number(x.party_size)>30)invalid++;
  }
  if(type==='waitlist'&&(!/^\d+$/.test(x.party_size||'')||Number(x.party_size)<1||Number(x.party_size)>30))invalid++;
  if(type==='inquiries'&&!['catering','private_event','general'].includes(x.type))invalid++;
  if(type==='consents'){
   if(!['email','sms'].includes(x.channel))invalid++;
   if(x.status==='unknown')unknownConsent++;
   if(x.status==='opted_in'&&(!x.evidence_source||!x.evidence_timestamp))invalid++;
  }
  if(validStatus[type]&&!validStatus[type].includes(x.status))invalid++;
 }
 return {source_type:type,records:rows.length,duplicate_ids:duplicate,invalid_rows:invalid,
  unknown_consents:unknownConsent,sha256:createHash('sha256').update(data).digest('hex'),
  ready:invalid===0&&duplicate===0};
}
if(process.argv[2]==='--self-test'){
 const a='source_id,name,start_local,party_size,status\nr1,"Test, Guest",2026-11-11T17:00,2,confirmed\n';
 const b=check('reservations',a);
 if(!b.ready||b.records!==1)throw Error('CSV test failed');
 if(check('reservations',a+'r1,Duplicate,2026-11-11T17:00,2,confirmed\n').ready)throw Error('duplicate test failed');
 const c=check('consents','source_id,channel,status,evidence_source,evidence_timestamp\n1,email,opted_in,,\n');
 if(c.ready)throw Error('opt-in guard failed');
 console.log('PASS: CSV quoted fields, duplicates, date format, and marketing consent checks');
 process.exit(0);
}
const [type,file]=process.argv.slice(2);
if(!required[type]||!file){console.error('Usage: node operations/validate-csv.mjs contacts|reservations|waitlist|inquiries|consents /private/file.csv');process.exit(2);}
try{
 const result=check(type,fs.readFileSync(file,'utf8'));
 console.log(JSON.stringify(result,null,2)); // never prints private contact or reservation fields
 if(!result.ready)process.exitCode=1;
}catch(err){console.error('Invalid import file: '+err.message);process.exitCode=1;}
