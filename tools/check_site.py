"""Offline integrity and SEO checks for the static distribution (no email/network writes)."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import argparse, json, re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
cli=argparse.ArgumentParser()
cli.add_argument('--indexing',choices=['off','on'],default='off')
args=cli.parse_args()
DIST=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
ORIGIN='https://innohub.cz'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.nodes=[];self.feed(text)
    def handle_starttag(self,t,a):self.nodes.append((t,dict(a)))
    handle_startendtag=handle_starttag

pages={p.resolve():Page(p.read_text(encoding='utf-8')) for p in DIST.rglob('*.html')}
errors=[];full=0;images=0;canonicals={};indexable=[]
def check(ok,*context):
    if not ok:errors.append(context)
for p,h in pages.items():
    rel=p.relative_to(DIST.resolve()).as_posix();text=p.read_text(encoding='utf-8')
    ids=[a['id'] for _,a in h.nodes if 'id' in a]
    check(len(ids)==len(set(ids)),rel,'duplicate ids')
    redirect=any(t=='meta' and a.get('http-equiv','').lower()=='refresh' for t,a in h.nodes)
    robots=[a.get('content','') for t,a in h.nodes if t=='meta' and a.get('name')=='robots']
    check(len(robots)==1,rel,'one robots tag required')
    expected='index' if args.indexing=='on' and not redirect and rel!='404.html' else 'noindex'
    check(robots and expected in robots[0].split(','),rel,'indexing must be '+expected)
    canonical=[a.get('href') for t,a in h.nodes if t=='link' and a.get('rel')=='canonical']
    if not redirect and rel!='404.html':
        full+=1;check(len(canonical)==1,rel,'canonical')
        expected_url=ORIGIN+'/'+(rel[:-10] if rel.endswith('index.html') else rel)
        check(canonical==[expected_url],rel,'canonical path',canonical)
        canonicals[expected_url]=h;indexable.append(expected_url)
        check(sum(t=='h1' for t,_ in h.nodes)==1,rel,'exactly one h1')
        descriptions=[a.get('content') for t,a in h.nodes if t=='meta' and a.get('name')=='description']
        check(len(descriptions)==1 and len(descriptions[0])>20,rel,'description')
        for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
            try:
                graph=json.loads(raw);check(graph['@context']=='https://schema.org',rel,'JSON-LD context')
                check(any(x['@type']=='Organization' for x in graph['@graph']),rel,'organization graph')
            except Exception as exc:errors.append((rel,'JSON-LD',str(exc)))
    for t,a in h.nodes:
        if t=='img':
            images+=1
            check('alt' in a,rel,'missing alt',a.get('src'))
            check('width'in a and 'height'in a,rel,'image dimensions',a.get('src'))
            check(not urlsplit(a.get('src','')).netloc,rel,'remote image',a.get('src'))
        links=[]
        if t in ('a','link') and a.get('href'):links.append(a['href'])
        if t in ('img','script') and a.get('src'):links.append(a['src'])
        if t=='source' and a.get('srcset'):links.extend(x.strip().split()[0] for x in a['srcset'].split(','))
        for link in links:
            u=urlsplit(link)
            if u.scheme or u.netloc:continue
            target=(DIST/u.path.lstrip('/')) if u.path.startswith('/') else ((p.parent/unquote(u.path)) if u.path else p)
            if u.path.endswith('/') or target.is_dir():target=target/'index.html'
            target=target.resolve()
            check(target.is_file(),rel,'missing local target',link)
            if u.fragment and target in pages:check(any(x.get('id')==u.fragment for _,x in pages[target].nodes),rel,'missing fragment',link)
        if t=='a' and a.get('target')=='_blank':check('noopener'in a.get('rel',''),rel,'unsafe external link')
    check('ondic1-tech.github.io' not in text and 'tc-innohub-navrh.' not in text,rel,'stale production host')
for url,h in canonicals.items():
    for t,a in h.nodes:
        if t=='link' and a.get('rel')=='alternate':
            target=a.get('href');check(target in canonicals,url,'hreflang target',target)
            if target in canonicals:check(any(x.get('rel')=='alternate' and x.get('href')==url for _,x in canonicals[target].nodes),url,'reciprocal hreflang',target)
sitemap=ET.parse(DIST/'sitemap.xml')
locs=[x.text for x in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
check(set(locs)==set(indexable),'sitemap','exactly the canonical content pages')
check(len(locs)==len(set(locs)),'sitemap','duplicates')
check('Disallow: /\n' not in (DIST/'robots.txt').read_text(),'robots','noindex must remain crawlable')
print(json.dumps({'html_files':len(pages),'content_pages':full,'images_checked':images,'sitemap_urls':len(locs),'indexing':args.indexing,'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
