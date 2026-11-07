#!/usr/bin/env node
// Staging-only reservation provider switch. Never modifies production.
import fs from 'node:fs';
const args=process.argv.slice(2);
const arg=name=>args[args.indexOf(name)+1];
const provided=args.includes('--url')?arg('--url'):null;
const apply=args.includes('--apply');
const testsPassed=args.includes('--booking-page-tested')&&args.includes('--staff-flow-tested');
const filename=process.env.CIAO_BELLA_SERVICES||new URL('../site/services.json',import.meta.url);
if(!provided){console.error('Usage: node operations/tableagent-link-prep.mjs --url https://tableagent.com/iframe/YOUR_RESTAURANT/ [--booking-page-tested --staff-flow-tested --apply]');process.exit(2)}
let dest;try{dest=new URL(provided)}catch{console.error('Invalid URL');process.exit(2)}
if(dest.protocol!=='https:'||!['tableagent.com','www.tableagent.com','app.tableagent.com'].includes(dest.hostname)||dest.username||dest.password||dest.hash){
 console.error('A direct HTTPS TableAgent restaurant booking URL is required');process.exit(2)
}
if(dest.pathname==='/'||/^\/(myaccount|help|contact|reservation-system|submit-restaurant)\b/.test(dest.pathname)){
 console.error('This does not appear to be a restaurant-specific booking URL');process.exit(2)
}
const config=JSON.parse(fs.readFileSync(filename,'utf8'));
if(config.staging_only!==true||config.services?.reservations?.provider!=='SpotHopper'){console.error('Unexpected staging configuration');process.exit(2)}
if(!apply){console.log('DRY RUN ONLY: a TableAgent booking link could replace the SpotHopper reservations link in staging. No edits performed.');process.exit(0)}
if(!testsPassed){console.error('Cannot activate without verified booking-page and staff-notification tests');process.exit(2)}
const next=structuredClone(config);
next.services.reservations={
 url:dest.href,verified_destination:true,provider:'TableAgent',replacement_ready:true,
 notes:'Staging-only switch. Keep SpotHopper operating until all data is reconciled and production cutover is authorized.'
};
fs.writeFileSync(filename,JSON.stringify(next,null,2)+'\n');
console.log('TableAgent linked on staging. Catering, parties, Slice, production DNS and live services unchanged.');
