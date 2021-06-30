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
})
