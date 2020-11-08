import { expect } from 'chai'
import { Route } from '../src/Route';
import { PathTree } from '../src/PathTree/PathTree';
import { StaticPathItem } from '../src/PathTree/StaticPathItem';
import { SwitchPathItem } from '../src/PathTree/SwitchPathItem';
import { DynamicPathItem } from '../src/PathTree/DynamicPathItem';


describe('Route', () => {
  describe('matchRouteToTreePathItems()', () => {

    it('matchRouteToTreePathItems for empty tree', () => {
      const tree = new PathTree();

      const items = Route.matchRouteToTreePathItems(tree, '');

      expect(items).lengthOf(0);
    });

    it('matchRouteToTreePathItems for empty tree', () => {
      const tree = new PathTree();

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('staticX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal(':dynamicX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('[a=X]');
      }
    });

    it('matchRouteToTreePathItems for tree {static1}', () => {
      const tree = new PathTree();
      const root = tree.getRoot()
      const static1 = new StaticPathItem('static1', null);
      root.addStaticPathItem(static1);

      {
        const items = Route.matchRouteToTreePathItems(tree, '');
        expect(items).lengthOf(0);
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'static1');
        expect(items).lengthOf(1);
        expect(items[0]).equal(static1);
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX');
        expect(items).lengthOf(1);
        expect(items[0]).not.equal(static1);
        expect(items[0].getUniqueName()).equal('staticX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal(':dynamicX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('[a=X]');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'static1/staticX');
        expect(items).lengthOf(2);
        expect(items[0]).equal(static1);
        expect(items[1].getUniqueName()).equal('staticX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'static1/:dynamicX');
        expect(items).lengthOf(2);
        expect(items[0]).equal(static1);
        expect(items[1].getUniqueName()).equal(':dynamicX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'static1[a=X]');
        expect(items).lengthOf(2);
        expect(items[0]).equal(static1);
        expect(items[1].getUniqueName()).equal('[a=X]');
      }
    });

    it('matchRouteToTreePathItems for tree {:dynamic1}', () => {
      const tree = new PathTree();
      const root = tree.getRoot()
      const dynamic1 = new DynamicPathItem('dynamic1', null);
      root.setDynamicPathItem(dynamic1);

      {
        const items = Route.matchRouteToTreePathItems(tree, '');
        expect(items).lengthOf(0);
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('staticX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, ':dynamic1');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal(':dynamic1');
      }

      {
        expect(() => {
          // Dynamic pathItem with name 'dynamic1' already exist
          Route.matchRouteToTreePathItems(tree, ':dynamicX');
        }).throws()
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('[a=X]');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX/staticXX');
        expect(items).lengthOf(2);
        expect(items[0].getUniqueName()).equal('staticX');
        expect(items[1].getUniqueName()).equal('staticXX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX/:dynamicX');
        expect(items).lengthOf(2);
        expect(items[0].getUniqueName()).equal('staticX');
        expect(items[1].getUniqueName()).equal(':dynamicX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX[a=X]');
        expect(items).lengthOf(2);
        expect(items[0].getUniqueName()).equal('staticX');
        expect(items[1].getUniqueName()).equal('[a=X]');
      }
    });

    it('matchRouteToTreePathItems for tree {[a=1]}', () => {
      const tree = new PathTree();
      const root = tree.getRoot()
      const switch1 = new SwitchPathItem('[a=1]', null);
      root.addSwitchPathItem(switch1)

      {
        const items = Route.matchRouteToTreePathItems(tree, '');
        expect(items).lengthOf(0);
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, 'staticX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal('staticX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, ':dynamicX');
        expect(items).lengthOf(1);
        expect(items[0].getUniqueName()).equal(':dynamicX');
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, '[a=1]');
        expect(items).lengthOf(1);
        expect(items[0]).equal(switch1)
      }

      {
        const items = Route.matchRouteToTreePathItems(tree, '[a=X]');
        expect(items).lengthOf(1);
        expect(items[0]).not.equal(switch1)
        expect(items[0].getUniqueName()).equal('[a=X]');
      }
    });

  });

});
