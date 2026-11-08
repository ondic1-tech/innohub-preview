const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {buildRelease}=require('./build_release.cjs');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'innohub-release-check-'));
test('preview keeps every HTML noindex and excludes maintenance sources',()=>{
 const output=path.join(temp,'preview'),result=buildRelease({root,output});
 assert.equal(result.contentPages,34);assert.equal(result.htmlCount,67);assert.equal(result.indexedPages,0);
 assert.equal(result.files.some(f=>/^(tools\/|site.config.json|README.md|PERFORMANCE-REVIEW.md)/.test(f.path)),false);
 for(const f of result.files.filter(f=>f.path.endsWith('.html')))assert.match(fs.readFileSync(path.join(output,f.path),'utf8'),/<meta name="robots" content="noindex,follow">/);
 assert.equal(fs.existsSync(output+'.manifest.json'),true);
});
test('production refuses missing domain confirmation without creating output',()=>{
 const output=path.join(temp,'rejected');assert.throws(()=>buildRelease({root,output,mode:'production'}),/confirm-live-domain/);assert.equal(fs.existsSync(output),false);
});
test('production rehearsal changes only robots metadata in HTML, and leaves 404 and aliases noindex',()=>{
 const output=path.join(temp,'production-rehearsal'),result=buildRelease({root,output,mode:'production',confirmLiveDomain:'innohub.cz'});
 assert.equal(result.indexedPages,34);assert.equal(result.redirects,32);
 const strip=s=>s.replace(/\r\n/g,'\n').replace(/<meta\b(?=[^>]*name="robots")[^>]*>/gi,'').replace(/\?v=[a-f\d]+/g,'');
 for(const f of result.files){const original=fs.readFileSync(path.join(root,f.path)),released=fs.readFileSync(path.join(output,f.path));if(f.path.endsWith('.html'))assert.equal(strip(original.toString()),strip(released.toString()),f.path);else if(/\.(css|js)$/.test(f.path))assert.equal(released.toString(),original.toString().replace(/\r\n/g,'\n'),f.path);else if(f.path!=='robots.txt')assert.deepEqual(released,original,f.path);}
 assert.match(fs.readFileSync(path.join(output,'404.html'),'utf8'),/content="noindex,follow"/);
});
test('never overwrites an output or writes into the source checkout',()=>{
 assert.throws(()=>buildRelease({root,output:path.join(root,'release')}),/outside/);
 assert.throws(()=>buildRelease({root,output:root}),/outside/);
 if(process.platform==='win32')assert.throws(()=>buildRelease({root,output:path.join(root.toUpperCase(),'release')}),/outside/);
 assert.throws(()=>buildRelease({root,output:path.join(temp,'preview')}),/already exists/);
});
test('unknown mode cannot accidentally enable production indexing',()=>assert.throws(()=>buildRelease({root,output:path.join(temp,'bad-mode'),mode:'prod'}),/Unknown release mode/));
