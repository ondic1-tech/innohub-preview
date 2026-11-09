"""Post-process the approved static site. Never run the retained old generate.py.

Default: prepare innohub.cz metadata while keeping ALL HTML noindex.
--enable-indexing requires --confirm-live-domain innohub.cz.
"""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin
import argparse, hashlib, json, posixpath, re
import xml.etree.ElementTree as ET
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist' if (ROOT / 'dist').is_dir() else ROOT
CONFIG = json.loads((ROOT / 'site.config.json').read_text(encoding='utf-8'))
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--enable-indexing', action='store_true')
parser.add_argument('--confirm-live-domain')
args = parser.parse_args()
if args.enable_indexing and args.confirm_live_domain != 'innohub.cz':
    parser.error('Indexing stays disabled: explicitly confirm --confirm-live-domain innohub.cz after checking the live domain.')
INDEX = args.enable_indexing
ORIGIN = CONFIG['origin'].rstrip('/')
assert ORIGIN == 'https://innohub.cz'
ASSETS = DIST / 'assets/optimized'
ASSETS.mkdir(exist_ok=True)
HOSTS = ('https://ondic1-tech.github.io/innohub-preview', 'https://tc-innohub-navrh.esa-technolo-0761.chatgpt.site')

def plain(s):
    return unescape(re.sub('<[^>]*>', '', s)).strip()

def read(p):
    return p.read_bytes().decode('utf-8')

def write(p,s):
    p.write_bytes(s.encode('utf-8'))

def attrs(tag):
    class P(HTMLParser):
        def handle_starttag(self,t,a): self.data=dict(a)
        handle_startendtag=handle_starttag
    p=P();p.feed(tag);return p.data

def tag(name, values):
    return '<'+name+''.join(' '+k+'="'+escape(str(v),quote=True)+'"' for k,v in values.items())+'>'

def url(p):
    name=p.relative_to(DIST).as_posix()
    return ORIGIN + '/' + (name[:-10] if name.endswith('index.html') else name)

def local_url(p,target):
    return posixpath.relpath(target.relative_to(DIST).as_posix(),p.parent.relative_to(DIST).as_posix())

def meta(s,key,value,prop=False):
    kind='property' if prop else 'name'
    s=re.sub(r'<meta\b[^>]*'+kind+'="'+re.escape(key)+r'"[^>]*>','',s)
    return s.replace('</head>',tag('meta',{kind:key,'content':value})+'</head>')

def digest(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()[:12]

external={
 'https://cdn.muni.cz/media/3639417/cih_lg_col_rgb.png?mode=crop&center=0.5,0.5&rnd=133555746800000000&width=170':DIST/'assets/platforms/cih-logo.png',
 'https://www.tc-runway.cz/wp-content/uploads/2025/11/tc-runway.svg':DIST/'assets/platforms/tc-runway.svg',
}
alt_overrides={
 'psp-space-prototype.jpg':('Prototyp hlavice Plasma Shock Peening pro povrchové úpravy kovů v projektu PSP SPACE','Plasma Shock Peening prototype head for metal surface treatment in the PSP SPACE project'),
 'aturno-team.jpg':('Tým Aturno.ai, startupu vyvíjejícího AI nástroje pro právní praxi','Aturno.ai team, developing AI tools for legal practice'),
 'antivenom-research-ai.jpg':('AI ilustrace laboratorního odběru hadího jedu pro výzkum nových antisér','AI-generated illustration of laboratory venom collection for antivenom research'),
 'lasers.png':('Výzkumník u laserového zařízení ve vakuové komoře','Researcher working with laser equipment inside a vacuum chamber'),
}
variants={}
def webp(p):
    if p in variants:return variants[p]
    name=p.relative_to(DIST/'assets').as_posix().replace('/','-').rsplit('.',1)[0]
    with Image.open(p) as source:
        im=ImageOps.exif_transpose(source)
        if im.mode not in ('RGB','RGBA'):im=im.convert('RGBA' if 'transparency' in source.info else 'RGB')
        widths=sorted(set([min(im.width,w) for w in (360,720,1080)]))
        if im.width<=200:widths=[im.width]
        if p.name=='tc-logo-en.png':widths=[min(im.width,1079)]
        elif p.name in ('commercialization-reactor-symbol.png','commercialization-reactor-wordmark.png'):
            widths=sorted(set([min(im.width,180)]+widths))
        result=[]
        for width in widths:
            path=ASSETS/f'{name}-{width}.webp'
            resized=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS) if width!=im.width else im
            resized.save(path,'WEBP',quality=84,method=6,lossless=('logo' in p.name or 'wordmark' in p.name or 'symbol' in p.name))
            result.append((width,path))
    variants[p]=result
    return result

pages=[]
for p in sorted(DIST.rglob('*.html')):
    s=read(p)
    for old in HOSTS:s=s.replace(old,ORIGIN)
    s=re.sub(r'<link\b[^>]*>',lambda m:tag('link',dict(sorted(attrs(m[0]).items(),key=lambda kv:(kv[0]!='rel',kv[0]!='hreflang',kv[0])))),s)
    redirect=bool(re.search(r'http-equiv="refresh"',s,re.I))
    if redirect:
        # A redirect destination, never a separately indexable landing page.
        s=meta(s,'robots','noindex,follow')
        s=re.sub(r'(<link rel="canonical" href=")[^\"]+',lambda m:m[0].split('#')[0],s)
        write(p,s)
        continue
    en=bool(re.search(r'<html[^>]*lang="en"',s))
    lang='en' if en else 'cs'
    # All three weights are used above the fold; preserve anonymous font CORS.
    s=re.sub(r'<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="font")[^>]*>','',s)
    preloads=''.join(tag('link',{'rel':'preload','as':'font','type':'font/woff2','crossorigin':'anonymous','href':local_url(p,DIST/f'assets/noway-{weight}.woff2')}) for weight in ('regular','medium','bold'))
    s=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>',lambda m:preloads+m[0],s,count=1)
    if p.relative_to(DIST).as_posix() in ('sluzby/index.html','en/services/index.html'):
        s=re.sub(r'id="panel-([a-z]+)"',r'id="\1"',s)
        s=re.sub(r'aria-controls="panel-([a-z]+)"',r'aria-controls="\1"',s)
        s=s.replace(' role="tablist"','').replace(' aria-orientation="vertical"','').replace(' role="tab"','').replace(' role="tabpanel"','')
        s=re.sub(r' aria-selected="(?:true|false)"','',s)
        s=re.sub(r' tabindex="(?:0|-1)"','',s)
        s=re.sub(r'(<section\b[^>]*id="(?:komercializace|validace|financovani|startupy|analyzy)"[^>]*) hidden',r'\1',s)
        if '<h1 class="visually-hidden">' not in s:
            s=s.replace('<h1>','<h2 class="service-panel-title">').replace('</h1>','</h2>')
            s=s.replace('<main id="main">','<main id="main"><h1 class="visually-hidden">'+('Services' if en else 'Služby')+'</h1>')
    # Responsive sources retain the original approved image as a fallback.
    s=re.sub(r'<picture class="responsive-image">[\s\S]*?(<img\b[^>]*>)[\s\S]*?</picture>',r'\1',s)
    photo_count=0
    def image(m):
        global photo_count
        a=attrs(m[0]);src=a.get('src','')
        target=external.get(src)
        if target:a['src']=src=local_url(p,target)
        a.setdefault('decoding','async')
        path=(p.parent/urlsplit(src).path).resolve()
        name=path.name
        if name in alt_overrides and not a.get('alt'):a['alt']=alt_overrides[name][1 if en else 0]
        if 'team/' in src and a.get('alt'):a['alt']=re.sub(r'^(?:Portrét |Portrait of )','',a['alt']);a['alt']=('Portrait of ' if en else 'Portrét ')+a['alt']
        meaningful_photo=('news-photo' in a.get('class','') or 'ar-photo' in a.get('class','') or 'team/' in src or name=='lasers.png')
        if meaningful_photo:
            photo_count+=1
            a['loading']='eager' if photo_count==1 else 'lazy'
            if photo_count==1:a['fetchpriority']='high'
            else:a.pop('fetchpriority',None)
        elif 'tc-logo' not in a.get('class',''):
            a.setdefault('loading','lazy')
        if path.is_file() and path.suffix.lower() in ('.png','.jpg','.jpeg') and name!='strast-favicon.png':
            vs=webp(path)
            if 'news-photo' in a.get('class',''):sizes='(max-width:600px) calc(100vw - 44px), (max-width:900px) calc((100vw - 100px)/2), 370px'
            elif 'ar-photo' in a.get('class',''):sizes='(max-width:600px) calc(100vw - 44px), (max-width:900px) 220px, 370px'
            elif 'team/' in src:sizes='140px'
            elif 'tc-logo' in a.get('class',''):sizes='(max-width:360px) 108px, (max-width:600px) 141px, (max-width:950px) 177px, 212px'
            elif name=='commercialization-reactor-symbol.png':sizes='58px'
            elif name=='commercialization-reactor-wordmark.png':sizes='140px'
            else:sizes=str(a.get('width','420'))+'px'
            source=tag('source',{'type':'image/webp','srcset':', '.join(local_url(p,path)+' '+str(width)+'w' for width,path in vs),'sizes':sizes})
            return '<picture class="responsive-image">'+source+tag('img',a)+'</picture>'
        return tag('img',a)
    s=re.sub(r'<img\b[^>]*>',image,s)
    # Use directories consistently; canonical URLs already omit index.html.
    s=re.sub(r'(<a\b[^>]*href=")([^"?#]*)index\.html([#?][^"]*)?("[^>]*>)',lambda m:m[0] if urlsplit(m[2]).scheme or m[2].startswith('//') else m[1]+(m[2] or './')+(m[3] or '')+m[4],s)
    title=plain(re.search(r'<title>(.*?)</title>',s,re.S)[1])
    path=p.relative_to(DIST).as_posix()
    s=re.sub(r'<title>.*?</title>','<title>'+escape(title)+'</title>',s,flags=re.S)
    descriptions=[attrs(m[0]).get('content','') for m in re.finditer(r'<meta\b[^>]*>',s) if attrs(m[0]).get('name')=='description']
    assert len(descriptions)==1,(p,descriptions)
    description=descriptions[0]
    s=meta(s,'description',description)
    s=meta(s,'robots','index,follow,max-image-preview:large' if INDEX and path!='404.html' else 'noindex,follow')
    s=re.sub(r'<meta name="keywords"[^>]*>','',s)
    canonical=url(p)
    s=re.sub(r'<link rel="canonical"[^>]*>',tag('link',{'rel':'canonical','href':canonical}),s)
    default_image=ORIGIN+'/assets/news/innohub-tc-praha.jpg'
    s=meta(s,'og:title',title,True);s=meta(s,'og:description',description,True);s=meta(s,'og:url',canonical,True)
    s=meta(s,'og:image',default_image,True);s=meta(s,'og:image:alt','Technology Centre Prague building' if en else 'Budova Technologického centra Praha',True)
    s=meta(s,'og:locale','en_GB' if en else 'cs_CZ',True)
    s=meta(s,'og:site_name','INNOHUB · TC Business Innovation Hub',True)
    for k,v in [('twitter:card','summary_large_image'),('twitter:title',title),('twitter:description',description),('twitter:image',default_image),('twitter:image:alt','Technology Centre Prague building' if en else 'Budova Technologického centra Praha')]:s=meta(s,k,v)
    # Discard stale JSON-LD, replacing it with one connected and factual graph.
    s=re.sub(r'<script type="application/ld\+json">[\s\S]*?</script>','',s)
    graph=[{'@type':'Organization','@id':ORIGIN+'/#organization','name':'TC Business Innovation Hub','alternateName':'INNOHUB','url':ORIGIN+'/','email':'innohub@tc.cz','parentOrganization':{'@type':'Organization','name':'Technology Centre Prague' if en else 'Technologické centrum Praha','url':'https://www.tc.cz/'},'address':{'@type':'PostalAddress','streetAddress':'Ve Struhách 1076/27','addressLocality':'Praha 6','postalCode':'160 00','addressCountry':'CZ'}},
           {'@type':'WebSite','@id':ORIGIN+'/#website','name':'INNOHUB · TC Business Innovation Hub','url':ORIGIN+'/','publisher':{'@id':ORIGIN+'/#organization'},'inLanguage':['cs','en']},
           {'@type':'ContactPage' if path in ('kontakt/index.html','en/contact/index.html') else 'WebPage','@id':canonical+'#webpage','name':title,'description':description,'url':canonical,'inLanguage':lang,'isPartOf':{'@id':ORIGIN+'/#website'},'about':{'@id':ORIGIN+'/#organization'}}]
    crumb=re.search(r'<nav class="breadcrumb"[^>]*>(.*?)</nav>',s,re.S)
    if crumb:
        crumbs=[]
        for text in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>|<span\b[^>]*aria-current="page"[^>]*>(.*?)</span>',crumb[1]):
            label=plain(text[2] if text[1] else text[3]);item=urljoin(canonical,unescape(text[1])) if text[1] else canonical
            crumbs.append({'@type':'ListItem','position':len(crumbs)+1,'name':label,'item':item})
        if crumbs:graph.append({'@type':'BreadcrumbList','@id':canonical+'#breadcrumb','itemListElement':crumbs})
    s=s.replace('</head>','<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':'))+'</script></head>')
    if path=='404.html':
        s=re.sub(r'<link rel="(?:canonical|alternate)"[^>]*>','',s)
        if 'data-error-base' not in s:
            s=s.replace('<head>','<head><base data-error-base href="/"><script>if(location.hostname.endsWith(".github.io"))document.querySelector("base[data-error-base]").href="/innohub-preview/";</script>',1)
    else:pages.append((p,canonical))
    write(p,s)

# Content hashes prevent stale assets after deploying to an already visited preview.
for p in DIST.rglob('*.html'):
    s=read(p)
    def revision(m):
        key,ref=m[1],unescape(m[2]);u=urlsplit(ref)
        if u.scheme:return m[0]
        target=(p.parent/u.path).resolve()
        if target.is_file() and target.suffix in ('.css','.js'):return key+'="'+u.path+'?v='+digest(target)+'"'
        return m[0]
    s=re.sub(r'(href|src)="([^"]+)"',revision,s)
    write(p,s)

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
ET.register_namespace('xhtml','http://www.w3.org/1999/xhtml')
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
sitemap=ET.Element(ns+'urlset')
for p,canonical in pages:
    el=ET.SubElement(sitemap,ns+'url');ET.SubElement(el,ns+'loc').text=canonical
    for m in re.finditer(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"',read(p)):
        ET.SubElement(el,'{http://www.w3.org/1999/xhtml}link',{'rel':'alternate','hreflang':m[1],'href':unescape(m[2])})
ET.ElementTree(sitemap).write(DIST/'sitemap.xml',encoding='utf-8',xml_declaration=True)
write(DIST/'robots.txt','User-agent: *\nAllow: /\n\n# HTML noindex stays active until innohub.cz launch is explicitly confirmed.\nSitemap: '+ORIGIN+'/sitemap.xml\n')
report={'origin':ORIGIN,'indexing':INDEX,'sitemap_pages':len(pages),'optimized_images':len(variants),'original_bytes':sum(p.stat().st_size for p in variants),'largest_webp_bytes':sum(v[-1][1].stat().st_size for v in variants.values())}
write(ROOT/'optimization-report.json',json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report))
