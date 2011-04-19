#/usr/bin/env python

from optparse import OptionParser
import httplib, urllib
import os, fnmatch, shutil, re

usage = """usage: %prog [options] command

Commands:
  build                 build the script
  debug                 print the header to include js files
  clean                 remove any built files
"""
parser = OptionParser(usage=usage)
parser.add_option('-l', '--level', dest='level', default='ADVANCED_OPTIMIZATIONS',
                  help='Closure compilation level [WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, \
                  ADVANCED_OPTIMIZATIONS]')

UTILS = os.path.dirname(os.path.abspath(__file__))

SRC_ROOT= os.path.join(UTILS,'..','src')
BUILD_ROOT = os.path.join(UTILS,'..','build')
INDEX = os.path.join(UTILS,'..','index.html')
BUILD_NAME = 'DAT.GUI'
ALL = ['DAT']


def flatten(l, ltypes=(list, tuple)):
    ltype = type(l)
    l = list(l)
    i = 0
    while i < len(l):
        while isinstance(l[i], ltypes):
            if not l[i]:
                l.pop(i)
                i -= 1
                break
            else:
                l[i:i + 1] = l[i]
        i += 1
    return ltype(l)

def expand(path, globby):
  matches = []
  path = path.split('.')
  path.insert(0,SRC_ROOT)
  path = os.path.join(*path)
  for root, dirnames, filenames in os.walk(path):
    for filename in fnmatch.filter(filenames, globby):
      matches.append(os.path.join(root, filename))
  return matches

def source_list(src, globby='*.js'):
  def expander(f):
    return expand(f,globby)
  return set(flatten(map(expander, src)))

def compile(code):
  params = urllib.urlencode([
      ('js_code', code),
      ('compilation_level', options.level),
      ('output_format', 'text'),
      ('output_info', 'compiled_code'),
    ])
  headers = { 'Content-type': 'application/x-www-form-urlencoded' }
  conn = httplib.HTTPConnection('closure-compiler.appspot.com')
  conn.request('POST', '/compile', params, headers)
  response = conn.getresponse()
  data = response.read()
  conn.close()
  return data

def bytes_to_kb(b,digits=1):
  return round(0.0078125 * b, digits)

def clean():
  if os.path.exists(BUILD_ROOT):
    shutil.rmtree(BUILD_ROOT)
    print('DONE. Removed %s'%(BUILD_ROOT,))
  else:
    print('DONE. Nothing to clean')

def build(src):
  if not os.path.exists(BUILD_ROOT):
    os.makedirs(BUILD_ROOT)

  cssfiles = source_list(src, '*.css')
  css = '\n'.join([open(f).read() for f in cssfiles])
  css = re.sub(r'[ \t\n\r]+',' ',css)

  jsfiles = source_list(src, '*.js')
  code = '\n'.join([open(f).read() for f in jsfiles])
  code += """DAT.GUI.inlineCSS = '%s';\n"""%(css,)

  outpath = os.path.join(BUILD_ROOT, BUILD_NAME+'.js')
  with open(outpath,'w') as f:
    f.write(code)

  compiled = compile(code)
  outpath = os.path.join(BUILD_ROOT, BUILD_NAME+'.min.js')
  with open(outpath,'w') as f:
    f.write(compiled)

  size = bytes_to_kb(os.path.getsize(outpath))
  with open(INDEX,'r') as f:
    index = f.read()
  with open(INDEX,'w') as f:
    index = re.sub(r'\[[0-9.]+kb\]','[%skb]'%(size,),index)
    f.write(index)

  print('DONE. Built files in %s.'%(BUILD_ROOT,))

def debug(src):
  files = source_list(src)
  scripts = ""
  for f in files:
    scripts += '<script type="text/javascript" src="%s"></script>\n'%(f,)
  print(scripts)

if __name__ == '__main__':
  global options
  (options, args) = parser.parse_args()
  if len(args) != 1:
    print(parser.usage)
    exit(0)
  command = args[0]
  if command == 'build':
    build(ALL)
  elif command == 'clean':
    clean()
  elif command == 'debug':
    debug(ALL)


