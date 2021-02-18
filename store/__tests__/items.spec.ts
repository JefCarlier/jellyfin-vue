import Vue, { VueConstructor } from 'vue';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { BaseItemDto } from '@jellyfin/client-axios';
import cloneDeep from 'lodash/cloneDeep';
import {
  state,
  mutations,
  ItemsState,
  defaultState,
  actions,
  getters
} from '../items';

let localVue: VueConstructor<Vue>;
let store: Store<ItemsState>;
let mockCommit: jest.Mock;
let mockDispatch: jest.Mock;

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(Vuex);

  store = new Vuex.Store(cloneDeep({ state, mutations, actions, getters }));

  mockCommit = jest.fn();
  mockDispatch = jest.fn();
});

afterEach((): void => {
  mockCommit.mockReset();
  mockDispatch.mockReset();
});

describe('Vuex: items', () => {
  it('adds an item when ADD_ITEM is commited with valid ID', (): void => {
    store.replaceState({ ...defaultState() });

    const item: BaseItemDto = { Id: 'ID' };
    store.commit('ADD_ITEM', { item });

    expect(store.state.items[0]).toBe(item);
    expect(store.state.items.length).toEqual(1);
  });

  it('updates an item when ADD_ITEM is commited with valid and already set ID', (): void => {
    const item1: BaseItemDto = { Id: 'ID', Name: 'Movie1' };
    const item2: BaseItemDto = { Id: 'ID', Name: 'Movie2' };

    store.replaceState({ ...defaultState(), items: [item1] });

    store.commit('ADD_ITEM', { item: item2 });

    expect(store.state.items[0]).toBe(item2);
    expect(store.state.items.length).toEqual(1);
  });

  it('does nothing when ADD_ITEM is commited with invalid ID', (): void => {
    store.replaceState({ ...defaultState() });

    const item: BaseItemDto = {};
    store.commit('ADD_ITEM', { item });

    expect(store.state.items.length).toEqual(0);
  });

  it('deletes the given ID when DELETE_ITEM is commited with present ID', (): void => {
    const id = 'ID';
    store.replaceState({ ...defaultState(), items: [{ Id: id }] });

    store.commit('DELETE_ITEM', { id });

    expect(store.state.items.length).toEqual(0);
  });

  it('deletes nothing when DELETE_ITEM is commited with non present ID', (): void => {
    const id = 'ID';
    store.replaceState({ ...defaultState(), items: [{ Id: id }] });

    store.commit('DELETE_ITEM', { id: 'randomId' });

    expect(store.state.items.length).toEqual(1);
  });

  it('clears the state when CLEAR_STATE is commited', (): void => {
    store.replaceState({ ...defaultState(), items: [{ Id: 'ID' }] });

    store.commit('CLEAR_STATE');

    expect(store.state.items.length).toEqual(0);
  });

  it('gets the wanted item when getting a present ID', (): void => {
    const id = 'ID';
    const item: BaseItemDto = { Id: id };

    store.replaceState({ ...defaultState() });
    store.state.items.push(item);

    const res = store.getters.getItem(id);

    expect(res).toBe(item);
  });
});
