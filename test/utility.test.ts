import { expect } from 'chai'
import { parsePath, splitFromSwitchPathItem, splitSwitchExpressions, hasWhiteSpace, hasAnyOfChars, matchCommands, matchSwitches, matchCommandsGetPathParameters, processCallbacks, verifySwitches } from '../src/utility';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';
import { RootPathItem } from '../src/PathTree/RootPathItem';
import { SwitchPathItem } from '../src/PathTree/SwitchPathItem';
import { Callback, CallbackReturnType, Config, ExternalArgsType } from '../src/types';
import { PathTree } from '../src/PathTree/PathTree';
import { Switch } from '../src/Switch';

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
        verifySwitches: true,
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
        verifySwitches: true,
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
        verifySwitches: true,
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
        verifySwitches: true,
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

  describe('verifySwitches', () => {
    it('verifySwitches() for valid empty switches', () => {
      const rootPathItem = new RootPathItem();
      const staticPathItem = new StaticPathItem('static', rootPathItem);

      const config: Config = {
        applicationName: '<App>',
        helpType: 'switch',
        verifySwitches: true,
        helpShortSwitch: 'z',
        helpLongSwitch: 'zelp',
        helpOnNoTarget: false,
        helpOnNoCallback: false,
        helpOnVerifySwitchFailure: false,
        helpOnAskedForHelp: false
      }

      expect(() => {
        verifySwitches(rootPathItem, {}, {}, config);
        verifySwitches(staticPathItem, {}, {}, config);
      }).not.throw();
    });

    it('verifySwitches() for valid cases', () => {
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
        helpType: 'switch',
        verifySwitches: true,
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
        verifySwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [] }, {bb: [], ee: [], hh: [], kk: [] }, config);
      }).not.throws();

      // short help
      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [], z: [] }, {bb: [], ee: [], hh: [], kk: [] }, config);
      }).not.throws();

      // long help
      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], d: [], f: [], g:[], i: [], j: [], l: [] }, {bb: [], ee: [], hh: [], kk: [], zelp: [] }, config);
      }).not.throws();

      /******************************************
       * staticPathItem
       ******************************************/

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [] }, config);
      }).not.throws();

      // short help
      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: [], z: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [] }, config);
      }).not.throws();

      // long help
      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], d: [], f: [], m: [], o: [], p: [], r: [], s: [], u: [], v: [], x: []}, {bb: [], ee: [], nn: [], qq: [], tt: [], ww: [], zelp: [] }, config);
      }).not.throws();
    });

    it('verifySwitches() for invalid cases', () => {
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
        verifySwitches: true,
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
        verifySwitches(rootPathItem, {}, {}, config);
      }, 'missing required switches (1)').throws('is required');
      
      expect(() => {
        verifySwitches(rootPathItem, {a: []}, {}, config);
      }, 'missing required switches (2)').throws('is required');

      expect(() => {
        verifySwitches(rootPathItem, {a: []}, {bb: []}, config);
      }, 'missing required switches (3)').throws('is required');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (4)').throws('is required');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[]}, {bb: []}, config);
      }, 'missing required switches (5)').throws('is required');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[]}, {bb: [], hh: []}, config);
      }, 'missing required switches (6)').throws('is required');

      expect(() => {
        // not throws
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], hh: []}, config);
      }, 'no missing required switches (7)').not.throws();

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], cc: [], hh: []}, config);
      }, 'short "c" and long "cc" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: [], f: []}, {bb: [], hh: [], ff: []}, config);
      }, 'short "f" and long "ff" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: []}, {bb: [], hh: [], ii: []}, config);
      }, 'short "i" and long "ii" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: []}, {bb: [], hh: [], ll: []}, config);
      }, 'short "l" and long "ll" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: [], y: []}, {bb: [], hh: []}, config);
      }, 'passed not defined switch "y"').throws('is not recognized');

      expect(() => {
        verifySwitches(rootPathItem, {a: [], c: [], g:[], i: [], l: []}, {bb: [], hh: [], yy: []}, config);
      }, 'passed not defined switch "yy"').throws('is not recognized');

      /******************************************
       * staticPathItem
       ******************************************/

      expect(() => {
        verifySwitches(staticPathItem, {}, {}, config);
      }, 'missing required switches (8)').throws('is required');
      
      expect(() => {
        verifySwitches(staticPathItem, {a: []}, {}, config);
      }, 'missing required switches (9)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: []}, {bb: []}, config);
      }, 'missing required switches (10)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (11)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (12)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (13)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: []}, {bb: []}, config);
      }, 'missing required switches (14)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: []}, {bb: []}, config);
      }, 'missing required switches (15)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (16)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (17)').throws('is required');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: []}, {bb: [], nn: []}, config);
      }, 'missing required switches (18)').throws('is required');
      
      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: []}, {bb: [], nn: [], tt: []}, config);
      }, 'missing required switches (19)').throws('is required');

      expect(() => {
        // not throws
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: []}, config);
      }, 'missing required switches (20)').not.throws();

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], cc: [], nn: [], tt: []}, config);
      }, 'short "c" and long "cc" switches passed').throws('can be passed at the same time');
      
      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], f: [], m: [], o: [], s: [], u: []}, {bb: [], ff:[], nn: [], tt: []}, config);
      }, 'short "f" and long "ff" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], oo: [], tt: []}, config);
      }, 'short "o" and long "oo" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], r: [], s: [], u: []}, {bb: [], nn: [], rr: [], tt: []}, config);
      }, 'short "r" and long "rr" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: [], uu: []}, config);
      }, 'short "u" and long "uu" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: [], x: []}, {bb: [], nn: [], tt: [], xx: []}, config);
      }, 'short "x" and long "xx" switches passed').throws('can be passed at the same time');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: [], y: []}, {bb: [], nn: [], tt: []}, config);
      }, 'passed not defined switch "y"').throws('is not recognized');

      expect(() => {
        verifySwitches(staticPathItem, {a: [], c: [], m: [], o: [], s: [], u: []}, {bb: [], nn: [], tt: [], yy: []}, config);
      }, 'passed not defined switch "yy"').throws('is not recognized');
    });

  });

});
