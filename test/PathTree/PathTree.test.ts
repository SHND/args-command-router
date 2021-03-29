import { expect } from 'chai'
import { DynamicPathItem } from '../../src/PathTree/DynamicPathItem';
import { PathTree } from '../../src/PathTree/PathTree';
import { RootPathItem } from '../../src/PathTree/RootPathItem';
import { SpreadPathItem } from '../../src/PathTree/SpreadPathItem';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';

describe('PathTree', () => {
  it('create', () => {
    const tree = new PathTree();
  });

  it('toString', () => {
    const root = new RootPathItem();
    const tree = new PathTree(root);

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

    const output = tree.toString();
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
    └── static44`
    );
  })
})
