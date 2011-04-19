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
parser.add_option('-l', '--level', dest='level', default='SIMPLE_OPTIMIZATIONS',
                  help='Closure compilation level [WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, \
                  ADVANCED_OPTIMIZATIONS]')

UTILS = os.path.dirname(os.path.relpath(__file__))
PREFIX = os.path.join(UTILS,'..')
SRC_ROOT= os.path.join(PREFIX,'src')
BUILD_ROOT = os.path.join(PREFIX,'build')
INDEX = os.path.join(PREFIX,'index.html')
BUILD_NAME = 'DAT.GUI'
ALL_JS = ['DAT.GUI.js','DAT.GUI']

LICENSE = """/**
 * dat.gui Javascript Controller Library
 * http://dataarts.github.com/dat.gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
"""

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
  filename = "%s.%s"%(path[-2],path[-1])
  if fnmatch.fnmatch(filename, globby):
    tmppath = os.path.join(*(path[:-1]+[filename]))
    if os.path.exists(tmppath):
      path[-1] = filename
    else:
      path = path[:-2]+[filename]
  path = os.path.join(*path)
  if os.path.isdir(path):
    for root, dirnames, filenames in os.walk(path):
      for filename in fnmatch.filter(filenames, globby):
        matches.append(os.path.join(root, filename))
  else:
    matches.append(path)
  return matches

def unique(seq, idfun=None):
  """Ordered uniquify function
  if in 2.7 use:
   OrderedDict.fromkeys(seq).keys()
  """
  if idfun is None:
    def idfun(x): return x
  seen = {}
  result = []
  for item in seq:
    marker = idfun(item)
    if marker in seen: continue
    seen[marker] = 1
    result.append(item)
  return result

def source_list(src, globby='*.js'):
  def expander(f):
    return expand(f,globby)
  return unique(flatten(map(expander, src)))

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
  return round(0.0009765625 * b, digits)

def clean():
  if os.path.exists(BUILD_ROOT):
    shutil.rmtree(BUILD_ROOT)
    print('DONE. Removed %s'%(BUILD_ROOT,))
  else:
    print('DONE. Nothing to clean')

def build(jssrc, csssrc=list([''])):
  if not os.path.exists(BUILD_ROOT):
    os.makedirs(BUILD_ROOT)

  if csssrc:
    cssfiles = source_list(csssrc, '*.css')
    print('CSS files being compiled: ', cssfiles)
    css = '\n'.join([open(f).read() for f in cssfiles])
    css = re.sub(r'[ \t\n\r]+',' ',css)

  jsfiles = source_list(jssrc, '*.js')
  print('JS files being compiled: ', jsfiles)
  code = '\n'.join([open(f).read() for f in jsfiles])
  if csssrc:
    code += """DAT.GUI.inlineCSS = '%s';\n"""%(css,)

  outpath = os.path.join(BUILD_ROOT, BUILD_NAME+'.js')
  with open(outpath,'w') as f:
    f.write(LICENSE)
    f.write(code)

  compiled = compile(code)
  outpathmin = os.path.join(BUILD_ROOT, BUILD_NAME+'.min.js')
  with open(outpathmin,'w') as f:
    f.write(LICENSE)
    f.write(compiled)

  size = bytes_to_kb(os.path.getsize(outpath))
  sizemin = bytes_to_kb(os.path.getsize(outpathmin))
  with open(INDEX,'r') as f:
    index = f.read()
  with open(INDEX,'w') as f:
    index = re.sub(r'<small id=\'buildsize\'>\[[0-9.]+kb\]','<small id=\'buildsize\'>[%skb]'%(size,),index)
    index = re.sub(r'<small id=\'buildsizemin\'>\[[0-9.]+kb\]','<small id=\'buildsizemin\'>[%skb]'%(sizemin,),index)
    f.write(index)

  print('DONE. Built files in %s.'%(BUILD_ROOT,))

def debug(jssrc, csssrc=list([''])):
  head = ""
  files = source_list(csssrc, '*.css')
  for f in files:
    f = f.replace(PREFIX+'/','')
    head += '<link href="%s" media="screen" rel="stylesheet" type="text/css"/>\n'%(f,)
  files = source_list(jssrc, '*.js')
  for f in files:
    f = f.replace(PREFIX+'/','')
    head += '<script type="text/javascript" src="%s"></script>\n'%(f,)
  print(head)

if __name__ == '__main__':
  global options
  (options, args) = parser.parse_args()
  if len(args) != 1:
    print(parser.usage)
    exit(0)
  command = args[0]
  if command == 'build':
    build(ALL_JS)
  elif command == 'clean':
    clean()
  elif command == 'debug':
    debug(ALL_JS)


