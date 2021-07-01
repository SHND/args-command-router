import { expect } from "chai";
import { Visibility } from "../../../src/enums";
import { PathTree } from "../../../src/PathTree/PathTree";
import { RootPathItem } from "../../../src/PathTree/RootPathItem";
import { StaticPathItem } from "../../../src/PathTree/StaticPathItem";
import { DynamicPathItem } from "../../../src/PathTree/DynamicPathItem";
import { shellSuggestions } from "../../../src/plugins/autoComplete/utilities";

describe('shellSuggestions', () => {
  it('shellSuggestions for empty rootPathItem', () => {
    const tree = new PathTree(new RootPathItem());

    expect(shellSuggestions(tree, [])).deep.equal([]);
    expect(shellSuggestions(tree, ['static1'])).deep.equal([]);
  });

  it('shellSuggestions for rootPathItem', () => {
    const commands: string[] = [];
    const root = new RootPathItem();

    const static1 = new StaticPathItem('static1', root);
    root.addStaticPathItem(static1);

    const static3 = new StaticPathItem('static3', root);
    static3.addAlias('alias31');
    static3.addAlias('alias32');
    root.addStaticPathItem(static3);

    const static2 = new StaticPathItem('static2', root);
    static2.addAlias('alias21')
    root.addStaticPathItem(static2);

    const tree = new PathTree(root);

    const output = shellSuggestions(tree, commands);
    expect(output).deep.equal(['alias21', 'alias31', 'alias32', 'static1', 'static2', 'static3']);
  });

  it('shellSuggestions for hidden pathItems', () => {
    const commands: string[] = [];
    const root = new RootPathItem();

    const static1 = new StaticPathItem('static1', root);
    static1.addAlias('alias11');
    static1.setVisibility(Visibility.PRIVATE);
    root.addStaticPathItem(static1);

    const static2 = new StaticPathItem('static2', root);
    static1.addAlias('alias12');
    root.addStaticPathItem(static2);

    const static12 = new StaticPathItem('static12', static1);
    static12.addAlias('alias21')
    static1.addStaticPathItem(static12);

    const static13 = new StaticPathItem('static13', static1);
    static13.addAlias('alias31');
    static13.addAlias('alias32');
    static13.setVisibility(Visibility.PRIVATE);
    static1.addStaticPathItem(static13);

    const tree = new PathTree(root);

    const output1 = shellSuggestions(tree, []);
    expect(output1).deep.equal(['static2']);

    const output2 = shellSuggestions(tree, ['static1']);
    expect(output2).deep.equal(['alias21', 'static12']);
  });

  it('shellSuggestions for nested pathItems and commmands', () => {
    const commands: string[] = ['static2', '"hello hi"', 'static21'];
    const root = new RootPathItem();
    const static1 = new StaticPathItem('static1', root);
    root.addStaticPathItem(static1);
    
    const static2 = new StaticPathItem('static2', root);
    static2.addAlias('alias21');
    root.addStaticPathItem(static2);

    const static3 = new StaticPathItem('static3', root);
    static3.addAlias('alias31');
    static3.addAlias('alias32');
    root.addStaticPathItem(static3);

    const dynamic1 = new DynamicPathItem('dynamic1', static2);
    static2.setDynamicPathItem(dynamic1);

    const static21 = new StaticPathItem('static21', dynamic1);
    dynamic1.addStaticPathItem(static21);

    const static211 = new StaticPathItem('static211', static21);
    const static212 = new StaticPathItem('static212', static21);
    static212.addAlias('alias2121');
    static212.addAlias('alias2122');
    
    static21.addStaticPathItem(static211);
    static21.addStaticPathItem(static212);

    const tree = new PathTree(root);

    const output = shellSuggestions(tree, commands);
    expect(output).deep.equal(['alias2121', 'alias2122', 'static211', 'static212']);
  });

})
