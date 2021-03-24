import { expect } from 'chai'
import { Switch } from '../src/Switch';
import { PathTree } from '../src/PathTree/PathTree';
import { RootPathItem } from '../src/PathTree/RootPathItem';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { SpreadPathItem } from '../src/PathTree/SpreadPathItem';
import { SwitchPathItem } from '../src/PathTree/SwitchPathItem';
import { Callback, Config, ExternalArgsType } from '../src/types';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';
import { 
  parsePath, 
  splitFromSwitchPathItem, 
  splitSwitchExpressions, 
  hasWhiteSpace, 
  hasAnyOfChars, 
  matchCommands, 
  matchSwitches, 
  matchCommandsGetPathParameters, 
  processCallbacks, 
  matchRuntimeAndDefinedSwitches, 
  checkSwitchNameConflicts
} from '../src/utility';

describe('utility', () => {

  describe('hasWhiteSpace', () => {

    it('hasWhiteSpace for ""', () => {
      const str = "";

      const output = hasWhiteSpace(str);

      expect(output).to.be.false;
    });

    it('hasWhiteSpace for "a"', () => {
      const str = "a";

      const output = hasWhiteSpace(str);

      expect(output).to.be.false;
    });

    it('hasWhiteSpace for "ab"', () => {
      const str = "ab";

      const output = hasWhiteSpace(str);

      expect(output).to.be.false;
    });

    it('hasWhiteSpace for " "', () => {
      const str = " ";

      const output = hasWhiteSpace(str);

      expect(output).to.be.true;
    });

    it('hasWhiteSpace for "<TAB>"', () => {
      const str = "\t";

      const output = hasWhiteSpace(str);

      expect(output).to.be.true;
    });

    it('hasWhiteSpace for "<NEWLINE>"', () => {
      const str = "\n";

      const output = hasWhiteSpace(str);

      expect(output).to.be.true;
    });

  });
  
  describe('hasAnyOfChars', () => {

    it('hasAnyOfChars for "ab cb" and []', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, []);
  
      expect(output).to.be.false;
    });

    it('hasAnyOfChars for "ab cb" and [""] throws Error', () => {
      const str = "ab cb";
  
      expect(() => {
        hasAnyOfChars(str, ['']);
      }).throws();

    });
    
    it('hasAnyOfChars for "ab cb" and ["ab"] throws Error', () => {
      const str = "ab cb";
  
      expect(() => {
        hasAnyOfChars(str, ['ab']);
      }).throws();
    });

    it('hasAnyOfChars for "ab cb" and [" "]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, [' ']);
  
      expect(output).to.be.true;
    });

    it('hasAnyOfChars for "ab cb" and ["a"]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, ['a']);
  
      expect(output).to.be.true;
    });

    it('hasAnyOfChars for "ab cb" and ["b"]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, ['b']);
  
      expect(output).to.be.true;
    });

    it('hasAnyOfChars for "ab cb" and ["z"]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, ['z']);

      expect(output).to.be.false;
    });

    it('hasAnyOfChars for "ab cb" and ["a", "z"]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, ['a', 'z']);

      expect(output).to.be.true;
    });

    it('hasAnyOfChars for "ab cb" and ["y", "z"]', () => {
      const str = "ab cb";
  
      const output = hasAnyOfChars(str, ['y', 'z']);

      expect(output).to.be.false;
    });

  });

  describe('splitFromSwitchPathItem', () => {

    it('splitFromSwitchPathItem for ""', () => {
      const path = "";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('');  
      expect(strs[1]).to.equal('');  
    });

    it('splitFromSwitchPathItem for "/"', () => {
      const path = "/";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('/');
      expect(strs[1]).to.equal('');
    });

    it('splitFromSwitchPathItem for "abc"', () => {
      const path = "abc";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('abc');
      expect(strs[1]).to.equal('');
    });

    it('splitFromSwitchPathItem for "/abc/edf"', () => {
      const path = "/abc/edf";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('/abc/edf');
      expect(strs[1]).to.equal('');
    });

    it('splitFromSwitchPathItem for "[abc]"', () => {
      const path = "[abc]";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('');
      expect(strs[1]).to.equal('[abc]');
    });

    it('splitFromSwitchPathItem for "/[abc]"', () => {
      const path = "/[abc]";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('/');
      expect(strs[1]).to.equal('[abc]');
    });

    it('splitFromSwitchPathItem for "/abc/edf[abc]"', () => {
      const path = "/abc/edf[abc]";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('/abc/edf');
      expect(strs[1]).to.equal('[abc]');
    });

    it('splitFromSwitchPathItem for "/abc/edf[abc][edf]"', () => {
      const path = "/abc/edf[abc][edf]";

      const strs = splitFromSwitchPathItem(path);

      expect(strs[0]).to.equal('/abc/edf');
      expect(strs[1]).to.equal('[abc][edf]');
    });

  });

  describe('splitSwitchExpressions', () => {

    it('splitSwitchExpressions for "[abc][def]"', () => {
      const expressions = "[abc][edf]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['abc', 'edf']);
    });

    it('splitSwitchExpressions for ""', () => {
      const expressions = "";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(0);
      expect(strs).to.deep.equal([]);
    });

    it('splitSwitchExpressions for " "', () => {
      const expressions = " ";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(0);
      expect(strs).to.deep.equal([]);
    });

    it('splitSwitchExpressions for "[]"', () => {
      const expressions = "[]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(1);
      expect(strs).to.deep.equal(['']);
    });

    it('splitSwitchExpressions for "[][]"', () => {
      const expressions = "[][]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['', '']);
    });

    it('splitSwitchExpressions for "[] []"', () => {
      const expressions = "[] []";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['', '']);
    });

    it('splitSwitchExpressions for "[abc] <TAB><NEWLINE>[def]"', () => {
      const expressions = "[abc] \t\n[def]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['abc', 'def']);
    });

    it('splitSwitchExpressions for "[abc]xx[def]" throws Error', () => {
      const expressions = "[abc]xx[def]";

      expect(() => {
        splitSwitchExpressions(expressions);
      }).throws();
    });

    it('splitSwitchExpressions for "[[]"', () => {
      const expressions = "[[]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(1);
      expect(strs).to.deep.equal(['[']);
    });

    it('splitSwitchExpressions for "[]]" throws Error', () => {
      const expressions = "[]]";

      expect(() => {
        splitSwitchExpressions(expressions);
      }).throws();
    });

    it('splitSwitchExpressions for " [abc]"', () => {
      const expressions = " [abc]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(1);
      expect(strs).to.deep.equal(['abc']);
    });

    it('splitSwitchExpressions for "[abc] "', () => {
      const expressions = "[abc] ";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(1);
      expect(strs).to.deep.equal(['abc']);
    });

    it('splitSwitchExpressions for "[abc]"', () => {
      const expressions = "[abc]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(1);
      expect(strs).to.deep.equal(['abc']);
    });


    it('splitSwitchExpressions for "[a][b=1]"', () => {
      const expressions = "[a][b=1]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', 'b=1']);
    });

    it(`splitSwitchExpressions for "[a][b='1']"`, () => {
      const expressions = `[a][b='1']`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b='1'`]);
    });

    it(`splitSwitchExpressions for "[a][b="1"]"`, () => {
      const expressions = `[a][b="1"]`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b="1"`]);
    });


    it('splitSwitchExpressions for "[a][b==]"', () => {
      const expressions = "[a][b==]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', 'b==']);
    });

    it(`splitSwitchExpressions for "[a][b==]"`, () => {
      const expressions = `[a][b==]`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b==`]);
    });

    it(`splitSwitchExpressions for "[a][b==]"`, () => {
      const expressions = `[a][b==]`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b==`]);
    });


    it('splitSwitchExpressions for "[a][b=[]"', () => {
      const expressions = "[a][b=[]";

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', 'b=[']);
    });

    it(`splitSwitchExpressions for "[a][b='[']"`, () => {
      const expressions = `[a][b='[']`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b='['`]);
    });

    it(`splitSwitchExpressions for "[a][b="["]"`, () => {
      const expressions = `[a][b="["]`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b="["`]);
    });


    it('splitSwitchExpressions for "[a][b=]]" throws Error', () => {
      const expressions = "[a][b=]]";
      expect(() => {
        splitSwitchExpressions(expressions);
      }).throws();
    });

    it(`splitSwitchExpressions for "[a][b=]]" throws Error`, () => {
      const expressions = `[a][b=]]`;
      expect(() => {
        splitSwitchExpressions(expressions);
      }).throws();
    });

    it(`splitSwitchExpressions for "[a][b=]]" throws Error`, () => {
      const expressions = `[a][b=]]`;
      expect(() => {
        splitSwitchExpressions(expressions);
      }).throws();
    });


    it(`splitSwitchExpressions for "[a][b='"']"`, () => {
      const expressions = `[a][b='"']`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b='"'`]);
    });

    it(`splitSwitchExpressions for "[a][b="'"]"`, () => {
      const expressions = `[a][b="'"]`;

      const strs = splitSwitchExpressions(expressions);

      expect(strs.length).to.equal(2);
      expect(strs).to.deep.equal(['a', `b="'"`]);
    });

  });

  describe('parsePath', () => {

    it('parsePath for ""', () => {
      const path = "";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(0);
    });

    it('parsePath for "/"', () => {
      const path = "/";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(0);
    });

    it('parsePath for " "', () => {
      const path = " ";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(0);
    });

    it('parsePath for "/ "', () => {
      const path = "/ ";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(0);
    });

    it('parsePath for " /"', () => {
      const path = " /";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(0);
    });

    it('parsePath for "//" throws Error', () => {
      const path = "//";

      expect(() => {
        parsePath(path);
      }).throws();
    });

    it('parsePath for "item1"', () => {
      const path = "item1";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0]).instanceOf(StaticPathItem);
      expect(pathItems[0].getUniqueName(false)).equal('item1')
    });

    it('parsePath for "/item1"', () => {
      const path = "/item1";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0]).to.instanceOf(StaticPathItem);
      expect(pathItems[0].getUniqueName(false)).to.equal('item1');
    });

    it('parsePath for ":item1"', () => {
      const path = ":item1";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0]).instanceOf(DynamicPathItem);
      expect(pathItems[0].getUniqueName(false)).equal(':item1');
    });

    it('parsePath for "/:item1"', () => {
      const path = "/:item1";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0]).instanceOf(DynamicPathItem);
      expect(pathItems[0].getUniqueName(false)).equal(':item1');
    });

    it('parsePath for "item1/" throws Error', () => {
      const path = "item1/";

      expect(() => {
        parsePath(path);
      }).throws();
    });

    it('parsePath for "/item1/" throws Error', () => {
      const path = "/item1/";

      expect(() => {
        parsePath(path);
      }).throws();
    });

    it('parsePath for "/:item1"', () => {
      const path = "/:item1";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0]).to.instanceOf(DynamicPathItem);
      expect(pathItems[0].getUniqueName(false)).to.equal(':item1');
    });

    it('parsePath for "/item1/item2"', () => {
      const path = "/item1/item2";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(2);
      expect(pathItems[0]).to.instanceOf(StaticPathItem);
      expect(pathItems[0].getUniqueName(false)).to.equal('item1');
      expect(pathItems[1]).to.instanceOf(StaticPathItem);
      expect(pathItems[1].getUniqueName(false)).to.equal('item2');
    });

    it('parsePath for "[x]"', () => {
      const path = "[x]";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0].getUniqueName(false)).to.equal('[x]')
    });

    it('parsePath for "/[x]"', () => {
      const path = "/[x]";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0].getUniqueName(false)).to.equal('[x]')
    });

    it('parsePath for "[x][y]"', () => {
      const path = "[x][y]";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(1);
      expect(pathItems[0].getUniqueName(false)).to.equal('[x][y]')
    });

    it('parsePath for "/item1[x=/etc]"', () => {
      const path = "/item1[x=/etc]";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(2);
      expect(pathItems[0]).to.instanceOf(StaticPathItem);
      expect(pathItems[0].getUniqueName(false)).to.equal('item1');
      expect(pathItems[1].getUniqueName(false)).to.equal('[x=/etc]')
    });

    it('parsePath for "/item1[a=My folder]"', () => {
      const path = "/item1[a=My folder]";

      const pathItems = parsePath(path);

      expect(pathItems).have.lengthOf(2);
      expect(pathItems[0]).to.instanceOf(StaticPathItem);
      expect(pathItems[0].getUniqueName(false)).to.equal('item1');
    });

  });

  describe('matchCommands', () => {
    it('matchCommands for [] and empty tree', () => {
      const root = new RootPathItem();

      const output = matchCommands([], root);
      expect(output).equal(root);
    });

    it('matchCommands for [cmd1] and empty tree', () => {
      const root = new RootPathItem();

      const output = matchCommands(['cmd1'], root);
      expect(output).be.null;
    });

    it('matchCommands for [] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      const output = matchCommands([], root);
      expect(output).equal(root);
    });

    it('matchCommands for [cmd1] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      const output = matchCommands(['cmd1'], root);
      expect(output).equal(pathItem1);
    });

    it('matchCommands for [something] and empty tree', () => {
      const root = new RootPathItem();

      const output = matchCommands(['something'], root);
      expect(output).be.null;
    });

    it('matchCommands for [] and tree {dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);

      root.setDynamicPathItem(pathItem1);

      const output = matchCommands([], root);
      expect(output).equal(root);
    });

    it('matchCommands for [something] and tree {dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);

      root.setDynamicPathItem(pathItem1);

      const output = matchCommands(['something'], root);
      expect(output).equal(pathItem1);
    });

    it('matchCommands for [cmd1, cmd2] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      const output = matchCommands(['cmd1', 'cmd2'], root);
      expect(output).be.null;
    });

    it('matchCommands for [cmd1] and tree {cmd1->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommands(['cmd1'], root);
      expect(output).equal(pathItem1);
    });

    it('matchCommands for [cmd1, something] and tree {cmd1->dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new DynamicPathItem('dynamic', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.setDynamicPathItem(pathItem2);

      const output = matchCommands(['cmd1', 'something'], root);
      expect(output).equal(pathItem2);
    });

    it('matchCommands for [something, cmd2] and tree {dynamic->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.setDynamicPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommands(['something', 'cmd2'], root);
      expect(output).equal(pathItem2);
    });

    it('matchCommands for [something, otherthing] and tree {dynamic->dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic1', null);
      const pathItem2 = new DynamicPathItem('dynamic2', null);

      root.setDynamicPathItem(pathItem1);
      pathItem1.setDynamicPathItem(pathItem2);

      const output = matchCommands(['something', 'otherthing'], root);
      expect(output).equal(pathItem2);
    });

    it('matchCommands for [cmd1, cmd2] and tree {cmd1->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommands(['cmd1', 'cmd2'], root);
      expect(output).equal(pathItem2);
    });
  });

  describe('matchCommandsGetPathParameters', () => {

    it('matchCommandsGetPathParameters for [] and empty tree', () => {
      const root = new RootPathItem();

      const output = matchCommandsGetPathParameters([], root);
      expect(output).deep.equal({});
    });

    it('matchCommandsGetPathParameters for [cmd1] and empty tree', () => {
      const root = new RootPathItem();

      expect(() => {
        matchCommandsGetPathParameters(['cmd1'], root);
      }).throws();
    });

    it('matchCommandsGetPathParameters for [] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      const output = matchCommandsGetPathParameters([], root);
      expect(output).deep.equal({});
    });

    it('matchCommandsGetPathParameters for [cmd1] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      const output = matchCommandsGetPathParameters(['cmd1'], root);
      expect(output).deep.equal({});
    });

    it('matchCommandsGetPathParameters for [something] and empty tree', () => {
      const root = new RootPathItem();

      expect(() => {
        matchCommandsGetPathParameters(['something'], root);
      }).throws();
    });

    it('matchCommandsGetPathParameters for [] and tree {dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);

      root.setDynamicPathItem(pathItem1);

      const output = matchCommandsGetPathParameters([], root);
      expect(output).deep.equal({});
    });

    it('matchCommandsGetPathParameters for [something] and tree {dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);

      root.setDynamicPathItem(pathItem1);

      const output = matchCommandsGetPathParameters(['something'], root);
      expect(output).deep.equal({ dynamic: 'something' });
    });

    it('matchCommandsGetPathParameters for [cmd1, cmd2] and tree {cmd1}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);

      root.addStaticPathItem(pathItem1);

      expect(() => {
        matchCommandsGetPathParameters(['cmd1', 'cmd2'], root);
      }).throws();
    });

    it('matchCommandsGetPathParameters for [cmd1] and tree {cmd1->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommandsGetPathParameters(['cmd1'], root);
      expect(output).deep.equal({});
    });

    it('matchCommandsGetPathParameters for [cmd1, something] and tree {cmd1->dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new DynamicPathItem('dynamic', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.setDynamicPathItem(pathItem2);

      const output = matchCommandsGetPathParameters(['cmd1', 'something'], root);
      expect(output).deep.equal({ dynamic: 'something' });
    });

    it('matchCommandsGetPathParameters for [something, cmd2] and tree {dynamic->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.setDynamicPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommandsGetPathParameters(['something', 'cmd2'], root);
      expect(output).deep.equal({ dynamic: 'something' });
    });

    it('matchCommandsGetPathParameters for [something, otherthing] and tree {dynamic->dynamic}', () => {
      const root = new RootPathItem();
      const pathItem1 = new DynamicPathItem('dynamic1', null);
      const pathItem2 = new DynamicPathItem('dynamic2', null);

      root.setDynamicPathItem(pathItem1);
      pathItem1.setDynamicPathItem(pathItem2);

      const output = matchCommandsGetPathParameters(['something', 'otherthing'], root);
      expect(output).deep.equal({ dynamic1: 'something', dynamic2: 'otherthing' });
    });

    it('matchCommandsGetPathParameters for [cmd1, cmd2] and tree {cmd1->cmd2}', () => {
      const root = new RootPathItem();
      const pathItem1 = new StaticPathItem('cmd1', null);
      const pathItem2 = new StaticPathItem('cmd2', null);

      root.addStaticPathItem(pathItem1);
      pathItem1.addStaticPathItem(pathItem2);

      const output = matchCommandsGetPathParameters(['cmd1', 'cmd2'], root);
      expect(output).deep.equal({});
    });

  });

  describe('matchSwitches', () => {

    it('matchSwitches for expressionPathItems ""', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
    });

    it('matchSwitches for expressionPathItems "[a]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[a=1]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a=1]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });
    
    it('matchSwitches for expressionPathItems "[a][b]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a][b]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[a=1][b]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a=1][b]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[b][a]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[b][a]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[a][c]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a][c]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
    });

    it('matchSwitches for expressionPathItems "[c]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[c]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
    });

    it('matchSwitches for expressionPathItems "[aa]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[aa=1]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa=1]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[aa][bb]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa][bb]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[aa=1][bb]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa=1][bb]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[bb][aa]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[bb][aa]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[aa][ac]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa][ac]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
    });

    it('matchSwitches for expressionPathItems "[cc]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[cc]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
    });

    it('matchSwitches for expressionPathItems "[a][aa]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[a][aa]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });

    it('matchSwitches for expressionPathItems "[aa][a]"', () => {
      const blockPathItem = new StaticPathItem('cmd1', null);
      const switchPathItemA = new SwitchPathItem('[aa][a]', null);
      blockPathItem.addSwitchPathItem(switchPathItemA);
      
      expect(matchSwitches({}, {}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:[], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1"], bb:["2"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:[]}, blockPathItem)).be.null;
      expect(matchSwitches({}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).be.null;
      
      expect(matchSwitches({a:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:[], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:[], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:[], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:[]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:[]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {}, blockPathItem)).be.null;
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:[], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:[]}, blockPathItem)).equal(switchPathItemA);
      expect(matchSwitches({a:["1", "10"], b:["2"]}, {aa:["1", "10"], bb:["2"]}, blockPathItem)).equal(switchPathItemA);
    });
  });

  describe('processCallbacks()', () => {
    it('processCallbacks with regular callbacks', () => {
      const pathItem = new StaticPathItem('static1', null);
      const partialContext = { z: 9 };
      const args: ExternalArgsType = {
        commands: [],
        shortSwitches: {},
        longSwitches: {}
      }
      const pathParameters = {};
      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'h',
        helpLongSwitch: 'help',
        helpOnNoTarget: true,
        helpOnNoCallback: true,
        helpOnVerifySwitchFailure: true,
        helpOnAskedForHelp: true,
      }
      const tree = new PathTree;

      let callback1Called = false;
      let callback2Called = false;

      const callback1 = () => { callback1Called = true; return { a: 1 } };
      const callback2 = () => { callback2Called = true; return { b: 2 } };
      const callbacks = [ callback1, callback2 ];

      const output = processCallbacks(pathItem, partialContext, args, pathParameters, config, tree, callbacks);

      expect(callback1Called).be.true;
      expect(callback2Called).be.true;
      expect(output).deep.equal({ a: 1, b: 2, z: 9 });
    });

    it('processCallbacks with empty callbacks', () => {
      const pathItem = new StaticPathItem('static1', null);
      const partialContext = { z: 9 };
      const args: ExternalArgsType = {
        commands: [],
        shortSwitches: {},
        longSwitches: {}
      }
      const pathParameters = {};
      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'h',
        helpLongSwitch: 'help',
        helpOnNoTarget: true,
        helpOnNoCallback: true,
        helpOnVerifySwitchFailure: true,
        helpOnAskedForHelp: true,
      }
      const tree = new PathTree;

      const callbacks: Callback[] = [];

      const output = processCallbacks(pathItem, partialContext, args, pathParameters, config, tree, callbacks);

      expect(output).deep.equal({ z: 9 });
    });

    it('processCallbacks when one callback do not return', () => {
      const pathItem = new StaticPathItem('static1', null);
      const partialContext = { z: 9 };
      const args: ExternalArgsType = {
        commands: [],
        shortSwitches: {},
        longSwitches: {}
      }
      const pathParameters = {};
      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'h',
        helpLongSwitch: 'help',
        helpOnNoTarget: true,
        helpOnNoCallback: true,
        helpOnVerifySwitchFailure: true,
        helpOnAskedForHelp: true,
      }
      const tree = new PathTree;

      let callback1Called = false;
      let callback2Called = false;

      const callback1 = () => { callback1Called = true; return { a: 1 } };
      const callback2 = () => { callback2Called = true; };
      const callbacks = [ callback1, callback2 ];

      const output = processCallbacks(pathItem, partialContext, args, pathParameters, config, tree, callbacks);

      expect(callback1Called).be.true;
      expect(callback2Called).be.true;
      expect(output).deep.equal({ a: 1, z: 9 });
    });

    it('processCallbacks when one callback returns "stop"', () => {
      const pathItem = new StaticPathItem('static1', null);
      const partialContext = {};
      const args: ExternalArgsType = {
        commands: [],
        shortSwitches: {},
        longSwitches: {}
      }
      const pathParameters = {};
      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'h',
        helpLongSwitch: 'help',
        helpOnNoTarget: true,
        helpOnNoCallback: true,
        helpOnVerifySwitchFailure: true,
        helpOnAskedForHelp: true,
      }
      const tree = new PathTree;

      let callback0Called = false;
      let callback1Called = false;
      let callback2Called = false;

      const callback0 = () => { callback0Called = true; return {a: 1}; };
      const callback1: Callback = () => { callback1Called = true; return 'stop' };
      const callback2 = () => { callback2Called = true; return {b: 2}; };
      const callbacks = [ callback0, callback1, callback2 ];

      const output = processCallbacks(pathItem, partialContext, args, pathParameters, config, tree, callbacks);

      expect(callback0Called).be.true;
      expect(callback1Called).be.true;
      expect(callback2Called).be.false;
      expect(output).deep.equal('stop');
    });
  });

  describe('strictSwitchMatching', () => {
    it('strictSwitchMatching() for valid empty switches', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static', rootPathItem);

      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'z',
        helpLongSwitch: 'zelp',
        helpOnNoTarget: false,
        helpOnNoCallback: false,
        helpOnVerifySwitchFailure: false,
        helpOnAskedForHelp: false
      }

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {}, {}, config);
        matchRuntimeAndDefinedSwitches(staticPathItem, {}, {}, config);
      }).not.throw();
    });

    it('strictSwitchMatching() for valid cases', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static', rootPathItem);

      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'bb'));
      rootPathItem.addCommonRequiredSwitch(new Switch('c', 'cc'));

      rootPathItem.addCommonOptionalSwitch(new Switch('d', null));
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'ee'));
      rootPathItem.addCommonOptionalSwitch(new Switch('f', 'ff'));

      rootPathItem.addRequiredSwitch(new Switch('g', null));
      rootPathItem.addRequiredSwitch(new Switch(null, 'hh'));
      rootPathItem.addRequiredSwitch(new Switch('i', 'ii'));

      rootPathItem.addOptionalSwitch(new Switch('j', null));
      rootPathItem.addOptionalSwitch(new Switch(null, 'kk'));
      rootPathItem.addOptionalSwitch(new Switch('l', 'll'));

      staticPathItem.addCommonRequiredSwitch(new Switch('m', null));
      staticPathItem.addCommonRequiredSwitch(new Switch(null, 'nn'));
      staticPathItem.addCommonRequiredSwitch(new Switch('o', 'oo'));

      staticPathItem.addCommonOptionalSwitch(new Switch('p', null));
      staticPathItem.addCommonOptionalSwitch(new Switch(null, 'qq'));
      staticPathItem.addCommonOptionalSwitch(new Switch('r', 'rr'));

      staticPathItem.addRequiredSwitch(new Switch('s', null));
      staticPathItem.addRequiredSwitch(new Switch(null, 'tt'));
      staticPathItem.addRequiredSwitch(new Switch('u', 'uu'));

      staticPathItem.addOptionalSwitch(new Switch('v', null));
      staticPathItem.addOptionalSwitch(new Switch(null, 'ww'));
      staticPathItem.addOptionalSwitch(new Switch('x', 'xx'));

      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'z',
        helpLongSwitch: 'zelp',
        helpOnNoTarget: false,
        helpOnNoCallback: false,
        helpOnVerifySwitchFailure: false,
        helpOnAskedForHelp: false
      }

      /******************************************
       * rootPathItem
       ******************************************/

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [] }, {bb: [], ee: [], hh: [], kk: [] }, config);
      }).not.throws();

      // short help
      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [], z: [] }, {bb: [], ee: [], hh: [], kk: [] }, config);
      }).not.throws();

      // long help
      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [] }, {bb: [], ee: [], hh: [], kk: [], zelp: [] }, config);
      }).not.throws();

      /******************************************
       * staticPathItem
       ******************************************/

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [] }, config);
      }).not.throws();

      // short help
      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: [], z: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [] }, config);
      }).not.throws();

      // long help
      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [], zelp: [] }, config);
      }).not.throws();
    });

    it('strictSwitchMatching() for invalid cases', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static', rootPathItem);

      rootPathItem.addCommonRequiredSwitch(new Switch('a', null));
      rootPathItem.addCommonRequiredSwitch(new Switch(null, 'bb'));
      rootPathItem.addCommonRequiredSwitch(new Switch('c', 'cc'));

      rootPathItem.addCommonOptionalSwitch(new Switch('d', null));
      rootPathItem.addCommonOptionalSwitch(new Switch(null, 'ee'));
      rootPathItem.addCommonOptionalSwitch(new Switch('f', 'ff'));

      rootPathItem.addRequiredSwitch(new Switch('g', null));
      rootPathItem.addRequiredSwitch(new Switch(null, 'hh'));
      rootPathItem.addRequiredSwitch(new Switch('i', 'ii'));

      rootPathItem.addOptionalSwitch(new Switch('j', null));
      rootPathItem.addOptionalSwitch(new Switch(null, 'kk'));
      rootPathItem.addOptionalSwitch(new Switch('l', 'll'));

      staticPathItem.addCommonRequiredSwitch(new Switch('m', null));
      staticPathItem.addCommonRequiredSwitch(new Switch(null, 'nn'));
      staticPathItem.addCommonRequiredSwitch(new Switch('o', 'oo'));

      staticPathItem.addCommonOptionalSwitch(new Switch('p', null));
      staticPathItem.addCommonOptionalSwitch(new Switch(null, 'qq'));
      staticPathItem.addCommonOptionalSwitch(new Switch('r', 'rr'));

      staticPathItem.addRequiredSwitch(new Switch('s', null));
      staticPathItem.addRequiredSwitch(new Switch(null, 'tt'));
      staticPathItem.addRequiredSwitch(new Switch('u', 'uu'));

      staticPathItem.addOptionalSwitch(new Switch('v', null));
      staticPathItem.addOptionalSwitch(new Switch(null, 'ww'));
      staticPathItem.addOptionalSwitch(new Switch('x', 'xx'));

      const config: Config = {
        applicationName: '<App>',
        checkForSwitchConflicts: true,
        strictSwitchMatching: true,
        helpType: 'switch',
        helpShortSwitch: 'z',
        helpLongSwitch: 'zelp',
        helpOnNoTarget: false,
        helpOnNoCallback: false,
        helpOnVerifySwitchFailure: false,
        helpOnAskedForHelp: false
      }

      /******************************************
       * rootPathItem
       ******************************************/

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {}, {}, config);
      }, 'missing required switches (1)').throws('is required');
      
      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: []}, {}, config);
      }, 'missing required switches (2)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: []}, {bb: []}, config);
      }, 'missing required switches (3)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (4)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[]}, {bb: []}, config);
      }, 'missing required switches (5)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[]}, {bb: [], hh: []}, config);
      }, 'missing required switches (6)').throws('is required');

      expect(() => {
        // not throws
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], hh: []}, config);
      }, 'no missing required switches (7)').not.throws();

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], cc: [], hh: []}, config);
      }, 'short "c" and long "cc" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: [], f: []}, {bb: [], hh: [], ff: []}, config);
      }, 'short "f" and long "ff" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], hh: [], ii: []}, config);
      }, 'short "i" and long "ii" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: []}, {bb: [], hh: [], ll: []}, config);
      }, 'short "l" and long "ll" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: [], y: []}, {bb: [], hh: []}, config);
      }, 'passed not defined switch "y"').throws('is not recognized');

      expect(() => {
        matchRuntimeAndDefinedSwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: []}, {bb: [], hh: [], yy: []}, config);
      }, 'passed not defined switch "yy"').throws('is not recognized');

      /******************************************
       * staticPathItem
       ******************************************/

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {}, {}, config);
      }, 'missing required switches (8)').throws('is required');
      
      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: []}, {}, config);
      }, 'missing required switches (9)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: []}, {bb: []}, config);
      }, 'missing required switches (10)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (11)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (12)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (13)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (14)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: []}, {bb: []}, config);
      }, 'missing required switches (15)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (16)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (17)').throws('is required');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (18)').throws('is required');
      
      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: []}, {bb: [], nn: [], tt: []}, config);
      }, 'missing required switches (19)').throws('is required');

      expect(() => {
        // not throws
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: []}, config);
      }, 'missing required switches (20)').not.throws();

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], cc: [], nn: [], tt: []}, config);
      }, 'short "c" and long "cc" switches passed').throws('can be passed at the same time');
      
      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], f: [], m: [], o: [], s: [], u: []}, {bb: [], ff:[], nn: [], tt: []}, config);
      }, 'short "f" and long "ff" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], oo: [], tt: []}, config);
      }, 'short "o" and long "oo" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], r: [], s: [], u: []}, {bb: [], nn: [], rr: [], tt: []}, config);
      }, 'short "r" and long "rr" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: [], uu: []}, config);
      }, 'short "u" and long "uu" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: [], x: []}, {bb: [], nn: [], tt: [], xx: []}, config);
      }, 'short "x" and long "xx" switches passed').throws('can be passed at the same time');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: [], y: []}, {bb: [], nn: [], tt: []}, config);
      }, 'passed not defined switch "y"').throws('is not recognized');

      expect(() => {
        matchRuntimeAndDefinedSwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: [], yy: []}, config);
      }, 'passed not defined switch "yy"').throws('is not recognized');
    });

  });

  describe('checkSwitchNameConflicts', () => {

    describe('Test Single PathItem', () => {
      //#region BlockPathItem
      it('BlockPathItem with no conflicting switches', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch(null, 'bb'));
        pathItem.addOptionalSwitch(new Switch('c', 'cc'));
        
        pathItem.addRequiredSwitch(new Switch('d', null));
        pathItem.addRequiredSwitch(new Switch(null, 'ee'));
        pathItem.addRequiredSwitch(new Switch('f', 'ff'));

        pathItem.addCommonOptionalSwitch(new Switch('g', null))
        pathItem.addCommonOptionalSwitch(new Switch(null, 'hh'))
        pathItem.addCommonOptionalSwitch(new Switch('i', 'ii'))

        pathItem.addCommonRequiredSwitch(new Switch('j', null))
        pathItem.addCommonRequiredSwitch(new Switch(null, 'kk'))
        pathItem.addCommonRequiredSwitch(new Switch('l', 'll'))
        
        expect(checkSwitchNameConflicts(pathItem)).deep.equal({
          'a': true, 'bb': true, 'c': true, 'cc': true, 'd': true, 'ee': true, 'f': true, 'ff': true,
          'g': true, 'hh': true, 'i': true, 'ii': true, 'j': true, 'kk': true, 'l': true, 'll': true,
        });
      });

      it('BlockPathItem with conflicting switches (same short switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })

      it('BlockPathItem with conflicting switches (same long switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })

      it('BlockPathItem with conflicting switches (same short common switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addCommonOptionalSwitch(new Switch('a', null));
        pathItem.addCommonOptionalSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })

      it('BlockPathItem with conflicting switches (same common long switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('BlockPathItem with conflicting switches (different short switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addRequiredSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('BlockPathItem with conflicting switches (different long switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addRequiredSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });

      it('BlockPathItem with conflicting switches (different common short switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addCommonOptionalSwitch(new Switch('a', null));
        pathItem.addCommonRequiredSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('BlockPathItem with conflicting switches (different common long switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addCommonOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });

      it('BlockPathItem with conflicting switches (different common and non-common short switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addCommonRequiredSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });

      it('BlockPathItem with conflicting switches (different common and non-common long switches)', () => {
        const pathItem = new StaticPathItem('cmd', null);
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addCommonRequiredSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });
      //#endregion

      //#region SpreadPathItem
      it('SpreadPathItem with no conflicting switches', () => {
        const pathItem = new SpreadPathItem('rest', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch(null, 'bb'));
        pathItem.addOptionalSwitch(new Switch('c', 'cc'));
        
        pathItem.addRequiredSwitch(new Switch('d', null));
        pathItem.addRequiredSwitch(new Switch(null, 'ee'));
        pathItem.addRequiredSwitch(new Switch('f', 'ff'));
        
        expect(checkSwitchNameConflicts(pathItem)).deep.equal({
          'a': true, 'bb': true, 'c': true, 'cc': true, 'd': true, 'ee': true, 'f': true, 'ff': true
        });
      })
  
      it('SpreadPathItem with conflicting switches (same switches)', () => {
        const pathItem = new SpreadPathItem('rest', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('SpreadPathItem with conflicting switches (different short switches)', () => {
        const pathItem = new SpreadPathItem('rest', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addRequiredSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('SpreadPathItem with conflicting switches (different long switches)', () => {
        const pathItem = new SpreadPathItem('rest', null);
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addRequiredSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });
      //#endregion

      //#region SwitchPathItem
      it('SwitchPathItem with no conflicting switches', () => {
        const pathItem = new SwitchPathItem('[a=1][b=2]', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch(null, 'bb'));
        pathItem.addOptionalSwitch(new Switch('c', 'cc'));
        
        pathItem.addRequiredSwitch(new Switch('d', null));
        pathItem.addRequiredSwitch(new Switch(null, 'ee'));
        pathItem.addRequiredSwitch(new Switch('f', 'ff'));
        
        expect(checkSwitchNameConflicts(pathItem)).deep.equal({
          'a': true, 'bb': true, 'c': true, 'cc': true, 'd': true, 'ee': true, 'f': true, 'ff': true
        });
      })
  
      it('SwitchPathItem with conflicting switches (same switches)', () => {
        const pathItem = new SwitchPathItem('[a=1][b=2]', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addOptionalSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('SwitchPathItem with conflicting switches (different short switches)', () => {
        const pathItem = new SwitchPathItem('[a=1][b=2]', null);
        pathItem.addOptionalSwitch(new Switch('a', null));
        pathItem.addRequiredSwitch(new Switch('a', null));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      })
  
      it('SwitchPathItem with conflicting switches (different long switches)', () => {
        const pathItem = new SwitchPathItem('[a=1][b=2]', null);
        pathItem.addOptionalSwitch(new Switch(null, 'aa'));
        pathItem.addRequiredSwitch(new Switch(null, 'aa'));
        
        expect(() => checkSwitchNameConflicts(pathItem)).throw();
      });
      //#endregion
    });

    describe('Test Tree of PathItems', () => {
      let rootPathItem: RootPathItem = null;
      let staticPathItem1: StaticPathItem = null;
      let dynamicPathItem11: DynamicPathItem = null;
      let spreadPathItem1111: SpreadPathItem = null;
      let switchPathItem11111: SwitchPathItem = null;
      let switchPathItem11112: SwitchPathItem = null;
      let staticPathItem2: StaticPathItem = null;

      beforeEach(() => {
        // /
        rootPathItem = new RootPathItem();
        // root/static1
        staticPathItem1 = new StaticPathItem('static1', rootPathItem);
        // root/static1/:dynamic11
        dynamicPathItem11 = new DynamicPathItem('dynamic11', staticPathItem1);
        // root/static1/:dynamic11/...rest111
        spreadPathItem1111 = new SpreadPathItem('rest111', dynamicPathItem11);
        // root/static1/:dynamic11/...rest111[a=1]
        switchPathItem11111 = new SwitchPathItem('[a=1]', spreadPathItem1111);
        // root/static1/:dynamic11/...rest111[a=2]
        switchPathItem11112 = new SwitchPathItem('[a=2]', spreadPathItem1111);
        // root -> static2
        staticPathItem2 = new StaticPathItem('static2', rootPathItem);

        // /
        rootPathItem.addCommonOptionalSwitch(new Switch('a', 'aa'));
        rootPathItem.addCommonRequiredSwitch(new Switch('b', null));
        rootPathItem.addCommonRequiredSwitch(new Switch(null, 'cc'));
        rootPathItem.addOptionalSwitch(new Switch('z', 'zz'))
        rootPathItem.addRequiredSwitch(new Switch('y', null))
        rootPathItem.addRequiredSwitch(new Switch(null, 'xx'))

        // root/static1
        rootPathItem.addStaticPathItem(staticPathItem1);
        staticPathItem1.addCommonRequiredSwitch(new Switch('d', 'dd'));
        staticPathItem1.addCommonOptionalSwitch(new Switch('e', null));
        staticPathItem1.addCommonOptionalSwitch(new Switch(null, 'ee'));
        staticPathItem1.addOptionalSwitch(new Switch('w', 'ww'));
        staticPathItem1.addRequiredSwitch(new Switch('v', null));
        staticPathItem1.addRequiredSwitch(new Switch(null, 'uu'));

        // root/static1/:dynamic11
        staticPathItem1.setDynamicPathItem(dynamicPathItem11);

        // root/static1/:dynamic11/...rest111
        dynamicPathItem11.setSpreadPathItem(spreadPathItem1111)
        spreadPathItem1111.addRequiredSwitch(new Switch('t', null));
        
        // root/static1/:dynamic11/...rest111[a=1]
        spreadPathItem1111.addSwitchPathItem(switchPathItem11111);
        switchPathItem11111.addOptionalSwitch(new Switch('s', 'ss'))

        // root/static1/:dynamic11/...rest111[a=2]
        spreadPathItem1111.addSwitchPathItem(switchPathItem11112);;
        switchPathItem11112.addOptionalSwitch(new Switch('s', 'ss'))

        // root -> static2
        rootPathItem.addStaticPathItem(staticPathItem2);
        staticPathItem2.addCommonRequiredSwitch(new Switch('d', 'dd'));
        staticPathItem2.addCommonOptionalSwitch(new Switch('e', null));
        staticPathItem2.addCommonOptionalSwitch(new Switch(null, 'ee'));
        staticPathItem2.addOptionalSwitch(new Switch('w', 'ww'));
        staticPathItem2.addRequiredSwitch(new Switch('v', null));
        staticPathItem2.addRequiredSwitch(new Switch(null, 'uu'));
        staticPathItem2.addRequiredSwitch(new Switch('t', null));
        staticPathItem2.addOptionalSwitch(new Switch('s', 'ss'));
        staticPathItem2.addOptionalSwitch(new Switch('r', 'rr'));   // extra
      });

      afterEach(() => {
        // /
        rootPathItem = null;
        // root/static1
        staticPathItem1 = null;
        // root/static1/:dynamic11
        dynamicPathItem11 = null;
        // root/static1/:dynamic11/...rest111
        spreadPathItem1111 = null;
        // root/static1/:dynamic11/...rest111[a=1]
        switchPathItem11111 = null;
        // root/static1/:dynamic11/...rest111[a=2]
        switchPathItem11112 = null;
        // root -> static2
        staticPathItem2 = null;
      })

      it('Tree of mix pathItems with no conflicts', () => {
        expect(checkSwitchNameConflicts(rootPathItem)).deep.equal({
          'a': true,
          'aa': true,
          'b': true,
          'cc': true,
          'z': true,
          'zz': true,
          'y': true,
          'xx': true,
          'd': true,
          'dd': true,
          'e': true, 
          'ee': true,
          'w': true,
          'ww': true,
          'v': true,
          'uu': true,
          't': true,
          's': true,
          'ss': true,
          'r': true,
          'rr': true
        })
      })

      it('Tree with conflict on RootPathItem and SwitchPathItem', () => {
        expect(checkSwitchNameConflicts(rootPathItem)).deep.equal({
          'a': true,
          'aa': true,
          'b': true,
          'cc': true,
          'z': true,
          'zz': true,
          'y': true,
          'xx': true,
          'd': true,
          'dd': true,
          'e': true, 
          'ee': true,
          'w': true,
          'ww': true,
          'v': true,
          'uu': true,
          't': true,
          's': true,
          'ss': true,
          'r': true,
          'rr': true
        })

        switchPathItem11111.addOptionalSwitch(new Switch('a', null));
        expect(() => checkSwitchNameConflicts(rootPathItem)).throw('switch name "a". Check the path "/"');
      });
    });
  });

});
