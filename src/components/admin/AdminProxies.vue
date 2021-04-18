<template>
    <v-container>
      <v-row>
        <!-- Autocomplete Btag search -->
        <v-autocomplete
          class="ml-5 mr-5"
          v-model="searchPlayerProxiesModel"
          append-icon="mdi-magnify"
          label="Search BattleNet Tag"
          clearable
          placeholder=" "
          :items="searchedPlayers"
          :search-input.sync="search"
          item-text="player.playerIds[0].battleTag"
          item-value="player.playerIds[0].id"
          return-object>
        </v-autocomplete>
      </v-row>

      <review-proxies 
        v-if="showProxyOptions"
        :proxies="availableProxies">
      </review-proxies>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import nodeOverridesCard from "@/components/admin/proxies/nodeOverridesCard.vue";
import reviewProxies from "@/components/admin/proxies/reviewProxies.vue";
import { Proxy, ProxySettings, SearchedPlayer } from "@/store/admin/types";

@Component({ components: { nodeOverridesCard, reviewProxies } })
export default class AdminProxies extends Vue {

  public searchPlayerProxiesModel = {} as SearchedPlayer;
  public search = "";
  public showProxyOptions = false;
  
  @Watch("searchPlayerProxiesModel")
  public async onSearchStringChanged(searchedPlayer : SearchedPlayer) : Promise<void> {
    if (!searchedPlayer) return

    let bTag = searchedPlayer.player.playerIds[0].battleTag;

    await this.$store.direct.dispatch.admin.getProxiesForPlayer({ battleTag: bTag });
    this.showProxyOptions = true;
  }

  get proxiesOnSearchedTag() : ProxySettings {
    return this.$store.direct.state.admin.proxiesSetForSearchedPlayer;
  }

  @Watch("search")
  public onSearchChanged(newValue: string) : void{
    if (newValue && newValue.length > 2) {
      this.$store.direct.dispatch.admin.searchBnetTag({
        searchText: newValue.toLowerCase()
      });
    } else {
      this.$store.direct.dispatch.admin.clearSearch();
    }
  }  

  get searchedPlayers(): SearchedPlayer[] {
    return this.$store.direct.state.admin.searchedPlayers;
  }

  public sanitizeString(string : string) : string {

    let str = string;
    str = str.replace(/-/g, `_`);

    return str;
  }

  get availableProxies() : Proxy[] {
    return this.$store.direct.state.admin.availableProxies;
  }

  get isAdmin(): boolean {
    return this.$store.direct.state.oauth.isAdmin;
  }

  @Watch("isAdmin")
  onBattleTagChanged() : void {
    this.init();
  }

  private async init() : Promise<void> {
    if (this.isAdmin) {
      await this.$store.direct.dispatch.admin.loadAvailableProxies(this.$store.direct.state.oauth.token);
    }
  }

  async mounted() : Promise<void> {
    await this.init();
  }
}
</script>

<style lang="scss">

</style>