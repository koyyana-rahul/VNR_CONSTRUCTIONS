const fs=require('fs');
let tf=0,tp=0;
for(const b of ['mobile','phablet','tablet','laptop','desktop','ultrawide']){
  const s=fs.readFileSync(`.audit/${b}.json`,'utf8');
  const start=s.indexOf('script');
  const open=s.indexOf('{',start);
  const end=s.indexOf('}\n\nconsole errors');
  const o=JSON.parse(s.slice(open,end+1));
  tf+=o.failureCount; tp+=o.pagesChecked;
  const c=(s.match(/console errors\/warnings \((\d+)\)/)||[,'?'])[1];
  const r=(s.match(/requests failed \((\d+)\)/)||[,'?'])[1];
  console.log(`== ${b} widths[${o.widths.join(',')}] pages=${o.pagesChecked} FAIL=${o.failureCount} WARN=${o.warningCount} console=${c} failedReq=${r}`);
  if(o.failures.length) console.log('  '+o.failures.slice(0,10).join('\n  '));
  if(o.warnings.length) console.log('  warn: '+[...new Set(o.warnings)].slice(0,12).join('\n  warn: '));
}
console.log(`\nTOTAL pages=${tp} failures=${tf}`);
