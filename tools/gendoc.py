import json
import os, fnmatch
import StringIO

def rglob(path, pattern):
	for root, dirnames, filenames in os.walk(path):
		for filename in fnmatch.filter(filenames, pattern):
			yield root + '/' + filename

schemas = {}

files = rglob('.', '*.json')
for f in files:
	if f.startswith('./package'): continue

	data = json.loads(open(f, 'rb').read())
	if '$schema' not in data or 'id' not in data: continue

	schemas[data['id']] = data

class SchemaWriter(object):
	def __init__(self, schema_id):
		self.schema = schemas[schema_id]

		self.out = StringIO.StringIO()

	def write(self, *args):
		self.out.write(*args)

	def string(self):
		return self.out.getvalue()

	def _sphinx_ref_prefix(self):
		return ['apireference']

	def sphinx_ref_name(self, ref):
		return '_'.join(ref)

	def sphinx_ref_link(self, ref):
		return ':ref:`' + self.sphinx_ref_name(ref) + '`'

	def header(self, level, title, ref=None):
		if ref is not None:
			if isinstance(ref, list):
				ref = self.sphinx_ref_name(self._sphinx_ref_prefix() + ref)
			self.write('.. _' + ref + ':\n\n')
		ch = '=-~'[level - 1]
		self.write(title + '\n')
		self.write(ch * len(title) + '\n\n')

	def paragraph(self, text):
		self.write(text + '\n\n')

	def funcdesc(self, desc):
		if 'params' in desc:
			self.paragraph('**Parameters**')

			for param in desc['params']:
				pname = '**%s** ' % param['name']
				ptype = '%s' % self.link_type(param['value'])
				pdesc = param.get('description', '')
				self.paragraph(pname + ', '.join([ptype + pdesc]))

		if 'returns' in desc:
			self.paragraph('**Return Value**')

			param = desc['returns']
			ptype = '%s ' % self.link_type(param['value'])
			pdesc = param.get('description', '')
			self.paragraph(', '.join([ptype + pdesc]))

	def link_type(self, ref):
		strip_arr = ref
		if 'items' in ref:
			strip_arr = ref['items']
		jsref = strip_arr.get('$ref', None)
		link = None

		if jsref is not None:
			if '#' in jsref:
				jsref = jsref.split('#')[0]
				if jsref == '':
					jsref = '/'.join(self._sphinx_ref_prefix()[1:])
			link = self.sphinx_ref_name(['apireference'] + jsref.strip('/').split('/'))

		txt = self.describe_type(ref)
		if link is None:
			return txt
		else:
			return ':ref:`%s <%s>`' % (txt, link)

	def describe_type(self, ref):
		if isinstance(ref, basestring):
			return ref
		elif 'type' in ref:
			if ref['type'] == 'array':
				if '$ref' in ref['items']:
					return '[]' + self.describe_ref(ref['items']['$ref'])
				else:
					return '[]' + self.describe_type(ref['items'])
			else:
				return ref['type']
		elif 'properties' in ref:
			return 'object'
		elif '$ref' in ref:
			return self.describe_ref(ref['$ref'])
		else:
			return 'unknown'

	def describe_ref(self, ref):
		desc = ref.split('/')[-1]
		if '#' in ref and not ref.startswith('#'):
			desc = ref.split('#')[0].split('/')[-1] + '.' + desc
		return desc

class ServiceSchemaWriter(SchemaWriter):
	def __init__(self, name):
		self.name = name
		super(ServiceSchemaWriter, self).__init__('http://schema.ninjablocks.com/service/' + name)

	def _sphinx_ref_prefix(self):
		return ['apireference', 'service', self.name]

	def dump(self):
		self.header(1, self.schema.get('title', self.name), ref=[])

		if 'description' in self.schema:
			self.paragraph(self.schema['description'])

		self.header(2, 'Methods', ref=['methods'])

		for method, desc in sorted(self.schema['methods'].items()):
			params = ''
			if 'params' in desc:
				params = ', '.join([p['name'] for p in desc['params']])
			ret = ''
			#if 'returns' in desc:
			#	ret = ' -> ' + self.describe_type(desc['returns']['value'])
			self.header(3, method + '(' + params + ')' + ret, ref=['methods', method])

			self.paragraph(desc['description'])

			self.funcdesc(desc)

		if 'definitions' in self.schema:
			self.header(2, 'Definitions', ref=['definitions'])

			for name, desc in sorted(self.schema['definitions'].items()):
				self.header(3, name, ref=['definitions', name])
				if 'type' not in desc: continue
				t = desc['type']
				if t == 'string' and 'pattern' in desc:
					t += ' ' + desc['pattern']
				d = desc.get('description', '')

				self.paragraph('*%s* %s' % (t, d))

class ModelSchemaWriter(SchemaWriter):
	def __init__(self, name):
		self.name = name
		super(ModelSchemaWriter, self).__init__('http://schema.ninjablocks.com/model/' + name)

	def _sphinx_ref_prefix(self):
		return ['apireference', 'model', self.name]

	def dump(self):
		self.header(1, self.schema.get('title', self.name), ref=[])

		if 'description' in self.schema:
			self.paragraph(self.schema['description'])

		properties = None
		if 'properties' in self.schema:
			properties = self.schema['properties']
		elif 'allOf' in self.schema:
			properties = self.schema['allOf'][0]['properties']

		if properties is not None:
			for n,v in properties.iteritems():
				self.paragraph('**%s** %s' % (n, self.link_type(v)))

class ProtocolSchemaWriter(SchemaWriter):
	def __init__(self, name):
		self.name = name
		super(ProtocolSchemaWriter, self).__init__('http://schema.ninjablocks.com/protocol/' + name)

	def _sphinx_ref_prefix(self):
		return ['apireference', 'protocol', self.name]

	def dump(self):
		self.header(1, self.schema.get('title', self.name), ref=[])

		if 'description' in self.schema:
			self.paragraph(self.schema['description'])

		if 'methods' in self.schema:
			self.header(2, 'Methods', ref=['methods'])

			for method, desc in sorted(self.schema['methods'].items()):
				params = ''
				if 'params' in desc:
					params = ', '.join([p['name'] for p in desc['params']])
				ret = ''
				#if 'returns' in desc:
				#	ret = ' -> ' + self.describe_type(desc['returns']['value'])
				self.header(3, method + '(' + params + ')' + ret, ref=['methods', method])

				self.paragraph(desc['description'])

				self.funcdesc(desc)

		if 'events' in self.schema:
			self.header(2, 'Events', ref=['events'])
			for event, desc in sorted(self.schema['events'].items()):
				params = ''
				if 'params' in desc:
					params = ', '.join([p['name'] for p in desc['params']])

				self.header(3, event, ref=['events', event])

				if 'description' in desc:
					self.paragraph(desc['description'])

				if 'value' in desc:
					self.paragraph(self.link_type(desc['value']))

class StateSchemaWriter(SchemaWriter):
	def __init__(self, name):
		self.name = name
		super(StateSchemaWriter, self).__init__('http://schema.ninjablocks.com/state/' + name)

	def _sphinx_ref_prefix(self):
		return ['apireference', 'state', self.name]

	def dump(self):
		self.header(1, self.schema.get('title', self.name), ref=[])

		if 'description' in self.schema:
			self.paragraph(self.schema['description'])

		if 'definitions' in self.schema:
			for n,v in self.schema['definitions'].items():
				self.header(2, n, ref=[n])
				if 'type' in v:
					self.paragraph('*%s* %s' % (self.describe_type(v['type']), v['title'], ))
				else:
					self.paragraph(v['title'])
				if 'description' in v: self.paragraph(v['description'])
		else:
			properties = None
			if 'properties' in self.schema:
				properties = self.schema['properties']
			elif 'allOf' in self.schema:
				properties = self.schema['allOf'][0]['properties']

			if properties is not None:
				for n,v in properties.iteritems():
					self.paragraph('**%s** %s' % (n, self.link_type(v)))

def write_toc(path, title, items):
	f = open(path, 'wb')
	f.write(title + '\n')
	f.write('=' * len(title) + '\n\n')
	f.write('Contents:\n\n')
	f.write('.. toctree::\n')
	f.write('   :maxdepth: 1\n')
	f.write('   \n')
	for item in items:
		f.write('   %s\n' % item)
	f.close()


SPHINX_PATH = '../developer-docs/source'

def dump_md(name, cls):
	w = cls(name)
	w.dump()
	#print w.string()
	path = os.path.join(SPHINX_PATH, '/'.join(w._sphinx_ref_prefix()) + '.rst')
	pdir = os.path.dirname(path)
	if not os.path.exists(pdir):
		os.makedirs(pdir)
	open(path, 'wb').write(w.string().encode('utf-8'))

def dump_service_md(name):
	dump_md(name, ServiceSchemaWriter)

def dump_model_md(name):
	dump_md(name, ModelSchemaWriter)

def dump_protocols_md(name):
	dump_md(name, ProtocolSchemaWriter)

def dump_states_md(name):
	dump_md(name, StateSchemaWriter)

def do_iter_and_toc(slug, title, dumpfunc, exclude=[]):
	services = []
	for service in os.listdir(slug):
		if service.endswith('.json'):
			name = service[:-5]
			if name in exclude: continue
			dumpfunc(name)
			services.append(name)

	path = os.path.join(SPHINX_PATH, 'apireference/'+slug+'/index.rst')
	write_toc(path, title, services)

do_iter_and_toc('model', 'Models', dump_model_md, exclude=[])
do_iter_and_toc('service', 'Services', dump_service_md, exclude=['test-service'])
do_iter_and_toc('protocol', 'Protocols', dump_protocols_md, exclude=[])
do_iter_and_toc('state', 'States', dump_states_md, exclude=[])