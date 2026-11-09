// Build a separate deployment directory without regenerating approved content.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
function buildRelease({root=path.resolve(__dirname,'..'),output,mode='preview',confirmLiveDomain}){
  root=path.resolve(root);
  if(!output)throw Error('An output directory is required.');
  output=path.resolve(output);
  const sourcePath=process.platform==='win32'?root.toLowerCase():root;
  const outputPath=process.platform==='win32'?output.toLowerCase():output;
  if(outputPath===sourcePath||outputPath.startsWith(sourcePath+path.sep))throw Error('Output must be outside the source checkout.');
  if(fs.existsSync(output)||fs.existsSync(output+'.manifest.json'))throw Error('Output already exists; choose a new release directory.');
  if(!['preview','production'].includes(mode))throw Error('Unknown release mode.');
  if(mode==='production'&&confirmLiveDomain!=='innohub.cz')throw Error('Production requires --confirm-live-domain innohub.cz, after release approval.');
  const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
  if(config.origin!=='https://innohub.cz')throw Error('Unexpected canonical origin.');
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    if(['.git','node_modules','dist'].includes(e.name))return [];
    if(e.isSymbolicLink())throw Error('Symbolic links are not accepted: '+e.name);
    const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p];
  });
  const sourceFiles=walk(root).map(p=>path.relative(root,p).replace(/\\/g,'/'));
  const files=sourceFiles.filter(f=>!f.startsWith('tools/')&&(f.startsWith('assets/')||f.endsWith('.html')||['main.js','style.css','sitemap.xml','robots.txt','.nojekyll'].includes(f)));
  const revisions=new Map(files.filter(f=>/\.(css|js)$/.test(f)).map(f=>[path.resolve(root,f),crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f),'utf8').replace(/\r\n/g,'\n')).digest('hex').slice(0,12)]));
  const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  const canonicalURLs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  if(canonicalURLs.length!==34||new Set(canonicalURLs).size!==34)throw Error('Expected exactly 34 distinct sitemap pages.');
  const canonicals=new Set(canonicalURLs),seen=new Set(),prepared=new Map();let indexed=0,redirects=0,htmlCount=0;
  for(const file of files){
    let content=fs.readFileSync(path.join(root,file));
    if(/\.(css|js)$/.test(file))content=Buffer.from(content.toString('utf8').replace(/\r\n/g,'\n'));
    if(file.endsWith('.html')){
      htmlCount++;let html=content.toString('utf8');
      const redirect=/<meta\b[^>]*http-equiv="refresh"/i.test(html);
      const canonical=html.match(/<link\b(?=[^>]*rel="canonical")[^>]*href="([^"]+)"/i)?.[1];
      const publicPage=!redirect&&file!=='404.html';
      if(publicPage){
        if(!canonicals.has(canonical)||seen.has(canonical))throw Error('Invalid canonical: '+file);
        const expected='https://innohub.cz/'+file.replace(/index\.html$/,'');
        if(canonical!==expected)throw Error('Canonical path mismatch: '+file);
        seen.add(canonical);
      }
      const robots=html.match(/<meta\b(?=[^>]*name="robots")[^>]*>/gi)||[];
      if(robots.length!==1)throw Error('Expected one robots meta tag: '+file);
      const index=mode==='production'&&publicPage;
      html=html.replace(robots[0],'<meta name="robots" content="'+(index?'index,follow,max-image-preview:large':'noindex,follow')+'">');
      html=html.replace(/(href|src)="([^"?#]+)\?v=[a-f\d]+"/g,(tag,key,ref)=>{
        if(!/\.(css|js)$/.test(ref)||/^(?:[a-z]+:|\/\/)/i.test(ref))return tag;
        const revision=revisions.get(path.resolve(root,path.dirname(file),ref));
        if(!revision)throw Error('Missing versioned asset: '+file+' '+ref);
        return key+'="'+ref+'?v='+revision+'"';
      });
      if(index)indexed++;
      if(redirect)redirects++;
      content=Buffer.from(html);
    }
    if(file==='robots.txt')content=Buffer.from('User-agent: *\nAllow: /\n\n# '+(mode==='production'?'Production: public content pages allow indexing; aliases and 404 remain noindex.':'Preview: every HTML page remains noindex; this is not access control.')+'\nSitemap: https://innohub.cz/sitemap.xml\n');
    prepared.set(file,content);
  }
  if(seen.size!==34||!prepared.has('404.html')||!prepared.has('.nojekyll'))throw Error('Incomplete release input.');
  let sourceCommit='unavailable';try{sourceCommit=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{}
  const manifest={sourceCommit,mode,origin:config.origin,htmlCount,contentPages:seen.size,indexedPages:indexed,redirects,files:[]};
  fs.mkdirSync(output,{recursive:true});
  for(const [file,content] of prepared){const target=path.join(output,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content);manifest.files.push({path:file,bytes:content.length,sha256:crypto.createHash('sha256').update(content).digest('hex')});}
  fs.writeFileSync(output+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');
  return manifest;
}
if(require.main===module){
  try{
    const args=process.argv.slice(2),options={};
    while(args.length){const arg=args.shift(),key={'--output-dir':'output','--mode':'mode','--confirm-live-domain':'confirmLiveDomain'}[arg];if(!key||!args.length||args[0].startsWith('--'))throw Error('Usage: node tools/build_release.cjs --output-dir NEW_DIRECTORY [--mode preview|production] [--confirm-live-domain innohub.cz]');if(Object.hasOwn(options,key))throw Error('Duplicate option: '+arg);options[key]=args.shift();}
    const result=buildRelease(options);console.log(JSON.stringify({...result,files:result.files.length},null,2));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={buildRelease};
