import { expect } from 'chai'
import { parsePath, splitFromSwitchPathItem, splitSwitchExpressions, hasWhiteSpace, hasAnyOfChars } from '../src/utility';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';

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

});
