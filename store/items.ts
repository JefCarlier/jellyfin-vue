import { BaseItemDto } from '@jellyfin/client-axios';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import find from 'lodash/find';
import remove from 'lodash/remove';

const itemEquality = (id: string) => (el: BaseItemDto): boolean =>
  el?.Id === id;

export interface ItemsState {
  items: BaseItemDto[];
}

export const defaultState = (): ItemsState => ({ items: [] });

export const state = defaultState;

export const getters: GetterTree<ItemsState, ItemsState> = {
  getItem: (state) => (id: string): BaseItemDto | undefined =>
    find(state.items, itemEquality(id))
};

export const mutations: MutationTree<ItemsState> = {
  ADD_ITEM(state: ItemsState, { item }: { item: BaseItemDto }) {
    if (item.Id) {
      remove(state.items, itemEquality(item.Id));
      state.items.push(item);
    }
  },
  DELETE_ITEM(state: ItemsState, { id }: { id: string }) {
    remove(state.items, itemEquality(id));
  },
  CLEAR_STATE() {
    this.replaceState(defaultState());
  }
};

export const actions: ActionTree<ItemsState, ItemsState> = {
  clearState({ commit }) {
    commit('CLEAR_STATE');
  },
  async fetchAndCommit({ commit }, { id }: { id: string }) {
    const item = (
      await this.$api.userLibrary.getItem({
        userId: this.$auth.user.Id,
        itemId: id
      })
    ).data;

    if (!item.Id) throw new Error('No valid object was fetched');

    commit('INSERT_ITEM', { item });
  },
  async fetchItem({ dispatch, getters }, { id }: { id: string }) {
    if (getters.getItem(id) !== undefined) {
      return;
    }
    await dispatch('fetchAndCommit', { id });
  },
  async fetchItems({ dispatch }, { ids }: { ids: string[] }) {
    for (const id in ids) {
      await dispatch('fetchItem', { id });
    }
  },
  async forceFetchIfExisting({ dispatch, getters }, { id }: { id: string }) {
    if (getters.getItem(id) === undefined) {
      return;
    }
    await dispatch('fetchAndCommit', { id });
  },
  async multiForceFetchIfExisting({ dispatch }, { ids }: { ids: string[] }) {
    for (const id in ids) {
      await dispatch('forceFetchIfExisting', { id });
    }
  }
};
