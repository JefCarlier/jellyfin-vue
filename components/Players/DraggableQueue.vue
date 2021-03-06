<template>
  <v-list-item-group>
    <draggable v-model="queue" v-bind="dragOptions" class="list-group">
      <v-hover
        v-for="(item, index) in queue"
        :key="`${item.Id}-${getUuid()}`"
        v-slot="{ hover }"
        class="pa-0 ma-0"
      >
        <v-list-item ripple class="pa-0 ma-0" @click="onClick(index)">
          <v-list-item-action
            v-if="!hover"
            class="list-group-item d-flex justify-center d-flex text-caption"
            :class="{ 'primary--text': isPlaying(index) }"
          >
            {{ index + 1 }}
          </v-list-item-action>
          <v-list-item-action v-else class="justify-center d-flex">
            <v-icon>mdi-drag-horizontal</v-icon>
          </v-list-item-action>
          <v-list-item-avatar tile class="list-group-item">
            <blurhash-image :item="item" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              :class="{ 'primary--text': isPlaying(index) }"
              class="text-truncate ml-2 list-group-item"
            >
              {{ item.Name }}
            </v-list-item-title>
            <v-list-item-subtitle
              v-if="getArtists(item)"
              class="ml-2 list-group-item"
              :class="{ 'primary--text': isPlaying(index) }"
            >
              {{ getArtists(item) }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action v-if="!isPlaying(index)">
            <like-button :item="item" />
          </v-list-item-action>
          <v-list-item-action v-if="!isPlaying(index)" class="mr-2">
            <item-menu :item="item" />
          </v-list-item-action>
        </v-list-item>
      </v-hover>
    </draggable>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { BaseItemDto } from '@jellyfin/client-axios';

export default Vue.extend({
  data() {
    return {
      dragOptions: {
        animation: 500,
        delay: 0,
        group: false,
        dragoverBubble: true,
        ghostClass: 'ghost'
      }
    };
  },
  computed: {
    queue: {
      get(): BaseItemDto[] {
        return this.$store.state.playbackManager.queue;
      },
      set(newValue: BaseItemDto[]): void {
        this.setNewQueue({ queue: newValue });
      }
    }
  },
  methods: {
    ...mapGetters('playbackManager', ['getCurrentItem']),
    ...mapActions('playbackManager', ['setNewQueue', 'setCurrentIndex']),
    isPlaying(index: number): boolean {
      return index === this.$store.state.playbackManager.currentItemIndex;
    },
    getArtists(item: BaseItemDto): string | null {
      if (item.Artists) {
        return item.Artists.join(', ');
      } else {
        return null;
      }
    },
    /**
     * There can be duplicated items in the queue, so we generate an unique uuid
     * for each item.
     *
     * @returns {string} The generated UUID.
     */
    getUuid(): string {
      return uuidv4();
    },
    onClick(index: number): void {
      this.setCurrentIndex({ index });
    }
  }
});
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0;
}

.list-group {
  user-select: none;
  min-height: 20px;
}

.list-group-item {
  cursor: grab;
}
</style>
