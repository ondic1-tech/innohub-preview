// Offline application tests. No network request or email is sent.
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../main.js'),'utf8');
function setup(lang,fetchImpl,values={name:'Test',surname:'Example',email:'test@example.invalid',message:'Offline test',_honey:''}){
 const classes=new Set(),attributes=new Map(),fields={hidden:false},button={disabled:false,textContent:'Send'},status={textContent:'',focused:false,classList:{add:c=>classes.add(c),remove:(...cs)=>cs.forEach(c=>classes.delete(c))},focus(){this.focused=true;}};
 const handlers={},form={reportValidity:()=>true,querySelector:s=>s==='button[type="submit"]'?button:fields,addEventListener:(name,handler)=>handlers[name]=handler,setAttribute:(k,v)=>attributes.set(k,v),removeAttribute:k=>attributes.delete(k),reset(){this.resetCalled=true;}};
 let timeout,cleared=false,calls=[];
 const document={documentElement:{lang},querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>id==='inquiry-form'?form:id==='form-status'?status:null};
 vm.runInNewContext(source,{document,navigator:{},location:{origin:'https://preview.example',pathname:'/contact/',search:'?private=do-not-send'},FormData:class{constructor(){return Object.entries(values);}},AbortController,URL,setTimeout:fn=>{timeout=fn;return 1;},clearTimeout:()=>{cleared=true;},fetch:(...args)=>{calls.push(args);return fetchImpl(...args);}});
 return {form,button,status,fields,classes,attributes,calls,submit:()=>handlers.submit({preventDefault(){}}),timeout:()=>timeout(),cleared:()=>cleared};
}
for(const lang of ['cs','en']){
 test(lang+': real activation-required response is distinguished before generic success validation',async()=>{
  const app=setup(lang,async()=>({ok:true,json:async()=>({success:'false',message:"This form needs Activation. We've sent you an email containing an 'Activate Form' link. Just click it and your form will be actived!"})}));
  await app.submit();assert.equal(app.fields.hidden,false);assert.equal(app.form.resetCalled,undefined);assert.equal(app.classes.has('success'),false);assert.equal(app.classes.has('error'),true);assert.equal(app.status.focused,true);assert.match(app.status.textContent,lang==='en'?/not available yet/:/není zprovozněný/);assert.equal(app.button.disabled,false);
 });
 test(lang+': successful response hides fields only after acknowledgement and sends no URL query',async()=>{
  const app=setup(lang,async()=>({ok:true,json:async()=>({success:true})}));await app.submit();assert.equal(app.calls.length,1);assert.equal(app.calls[0][0],'https://formsubmit.co/ajax/innohub@tc.cz');assert.equal(JSON.parse(app.calls[0][1].body)._url,'https://preview.example/contact/');assert.equal(app.fields.hidden,true);assert.equal(app.status.focused,true);assert.equal(app.form.resetCalled,true);assert.equal(app.attributes.has('aria-busy'),false);assert.equal(app.cleared(),true);
 });
 test(lang+': invalid input never invokes the provider',async()=>{const app=setup(lang,()=>{throw Error('must not run');});app.form.reportValidity=()=>false;await app.submit();assert.equal(app.calls.length,0);});
 test(lang+': honeypot never invokes the provider',async()=>{const app=setup(lang,()=>{throw Error('must not run');},{_honey:'spam'});await app.submit();assert.equal(app.calls.length,0);});
 test(lang+': two submissions while pending generate one request',async()=>{let finish;const app=setup(lang,()=>new Promise(resolve=>finish=resolve));const first=app.submit();await app.submit();assert.equal(app.calls.length,1);assert.equal(app.button.disabled,true);finish({ok:true,json:async()=>({success:'true'})});await first;assert.equal(app.button.disabled,false);});
 const failures={http:async()=>({ok:false,json:async()=>({success:true})}),provider:async()=>({ok:true,json:async()=>({success:false})}),activation:async()=>({ok:true,json:async()=>({success:true,message:'Please activate this form'})}),invalidJSON:async()=>({ok:true,json:async()=>{throw Error('not JSON');}}),network:async()=>{throw Error('network unavailable');}};
 for(const [name,fetchImpl] of Object.entries(failures))test(lang+': '+name+' failure keeps input and exposes a focused retry message',async()=>{const app=setup(lang,fetchImpl);await app.submit();assert.equal(app.fields.hidden,false);assert.equal(app.button.disabled,false);assert.equal(app.form.resetCalled,undefined);assert.equal(app.classes.has('error'),true);assert.equal(app.status.focused,true);assert.match(app.status.textContent,/innohub@tc.cz/);assert.equal(app.attributes.has('aria-busy'),false);assert.equal(app.cleared(),true);});
 test(lang+': timeout aborts and restores the form',async()=>{const app=setup(lang,(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Error('aborted')))));const pending=app.submit();app.timeout();await pending;assert.equal(app.classes.has('error'),true);assert.equal(app.fields.hidden,false);assert.equal(app.button.disabled,false);assert.equal(app.cleared(),true);});
}
