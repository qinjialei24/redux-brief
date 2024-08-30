import { _actionMap, createModule, generateActionMap, run } from './core';

describe('core', () => {
  describe('createModule', () => {
    it('should create a module with the given options', () => {
      const module = createModule({
        namespace: 'test',
        state: { count: 0 },
        reducer: {
          increment: (payload: number, state) => {
            state.count += payload;
          },
        },
        selector: {
          getCount: (state) => state.test.count,
        },
      });

      expect(module).toBeDefined();
      expect(module.increment).toBeDefined();
    });
  });

  describe('generateActionMap', () => {
    it('should generate action map correctly', () => {
      generateActionMap('count', 'add', 'count/add');
      expect(_actionMap).toHaveProperty('count');
      expect(_actionMap.count).toHaveProperty('add', 'count/add');
    });
  });

  describe('run', () => {
    it('should create store and return expected structure', () => {
      const countModule = createModule({
        namespace: 'count',
        state: { value: 0 },
        reducer: {
          increment: (payload: number, state) => {
            state.value += payload;
          },
        },
        selector: {
          getValue: (state) => state.count.value,
        },
      });

      const result = run({ modules: { count: countModule } });

      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('selectors');
      expect(result).toHaveProperty('reducers');
      expect(result).toHaveProperty('effects');
      expect(result).toHaveProperty('actions');

      expect(result.actions).toHaveProperty('count');
      expect(result.actions.count).toHaveProperty('increment');

      expect(result.selectors).toHaveProperty('getValue');
    });

    it('should handle state changes correctly', () => {
      const countModule = createModule({
        namespace: 'count',
        state: { value: 0 },
        reducer: {
          increment: (payload: number, state) => {
            state.value += payload;
          },
        },
        selector: {
          getValue: (state) => state.count.value,
        },
      });

      const { store, actions, selectors } = run({ modules: { count: countModule } });

      actions.count.increment(5);
      expect(selectors.getValue()).toBe(5);

      actions.count.increment(3);
      expect(selectors.getValue()).toBe(8);
    });
  });
});
