import { expect } from 'chai';
import { Visibility } from '../../../src/enums';
import { RootPathItem } from '../../../src/PathTree/RootPathItem';
import { treeToString } from '../../../src/plugins/tree/utilities';
import { SpreadPathItem } from '../../../src/PathTree/SpreadPathItem';
import { StaticPathItem } from '../../../src/PathTree/StaticPathItem';
import { SwitchPathItem } from '../../../src/PathTree/SwitchPathItem';
import { DynamicPathItem } from '../../../src/PathTree/DynamicPathItem';

describe('treeToString', () => {
  it('treeToString for single RootPathItem', () => {
    const rootPathItem = new RootPathItem();

    const output = treeToString(rootPathItem);
    expect(output).contain('/')
    expect(output).not.contain('│');
    expect(output).not.contain('─');
    expect(output).not.contain('├');
    expect(output).not.contain('└');

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(1);
  });

  it('treeToString for single StaticPathItem', () => {
    const staticPathItem = new StaticPathItem('static1', null);

    const output = treeToString(staticPathItem);
    expect(output).contain('static1');
    expect(output).not.contain('│');
    expect(output).not.contain('─');
    expect(output).not.contain('├');
    expect(output).not.contain('└');

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(1);
  });

  it('treeToString for single DynamicPathItem', () => {
    const dynamicPathItem = new DynamicPathItem('dynamic1', null);

    const output = treeToString(dynamicPathItem);
    expect(output).contain(':dynamic1');
    expect(output).not.contain('│');
    expect(output).not.contain('─');
    expect(output).not.contain('├');
    expect(output).not.contain('└');

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(1);
  });

  it('treeToString for single SpreadPathItem', () => {
    const dynamicPathItem = new SpreadPathItem('spread1', null);

    const output = treeToString(dynamicPathItem);
    expect(output).contain('...spread1');
    expect(output).not.contain('│');
    expect(output).not.contain('─');
    expect(output).not.contain('├');
    expect(output).not.contain('└');

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(1);
  });

  it('treeToString for single SwitchPathItem', () => {
    const switchPathItem = new SwitchPathItem(`[a][b=1][cc][dd=2][e="3 4"][f='5 6']`, null);

    const output = treeToString(switchPathItem);
    expect(output).contain(`[a][b=1][cc][dd=2][e='3 4'][f='5 6']`);
    expect(output).not.contain('│');
    expect(output).not.contain('─');
    expect(output).not.contain('├');
    expect(output).not.contain('└');

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(1);
  });

  it('treeToString for single StaticPathItem as a child', () => {
    const rootPathItem = new RootPathItem();
    const staticPathItem = new StaticPathItem('static1', rootPathItem);
    rootPathItem.addStaticPathItem(staticPathItem);

    const output = treeToString(rootPathItem);
    expect(output).contain(
`/
└── static1`
    );

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(2);
  });

  it('treeToString for single DynamicPathItem as a child', () => {
    const rootPathItem = new RootPathItem();
    const dynamicPathItem = new DynamicPathItem('dynamic1', rootPathItem);
    rootPathItem.setDynamicPathItem(dynamicPathItem);

    const output = treeToString(rootPathItem);
    expect(output).contain(
`/
└── :dynamic1`
    );

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(2);
  });

  it('treeToString for single SpreadPathItem as a child', () => {
    const rootPathItem = new RootPathItem();
    const spreadPathItem = new SpreadPathItem('spread1', rootPathItem);
    rootPathItem.setSpreadPathItem(spreadPathItem);

    const output = treeToString(rootPathItem);
    expect(output).contain(
`/
└── ...spread1`
    );

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(2);
  });

  it('treeToString for single SwitchPathItem as a child', () => {
    const rootPathItem = new RootPathItem();
    const switchPathItem = new SwitchPathItem('[a][bb=1]', rootPathItem);
    rootPathItem.addSwitchPathItem(switchPathItem);

    const output = treeToString(rootPathItem);
    expect(output).contain(
`/
└── [a][bb=1]`
    );

    const linesNumbers = output.split('\n').length - 1;
    expect(linesNumbers).equal(2);
  });

  it('treeToString for general tree', () => {
    const root = new RootPathItem();
    const dynamic1 = new DynamicPathItem('dynamic1', root);
    const static2 = new StaticPathItem('static2', root);
    const static3 = new StaticPathItem('static3', root);
    const static4 = new StaticPathItem('static4', root);
    root.setDynamicPathItem(dynamic1);
    root.addStaticPathItem(static2);
    root.addStaticPathItem(static3);
    root.addStaticPathItem(static4);

    const dynamic11 = new DynamicPathItem('dynamic11', dynamic1);
    dynamic1.setDynamicPathItem(dynamic11)

    const switch21 = new SwitchPathItem('[a][b=1]', static2);
    const static22 = new StaticPathItem('static11', static2);
    static2.addSwitchPathItem(switch21);
    static2.addStaticPathItem(static22);

    const switch41 = new SwitchPathItem('[cc][cc=22]', static4);
    const spread42 = new SpreadPathItem('spread42', static4);
    const static43 = new StaticPathItem('static43', static4);
    const static44 = new StaticPathItem('static44', static4);
    static4.addSwitchPathItem(switch41);
    static4.setSpreadPathItem(spread42);
    static4.addStaticPathItem(static43);
    static4.addStaticPathItem(static44);
    static44.setVisibility(Visibility.PRIVATE);

    const output = treeToString(root);
    expect(output).contains(
`/
├── :dynamic1
│   └── :dynamic11
├── static2
│   ├── [a][b=1]
│   └── static11
├── static3
└── static4
    ├── ...spread42
    ├── [cc][cc=22]
    ├── static43
    └── static44 (PRIVATE)`
    );
  });

});
